import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { 
  Network, 
  Server, 
  Sun, 
  Activity, 
  Zap, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Filter, 
  Plus, 
  CheckCircle2, 
  ArrowUpRight, 
  Play, 
  Pause, 
  Sparkles 
} from 'lucide-react';

// Pure color mapping helpers
function getNodeColor(type) {
  switch (type) {
    case 'gateway': return '#10b981'; // Emerald
    case 'satellite': return '#8b5cf6'; // Purple
    case 'solar-tower': return '#f59e0b'; // Amber
    case 'micro-ixp': return '#06b6d4'; // Cyan
    case 'client-cluster': return '#38bdf8'; // Sky
    default: return '#94a3b8';
  }
}

function getLinkColor(type, isSevered) {
  if (isSevered) return '#f43f5e';
  switch (type) {
    case 'fiber': return '#10b981';
    case 'wireless-60ghz': return '#06b6d4';
    case 'wireless-5ghz': return '#38bdf8';
    case 'satellite': return '#8b5cf6';
    case 'mesh-fso': return '#f59e0b';
    case 'mesh-wifi': return '#ec4899';
    case 'backup-mesh': return '#64748b';
    default: return '#94a3b8';
  }
}

export default function NetworkOverview({
  nodes = [],
  links = [],
  onAddNodeModal,
  simulationState = 'normal',
  onToggleLinkState
}) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const simulationRef = useRef(null);
  const zoomBehaviorRef = useRef(null);

  // UI States
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedLink, setSelectedLink] = useState(null);
  const [hoveredEntity, setHoveredEntity] = useState(null);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'gateway' | 'solar-tower' | 'micro-ixp' | 'satellite' | 'client-cluster'
  const [linkMetricView, setLinkMetricView] = useState('load'); // 'load' | 'latency' | 'capacity' | 'none'
  const [isParticleFlowActive, setIsParticleFlowActive] = useState(true);
  const [isPhysicsRunning, setIsPhysicsRunning] = useState(true);
  const [linkDistanceScale] = useState(160);
  const [chargeStrength] = useState(-420);
  const [pingTestingId, setPingTestingId] = useState(null);
  const [pingResults, setPingResults] = useState({});

  // Active severed links derived from simulationState
  const severedLinkIds = useMemo(() => {
    if (simulationState === 'fiber_cut') return ['link-2'];
    if (simulationState === 'solar_storm') return ['link-3', 'link-5'];
    return [];
  }, [simulationState]);

  // Network Metrics calculation
  const networkMetrics = useMemo(() => {
    const totalNodes = nodes.length;
    const onlineNodes = nodes.filter(n => n.status === 'online').length;
    const totalLinks = links.length;
    const activeLinks = links.filter(l => !severedLinkIds.includes(l.id) && l.currentLoadMbps > 0).length;
    const totalThroughput = nodes.reduce((acc, n) => acc + (n.throughputMbps || 0), 0);
    const avgLatency = links.length > 0 
      ? (links.reduce((acc, l) => acc + (l.latencyMs || 0), 0) / links.length).toFixed(1) 
      : '0.0';

    return {
      totalNodes,
      onlineNodes,
      totalLinks,
      activeLinks,
      totalThroughput,
      avgLatency,
      healthScore: Math.round((onlineNodes / (totalNodes || 1)) * 98)
    };
  }, [nodes, links, severedLinkIds]);

  // Keep selected node updated if nodes list changes
  useEffect(() => {
    if (selectedNode) {
      const updated = nodes.find(n => n.id === selectedNode.id);
      if (updated) setSelectedNode(updated);
    } else if (nodes.length > 0) {
      setSelectedNode(nodes[0]);
    }
  }, [nodes, selectedNode]);

  // Simulate Ping function
  const handleRunPing = (nodeId) => {
    setPingTestingId(nodeId);
    setTimeout(() => {
      const simulatedLatency = (1.2 + Math.random() * 4.5).toFixed(2);
      const hops = Math.floor(1 + Math.random() * 3);
      setPingResults(prev => ({
        ...prev,
        [nodeId]: { latency: simulatedLatency, hops, timestamp: new Date().toLocaleTimeString() }
      }));
      setPingTestingId(null);
    }, 600);
  };

  // Main D3 Force Graph Simulation Engine
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    const container = containerRef.current;
    const width = container.clientWidth || 900;
    const height = container.clientHeight || 650;

    svg.attr('width', width).attr('height', height);

    // Deep clone data to avoid D3 mutating props directly
    const simNodes = nodes.map(d => ({
      ...d,
      radius: d.type === 'gateway' ? 26 : d.type === 'micro-ixp' ? 22 : 18
    }));

    const simLinks = links.map(d => ({
      ...d,
      isSevered: severedLinkIds.includes(d.id)
    }));

    // Clear previous elements
    svg.selectAll('*').remove();

    // Definitions: Gradients, Filters, Markers
    const defs = svg.append('defs');

    // Glow filter
    const filter = defs.append('filter')
      .attr('id', 'd3-glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
    filter.append('feGaussianBlur')
      .attr('stdDeviation', '4')
      .attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Root Group for Zoom / Pan
    const g = svg.append('g').attr('class', 'd3-network-viewport');

    // Setup Zoom Behavior
    const zoom = d3.zoom()
      .scaleExtent([0.3, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);
    zoomBehaviorRef.current = { zoom, svg, g, width, height };

    // Background Grid Pattern inside zoom group
    const gridPattern = defs.append('pattern')
      .attr('id', 'd3-grid-pattern')
      .attr('width', 40)
      .attr('height', 40)
      .attr('patternUnits', 'userSpaceOnUse');

    gridPattern.append('path')
      .attr('d', 'M 40 0 L 0 0 0 40')
      .attr('fill', 'none')
      .attr('stroke', 'rgba(51, 65, 85, 0.25)')
      .attr('stroke-width', '1');

    g.append('rect')
      .attr('x', -width * 2)
      .attr('y', -height * 2)
      .attr('width', width * 5)
      .attr('height', height * 5)
      .attr('fill', 'url(#d3-grid-pattern)')
      .attr('pointer-events', 'all')
      .on('click', () => {
        setSelectedLink(null);
      });

    // Create Force Simulation
    const simulation = d3.forceSimulation(simNodes)
      .force('link', d3.forceLink(simLinks).id(d => d.id).distance(d => {
        if (d.type === 'satellite') return linkDistanceScale * 1.35;
        if (d.type === 'fiber') return linkDistanceScale * 0.85;
        return linkDistanceScale;
      }).strength(0.65))
      .force('charge', d3.forceManyBody().strength(chargeStrength))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(d => d.radius + 35).iterations(2))
      .alphaDecay(0.028);

    simulationRef.current = simulation;

    // Layer 1: Links Container
    const linkGroup = g.append('g').attr('class', 'links-layer');
    const particleGroup = g.append('g').attr('class', 'particles-layer');
    const linkLabelGroup = g.append('g').attr('class', 'link-labels-layer');

    // Layer 2: Nodes Container
    const nodeGroup = g.append('g').attr('class', 'nodes-layer');

    // Draw Links
    const linkLines = linkGroup.selectAll('.mesh-link')
      .data(simLinks, d => d.id)
      .enter()
      .append('line')
      .attr('class', 'mesh-link')
      .attr('stroke', d => getLinkColor(d.type, d.isSevered))
      .attr('stroke-width', d => Math.max(2, Math.min(7, (d.capacityMbps || 1000) / 700)))
      .attr('stroke-dasharray', d => d.isSevered ? '6,6' : 'none')
      .attr('stroke-opacity', d => {
        if (filterType !== 'all') {
          const sType = d.source.type || nodes.find(n => n.id === d.source)?.type;
          const tType = d.target.type || nodes.find(n => n.id === d.target)?.type;
          return (sType === filterType || tType === filterType) ? 0.9 : 0.15;
        }
        return d.isSevered ? 0.4 : 0.75;
      })
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedLink(d);
        setSelectedNode(null);
      })
      .on('mouseenter', (event, d) => {
        setHoveredEntity({ type: 'link', data: d });
        d3.select(event.currentTarget)
          .attr('stroke-opacity', 1)
          .attr('filter', 'url(#d3-glow)');
      })
      .on('mouseleave', (event, d) => {
        setHoveredEntity(null);
        d3.select(event.currentTarget)
          .attr('stroke-opacity', d.isSevered ? 0.4 : 0.75)
          .attr('filter', null);
      });

    // Link Labels (Latency / Load / Capacity)
    let linkLabelTexts = null;
    if (linkMetricView !== 'none') {
      linkLabelTexts = linkLabelGroup.selectAll('.link-metric-label')
        .data(simLinks, d => d.id)
        .enter()
        .append('g')
        .attr('class', 'link-metric-label');

      linkLabelTexts.append('rect')
        .attr('rx', 4)
        .attr('ry', 4)
        .attr('fill', 'rgba(15, 23, 42, 0.85)')
        .attr('stroke', d => getLinkColor(d.type, d.isSevered))
        .attr('stroke-width', 0.8);

      linkLabelTexts.append('text')
        .attr('font-size', '10px')
        .attr('font-family', 'var(--font-mono)')
        .attr('fill', '#f8fafc')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'central')
        .text(d => {
          if (d.isSevered) return 'OFFLINE';
          if (linkMetricView === 'latency') return `${d.latencyMs}ms`;
          if (linkMetricView === 'capacity') return `${d.capacityMbps >= 1000 ? (d.capacityMbps/1000).toFixed(1)+'G' : d.capacityMbps+'M'}`;
          return `${d.currentLoadMbps} Mbps`;
        });
    }

    // Packet Particle System along active links
    let particles = [];
    if (isParticleFlowActive) {
      simLinks.forEach(link => {
        if (link.isSevered || link.currentLoadMbps === 0) return;
        const particleCount = Math.max(1, Math.min(4, Math.round(link.currentLoadMbps / 300)));
        for (let i = 0; i < particleCount; i++) {
          particles.push({
            id: `${link.id}-p-${i}`,
            link,
            progress: (i / particleCount) + (Math.random() * 0.2),
            speed: 0.003 + (link.currentLoadMbps / 50000)
          });
        }
      });
    }

    const particleCircles = particleGroup.selectAll('.traffic-particle')
      .data(particles, d => d.id)
      .enter()
      .append('circle')
      .attr('class', 'traffic-particle')
      .attr('r', 3)
      .attr('fill', d => getLinkColor(d.link.type, false))
      .attr('filter', 'url(#d3-glow)')
      .attr('opacity', 0.9);

    // Draw Nodes
    const nodeItems = nodeGroup.selectAll('.mesh-node')
      .data(simNodes, d => d.id)
      .enter()
      .append('g')
      .attr('class', 'mesh-node')
      .style('cursor', 'grab')
      .style('opacity', d => (filterType === 'all' || d.type === filterType) ? 1 : 0.25)
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
        setSelectedLink(null);
      })
      .on('mouseenter', (event, d) => {
        setHoveredEntity({ type: 'node', data: d });
        linkLines.attr('stroke-opacity', l => {
          const isConnected = (l.source.id === d.id || l.target.id === d.id);
          return isConnected ? 1 : 0.15;
        });
      })
      .on('mouseleave', () => {
        setHoveredEntity(null);
        linkLines.attr('stroke-opacity', d => d.isSevered ? 0.4 : 0.75);
      });

    // Drag behavior with smooth pinning
    const drag = d3.drag()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
        d3.select(event.sourceEvent.target.parentNode).style('cursor', 'grabbing');
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event) => {
        if (!event.active) simulation.alphaTarget(0);
        d3.select(event.sourceEvent.target.parentNode).style('cursor', 'grab');
      });

    nodeItems.call(drag);

    // Node Outer Pulse Rings
    nodeItems.append('circle')
      .attr('class', 'pulse-ring')
      .attr('r', d => d.radius + 8)
      .attr('fill', 'none')
      .attr('stroke', d => getNodeColor(d.type))
      .attr('stroke-width', 1.5)
      .attr('stroke-opacity', 0.4)
      .attr('stroke-dasharray', d => d.type === 'satellite' ? '3,3' : 'none');

    // Node Main Body Circle
    nodeItems.append('circle')
      .attr('class', 'body-circle')
      .attr('r', d => d.radius)
      .attr('fill', '#090d16')
      .attr('stroke', d => getNodeColor(d.type))
      .attr('stroke-width', d => (selectedNode && selectedNode.id === d.id) ? 3.5 : 2)
      .attr('filter', d => (selectedNode && selectedNode.id === d.id) ? 'url(#d3-glow)' : null);

    // Node Inner Status Core
    nodeItems.append('circle')
      .attr('class', 'status-core')
      .attr('r', d => (d.radius * 0.42))
      .attr('fill', d => {
        if (d.status === 'warning') return '#fbbf24';
        if (d.status === 'offline') return '#f43f5e';
        return getNodeColor(d.type);
      })
      .attr('opacity', 0.85);

    // Node Labels
    const labels = nodeItems.append('g')
      .attr('class', 'node-labels')
      .attr('transform', d => `translate(0, ${d.radius + 14})`);

    // Label text
    labels.append('text')
      .attr('class', 'label-text-title')
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('fill', '#f8fafc')
      .attr('font-family', 'var(--font-sans)')
      .text(d => d.name);

    labels.append('text')
      .attr('class', 'label-text-sub')
      .attr('y', 14)
      .attr('text-anchor', 'middle')
      .attr('font-size', '9.5px')
      .attr('font-family', 'var(--font-mono)')
      .attr('fill', '#94a3b8')
      .text(d => `${d.asn || d.ip} • ${d.throughputMbps}M`);

    // Simulation Tick handler
    let animationFrameId;
    simulation.on('tick', () => {
      linkLines
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      if (linkLabelTexts) {
        linkLabelTexts.attr('transform', d => {
          const midX = (d.source.x + d.target.x) / 2;
          const midY = (d.source.y + d.target.y) / 2;
          return `translate(${midX}, ${midY})`;
        });

        linkLabelTexts.selectAll('rect')
          .attr('x', -32)
          .attr('y', -10)
          .attr('width', 64)
          .attr('height', 20);
      }

      nodeItems.attr('transform', d => `translate(${d.x}, ${d.y})`);
    });

    // Particle Animation Loop
    if (isParticleFlowActive && particles.length > 0) {
      const animateParticles = () => {
        particles.forEach(p => {
          p.progress = (p.progress + p.speed) % 1;
        });

        particleCircles
          .attr('cx', d => {
            if (!d.link.source.x || !d.link.target.x) return 0;
            return d.link.source.x + (d.link.target.x - d.link.source.x) * d.progress;
          })
          .attr('cy', d => {
            if (!d.link.source.y || !d.link.target.y) return 0;
            return d.link.source.y + (d.link.target.y - d.link.source.y) * d.progress;
          });

        animationFrameId = requestAnimationFrame(animateParticles);
      };
      animateParticles();
    }

    return () => {
      simulation.stop();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [
    nodes, 
    links, 
    filterType, 
    linkMetricView, 
    isParticleFlowActive, 
    chargeStrength, 
    linkDistanceScale, 
    selectedNode, 
    severedLinkIds
  ]);

  // Zoom control handlers
  const handleZoomIn = () => {
    if (zoomBehaviorRef.current) {
      const { zoom, svg } = zoomBehaviorRef.current;
      svg.transition().duration(300).call(zoom.scaleBy, 1.3);
    }
  };

  const handleZoomOut = () => {
    if (zoomBehaviorRef.current) {
      const { zoom, svg } = zoomBehaviorRef.current;
      svg.transition().duration(300).call(zoom.scaleBy, 0.77);
    }
  };

  const handleResetZoom = () => {
    if (zoomBehaviorRef.current) {
      const { zoom, svg } = zoomBehaviorRef.current;
      svg.transition().duration(400).call(zoom.transform, d3.zoomIdentity);
    }
  };

  const handleTogglePhysics = () => {
    if (simulationRef.current) {
      if (isPhysicsRunning) {
        simulationRef.current.stop();
        setIsPhysicsRunning(false);
      } else {
        simulationRef.current.alpha(0.3).restart();
        setIsPhysicsRunning(true);
      }
    }
  };

  const handleReheatSimulation = () => {
    if (simulationRef.current) {
      nodes.forEach(n => {
        delete n.fx;
        delete n.fy;
      });
      simulationRef.current.alpha(0.6).restart();
      setIsPhysicsRunning(true);
    }
  };

  // Helper to find connected links for selected node
  const selectedNodeLinks = useMemo(() => {
    if (!selectedNode) return [];
    return links.filter(l => l.source === selectedNode.id || l.target === selectedNode.id);
  }, [selectedNode, links]);

  return (
    <div id="network-overview-root" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', minHeight: 'calc(100vh - 70px)' }}>
      
      {/* Top Banner / KPIs Header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        
        <div id="card-total-nodes" className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Mesh Topology Nodes</span>
            <Server size={18} color="#10b981" />
          </div>
          <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
            {networkMetrics.onlineNodes} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ {networkMetrics.totalNodes} Online</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={12} /> BGP Edge & Solar Relays Active
          </div>
        </div>

        <div id="card-mesh-links" className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Active Connections</span>
            <Network size={18} color="#06b6d4" />
          </div>
          <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#22d3ee' }}>
            {networkMetrics.activeLinks} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ {networkMetrics.totalLinks} Links</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: severedLinkIds.length > 0 ? '#fb7185' : 'var(--text-secondary)', marginTop: '4px' }}>
            {severedLinkIds.length > 0 ? `⚠️ ${severedLinkIds.length} link(s) severed (Simulation)` : 'Fiber & 60GHz Multi-hop Redundancy'}
          </div>
        </div>

        <div id="card-total-throughput" className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Aggregate Throughput</span>
            <Activity size={18} color="#34d399" />
          </div>
          <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399' }}>
            {(networkMetrics.totalThroughput / 1000).toFixed(2)} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Gbps</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Peak Capacity: 22.0 Gbps (Fiber + RF)
          </div>
        </div>

        <div id="card-mesh-latency" className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Mean Mesh Latency</span>
            <Zap size={18} color="#fbbf24" />
          </div>
          <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fbbf24' }}>
            {networkMetrics.avgLatency} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ms</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Sub-millisecond Local Dark Fiber
          </div>
        </div>

      </div>

      {/* Control Bar: Filter, View Mode, Physics Controls */}
      <div id="toolbar-network-overview" className="glass-panel" style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        
        {/* Left Side: Type Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginRight: '4px', textTransform: 'uppercase', fontWeight: 700 }}>
            <Filter size={13} /> Filter Nodes:
          </span>
          {[
            { id: 'all', label: 'All Nodes' },
            { id: 'gateway', label: 'Gateways' },
            { id: 'solar-tower', label: 'Solar Towers' },
            { id: 'micro-ixp', label: 'Micro-IXP' },
            { id: 'satellite', label: 'Satellites' },
            { id: 'client-cluster', label: 'Client Mesh' },
          ].map(f => (
            <button
              key={f.id}
              id={`filter-btn-${f.id}`}
              onClick={() => setFilterType(f.id)}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: filterType === f.id ? '1px solid #10b981' : '1px solid rgba(51, 65, 85, 0.5)',
                background: filterType === f.id ? 'rgba(16, 185, 129, 0.15)' : 'rgba(15, 23, 42, 0.4)',
                color: filterType === f.id ? '#34d399' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Right Side: View options, particles, and physics */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          
          {/* Link Label selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Link Labels:</span>
            <select
              id="select-link-metric"
              value={linkMetricView}
              onChange={(e) => setLinkMetricView(e.target.value)}
              style={{
                background: 'rgba(30, 41, 59, 0.8)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '0.75rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="load">Live Load (Mbps)</option>
              <option value="latency">Latency (ms)</option>
              <option value="capacity">Bandwidth Capacity</option>
              <option value="none">Hidden</option>
            </select>
          </div>

          {/* Traffic Particles Toggle */}
          <button
            id="btn-toggle-particles"
            onClick={() => setIsParticleFlowActive(prev => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 10px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: isParticleFlowActive ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid rgba(51, 65, 85, 0.5)',
              background: isParticleFlowActive ? 'rgba(6, 182, 212, 0.15)' : 'rgba(15, 23, 42, 0.4)',
              color: isParticleFlowActive ? '#22d3ee' : 'var(--text-muted)'
            }}
          >
            <Sparkles size={13} />
            Traffic Flow {isParticleFlowActive ? 'ON' : 'OFF'}
          </button>

          {/* Physics Play/Pause */}
          <button
            id="btn-toggle-physics"
            onClick={handleTogglePhysics}
            title={isPhysicsRunning ? "Pause dynamic force engine" : "Resume dynamic force engine"}
            style={{
              padding: '5px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(51, 65, 85, 0.6)',
              background: 'rgba(30, 41, 59, 0.6)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {isPhysicsRunning ? <Pause size={14} /> : <Play size={14} color="#34d399" />}
          </button>

          {/* Reheat Simulation / Re-center */}
          <button
            id="btn-reheat-simulation"
            onClick={handleReheatSimulation}
            title="Reheat simulation and release pinned positions"
            style={{
              padding: '5px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(51, 65, 85, 0.6)',
              background: 'rgba(30, 41, 59, 0.6)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <RotateCcw size={14} />
          </button>

          {/* Deploy Node Modal trigger */}
          {onAddNodeModal && (
            <button
              id="btn-deploy-node-overview"
              className="btn-primary"
              onClick={onAddNodeModal}
              style={{ padding: '5px 12px', fontSize: '0.75rem' }}
            >
              <Plus size={14} /> Add Node
            </button>
          )}

        </div>

      </div>

      {/* Main Interactive Stage: D3 Graph Canvas + Side Inspector Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedNode || selectedLink ? '1fr 340px' : '1fr', gap: '20px', flex: 1, minHeight: '580px' }}>
        
        {/* D3 Interactive Graph Area */}
        <div 
          id="d3-graph-container"
          ref={containerRef}
          className="glass-panel"
          style={{ 
            position: 'relative', 
            overflow: 'hidden', 
            height: '100%', 
            minHeight: '560px',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Legend Overlay at Top-Left */}
          <div 
            id="d3-graph-legend"
            style={{ 
              position: 'absolute', 
              top: '14px', 
              left: '14px', 
              zIndex: 10, 
              background: 'rgba(15, 23, 42, 0.85)', 
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(51, 65, 85, 0.6)', 
              borderRadius: '8px', 
              padding: '10px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontSize: '0.72rem'
            }}
          >
            <span style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              D3 Mesh Topology
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                <span>Fiber Gateway</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
                <span>Solar Tower</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#06b6d4', display: 'inline-block' }} />
                <span>Micro-IXP Switch</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6', display: 'inline-block' }} />
                <span>Orbital Backhaul</span>
              </div>
            </div>
            <div style={{ borderTop: '1px solid rgba(51, 65, 85, 0.4)', marginTop: '4px', paddingTop: '4px', color: 'var(--text-muted)' }}>
              Drag nodes to rearrange • Click to inspect • Scroll to zoom
            </div>
          </div>

          {/* Floating Zoom & Layout Controls at Top-Right */}
          <div 
            id="d3-zoom-controls"
            style={{ 
              position: 'absolute', 
              top: '14px', 
              right: '14px', 
              zIndex: 10, 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '6px',
              background: 'rgba(15, 23, 42, 0.85)',
              padding: '6px',
              borderRadius: '8px',
              border: '1px solid rgba(51, 65, 85, 0.6)'
            }}
          >
            <button 
              id="btn-zoom-in"
              onClick={handleZoomIn} 
              title="Zoom In"
              style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '6px', borderRadius: '4px' }}
            >
              <ZoomIn size={16} />
            </button>
            <button 
              id="btn-zoom-out"
              onClick={handleZoomOut} 
              title="Zoom Out"
              style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '6px', borderRadius: '4px' }}
            >
              <ZoomOut size={16} />
            </button>
            <button 
              id="btn-reset-zoom"
              onClick={handleResetZoom} 
              title="Fit to Screen"
              style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '6px', borderRadius: '4px' }}
            >
              <Maximize2 size={16} />
            </button>
          </div>

          {/* SVG Canvas for D3 */}
          <svg 
            id="d3-network-svg"
            ref={svgRef} 
            style={{ width: '100%', height: '100%', minHeight: '560px', display: 'block', background: 'var(--bg-dark)' }} 
          />

          {/* Bottom Live Hover Tooltip (if hovering entity) */}
          {hoveredEntity && (
            <div 
              id="hover-tooltip"
              style={{
                position: 'absolute',
                bottom: '14px',
                left: '14px',
                zIndex: 10,
                background: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '6px',
                padding: '8px 12px',
                fontSize: '0.75rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              {hoveredEntity.type === 'node' ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: getNodeColor(hoveredEntity.data.type) }} />
                    <span style={{ fontWeight: 700, color: '#f8fafc' }}>{hoveredEntity.data.name}</span>
                  </div>
                  <span style={{ color: 'var(--text-secondary)' }}>{hoveredEntity.data.ip || hoveredEntity.data.asn}</span>
                  <span style={{ color: '#34d399', fontWeight: 600 }}>{hoveredEntity.data.throughputMbps} Mbps</span>
                </>
              ) : (
                <>
                  <span style={{ fontWeight: 700, textTransform: 'uppercase', color: getLinkColor(hoveredEntity.data.type, hoveredEntity.data.isSevered) }}>
                    {hoveredEntity.data.type}
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Load: <strong style={{ color: '#f8fafc' }}>{hoveredEntity.data.currentLoadMbps} Mbps</strong> / {hoveredEntity.data.capacityMbps} Mbps
                  </span>
                  <span style={{ color: '#fbbf24' }}>Latency: {hoveredEntity.data.latencyMs} ms</span>
                </>
              )}
            </div>
          )}

        </div>

        {/* Selected Entity Inspector Side Panel */}
        {(selectedNode || selectedLink) && (
          <div 
            id="inspector-panel"
            className="glass-panel" 
            style={{ 
              padding: '20px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '16px',
              overflowY: 'auto',
              maxHeight: '680px'
            }}
          >
            {/* When a Node is Selected */}
            {selectedNode && (
              <>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <span 
                        className="badge" 
                        style={{ 
                          background: `${getNodeColor(selectedNode.type)}22`, 
                          color: getNodeColor(selectedNode.type),
                          border: `1px solid ${getNodeColor(selectedNode.type)}55`
                        }}
                      >
                        {selectedNode.type}
                      </span>
                      <span className={`badge ${selectedNode.status === 'online' ? 'badge-emerald' : 'badge-amber'}`}>
                        {selectedNode.status}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{selectedNode.name}</h3>
                    <div className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {selectedNode.asn ? `${selectedNode.asn} • ${selectedNode.ip}` : selectedNode.ip}
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, background: 'rgba(15, 23, 42, 0.4)', padding: '10px', borderRadius: '8px' }}>
                  {selectedNode.description || 'Decentralized mesh relay node running BGP autonomous peer routing and local WireGuard termination.'}
                </p>

                {/* Throughput Utilization Gauge */}
                <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(51, 65, 85, 0.4)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Throughput Utilization</span>
                    <span className="font-mono" style={{ fontWeight: 700, color: '#34d399' }}>
                      {selectedNode.throughputMbps} / {selectedNode.maxCapacityMbps} Mbps
                    </span>
                  </div>
                  <div style={{ height: '8px', width: '100%', background: 'rgba(51, 65, 85, 0.5)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        height: '100%', 
                        width: `${Math.min(100, Math.round(((selectedNode.throughputMbps || 0) / (selectedNode.maxCapacityMbps || 1)) * 100))}%`, 
                        background: 'linear-gradient(90deg, #10b981 0%, #06b6d4 100%)',
                        borderRadius: '4px'
                      }} 
                    />
                  </div>
                </div>

                {/* Power & Hardware Telemetry */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(51, 65, 85, 0.3)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Power Source</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Sun size={13} /> {selectedNode.powerSource || 'Microgrid'}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(51, 65, 85, 0.3)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Battery Reserve</div>
                    <div className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: (selectedNode.batteryPct || 100) > 50 ? '#34d399' : '#fbbf24' }}>
                      {selectedNode.batteryPct || 100}%
                    </div>
                  </div>

                  <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(51, 65, 85, 0.3)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Peers Connected</div>
                    <div className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#22d3ee' }}>
                      {selectedNode.connectedPeers || selectedNodeLinks.length} Peers
                    </div>
                  </div>

                  <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(51, 65, 85, 0.3)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Core Temp</div>
                    <div className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                      {selectedNode.tempC || 32}°C
                    </div>
                  </div>
                </div>

                {/* Direct Mesh Links from this node */}
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Connected Mesh Links ({selectedNodeLinks.length})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedNodeLinks.map(link => {
                      const otherNodeId = link.source === selectedNode.id ? link.target : link.source;
                      const otherNode = nodes.find(n => n.id === otherNodeId);
                      const isSevered = severedLinkIds.includes(link.id);

                      return (
                        <div 
                          key={link.id}
                          id={`node-link-item-${link.id}`}
                          onClick={() => setSelectedLink(link)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 10px',
                            background: 'rgba(30, 41, 59, 0.4)',
                            borderRadius: '6px',
                            border: `1px solid ${isSevered ? 'rgba(244, 63, 94, 0.4)' : 'rgba(51, 65, 85, 0.4)'}`,
                            cursor: 'pointer'
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc' }}>
                              {otherNode?.name || otherNodeId}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                              {link.type}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div className="font-mono" style={{ fontSize: '0.75rem', color: isSevered ? '#fb7185' : '#34d399', fontWeight: 600 }}>
                              {isSevered ? 'CUT' : `${link.currentLoadMbps} Mbps`}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              {link.latencyMs} ms
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Interactive Diagnostic / Ping Tool */}
                <div style={{ borderTop: '1px solid rgba(51, 65, 85, 0.4)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Mesh Route Diagnostic</span>
                    <button
                      id="btn-ping-test"
                      onClick={() => handleRunPing(selectedNode.id)}
                      disabled={pingTestingId === selectedNode.id}
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                    >
                      {pingTestingId === selectedNode.id ? 'Pinging...' : 'Send ICMP Probe'}
                    </button>
                  </div>

                  {pingResults[selectedNode.id] && (
                    <div style={{ padding: '8px 12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px', fontSize: '0.75rem' }}>
                      <div style={{ color: '#34d399', fontWeight: 600 }}>Probe Return OK: 0% Packet Loss</div>
                      <div className="font-mono" style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                        Roundtrip: <strong>{pingResults[selectedNode.id].latency} ms</strong> • Hops: {pingResults[selectedNode.id].hops} • Time: {pingResults[selectedNode.id].timestamp}
                      </div>
                    </div>
                  )}
                </div>

              </>
            )}

            {/* When a Link is Selected */}
            {selectedLink && !selectedNode && (
              <>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span 
                      className="badge"
                      style={{ 
                        background: `${getLinkColor(selectedLink.type, severedLinkIds.includes(selectedLink.id))}22`,
                        color: getLinkColor(selectedLink.type, severedLinkIds.includes(selectedLink.id)),
                        border: `1px solid ${getLinkColor(selectedLink.type, severedLinkIds.includes(selectedLink.id))}55`
                      }}
                    >
                      {selectedLink.type}
                    </span>
                    <span className={`badge ${severedLinkIds.includes(selectedLink.id) ? 'badge-rose' : 'badge-emerald'}`}>
                      {severedLinkIds.includes(selectedLink.id) ? 'SEVERED / DOWN' : 'ACTIVE'}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Mesh Connection Link</h3>
                  <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    ID: {selectedLink.id}
                  </div>
                </div>

                <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(51, 65, 85, 0.4)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ENDPOINT A</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{nodes.find(n => n.id === (selectedLink.source?.id || selectedLink.source))?.name || 'Endpoint A'}</div>
                    </div>
                    <ArrowUpRight size={16} color="#34d399" />
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ENDPOINT B</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{nodes.find(n => n.id === (selectedLink.target?.id || selectedLink.target))?.name || 'Endpoint B'}</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '10px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>LINK CAPACITY</div>
                    <div className="font-mono" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#34d399' }}>
                      {selectedLink.capacityMbps} Mbps
                    </div>
                  </div>

                  <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '10px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CURRENT LOAD</div>
                    <div className="font-mono" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#22d3ee' }}>
                      {selectedLink.currentLoadMbps} Mbps
                    </div>
                  </div>

                  <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '10px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>HOP LATENCY</div>
                    <div className="font-mono" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fbbf24' }}>
                      {selectedLink.latencyMs} ms
                    </div>
                  </div>

                  <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '10px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>STATUS</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: severedLinkIds.includes(selectedLink.id) ? '#fb7185' : '#34d399' }}>
                      {severedLinkIds.includes(selectedLink.id) ? 'Disconnected' : 'Operational'}
                    </div>
                  </div>
                </div>

                {onToggleLinkState && (
                  <button
                    id="btn-toggle-link-state"
                    onClick={() => onToggleLinkState(selectedLink.id)}
                    className="btn-secondary"
                    style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
                  >
                    Simulate Traffic Flap on Link
                  </button>
                )}
              </>
            )}

          </div>
        )}

      </div>

    </div>
  );
}
