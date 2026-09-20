import React, { useEffect, useRef, useState } from 'react';
import { Radio, Server, Globe, Sun, Users, Activity, AlertTriangle, ShieldCheck, Plus, RefreshCw, Power, Zap, Wifi } from 'lucide-react';

export default function NetworkMap({ 
  nodes, 
  links, 
  onAddNodeModal, 
  simulationState,
  onToggleLinkState,
  onAddLink
}) {
  const canvasRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(nodes[0]);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [severedLinkIds, setSeveredLinkIds] = useState([]);

  // Handle simulation state effects
  useEffect(() => {
    if (simulationState === 'fiber_cut') {
      setSeveredLinkIds(['link-2']); // Fiber link cut
    } else if (simulationState === 'solar_storm') {
      setSeveredLinkIds(['link-3', 'link-5']); // Solar tower link issues
    } else {
      setSeveredLinkIds([]);
    }
  }, [simulationState]);

  // Keep selected node updated if nodes list changes
  useEffect(() => {
    if (selectedNode) {
      const updated = nodes.find(n => n.id === selectedNode.id);
      if (updated) setSelectedNode(updated);
    }
  }, [nodes]);

  // Canvas Animation Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particleOffset = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particleOffset = (particleOffset + 0.8) % 100;

      // Draw Grid Background
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.15)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw Links
      links.forEach(link => {
        const sourceNode = nodes.find(n => n.id === link.source);
        const targetNode = nodes.find(n => n.id === link.target);
        if (!sourceNode || !targetNode) return;

        const isSevered = severedLinkIds.includes(link.id);

        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        ctx.lineTo(targetNode.x, targetNode.y);

        if (isSevered) {
          ctx.strokeStyle = 'rgba(244, 63, 94, 0.7)';
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 6]);
          ctx.stroke();
          ctx.setLineDash([]);

          // Draw "X" or Alert icon over severed link center
          const midX = (sourceNode.x + targetNode.x) / 2;
          const midY = (sourceNode.y + targetNode.y) / 2;
          ctx.fillStyle = '#f43f5e';
          ctx.beginPath();
          ctx.arc(midX, midY, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 12px Fira Code';
          ctx.fillText('!', midX - 3, midY + 4);
        } else {
          // Active link
          ctx.setLineDash([]);
          ctx.strokeStyle = link.type === 'fiber' ? 'rgba(16, 185, 129, 0.5)' : link.type === 'satellite' ? 'rgba(6, 182, 212, 0.5)' : 'rgba(245, 158, 11, 0.4)';
          ctx.lineWidth = Math.max(2, (link.currentLoadMbps / 1000) * 3);
          ctx.stroke();

          // Animated Packets (Pulses)
          const dx = targetNode.x - sourceNode.x;
          const dy = targetNode.y - sourceNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const packetCount = Math.max(2, Math.floor(distance / 70));

          for (let p = 0; p < packetCount; p++) {
            const progress = ((particleOffset * 0.8 + (p * 100 / packetCount)) % 100) / 100;
            const px = sourceNode.x + dx * progress;
            const py = sourceNode.y + dy * progress;

            ctx.fillStyle = link.type === 'fiber' ? '#34d399' : link.type === 'satellite' ? '#22d3ee' : '#fbbf24';
            ctx.shadowColor = ctx.fillStyle;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(px, py, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      });

      // Draw Nodes
      nodes.forEach(node => {
        const isSelected = selectedNode?.id === node.id;
        const isHovered = hoveredNode?.id === node.id;

        // Node Glow Ring
        ctx.beginPath();
        ctx.arc(node.x, node.y, isSelected ? 26 : 20, 0, Math.PI * 2);
        if (isSelected) {
          ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 2;
          ctx.fill();
          ctx.stroke();
        } else if (isHovered) {
          ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 2;
          ctx.fill();
          ctx.stroke();
        }

        // Inner Circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, 14, 0, Math.PI * 2);
        ctx.fillStyle = node.type === 'gateway' ? '#10b981' : node.type === 'satellite' ? '#06b6d4' : node.type === 'solar-tower' ? '#f59e0b' : node.type === 'micro-ixp' ? '#8b5cf6' : '#ec4899';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = node.status === 'online' ? 12 : 0;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Node Label
        ctx.font = '600 12px Plus Jakarta Sans';
        ctx.fillStyle = isSelected ? '#34d399' : '#f8fafc';
        ctx.textAlign = 'center';
        ctx.fillText(node.name, node.x, node.y + 34);

        // IP / Throughput Subtext
        ctx.font = '500 10px Fira Code';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(`${node.throughputMbps} Mbps`, node.x, node.y + 48);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [nodes, links, selectedNode, hoveredNode, severedLinkIds]);

  // Canvas Click / Hover Detection
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const clicked = nodes.find(n => {
      const dist = Math.sqrt((n.x - clickX) ** 2 + (n.y - clickY) ** 2);
      return dist <= 24;
    });

    if (clicked) {
      setSelectedNode(clicked);
    }
  };

  const handleCanvasMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const hovered = nodes.find(n => {
      const dist = Math.sqrt((n.x - mouseX) ** 2 + (n.y - mouseY) ** 2);
      return dist <= 24;
    });

    setHoveredNode(hovered || null);
    canvas.style.cursor = hovered ? 'pointer' : 'default';
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Interactive Mesh Topology Map</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Real-time visual diagram of sovereign fiber backbones, wireless radios, satellite failovers & subscriber clusters.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-primary" onClick={onAddNodeModal}>
            <Plus size={16} /> Add Node
          </button>
        </div>
      </div>

      {/* Main Canvas + Node Inspector Split Screen */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', minHeight: '560px' }}>
        
        {/* Canvas Map Container */}
        <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden', minHeight: '560px' }}>
          <canvas
            ref={canvasRef}
            width={720}
            height={560}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            style={{ width: '100%', height: '100%', display: 'block' }}
          />

          {/* Map Legend Overlay */}
          <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: 'rgba(15, 23, 42, 0.85)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(51, 65, 85, 0.6)', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.65rem' }}>LEGEND & LINK TYPES</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
              <span>Gateway / Dark Fiber Ring (10 Gbps)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
              <span>Off-Grid Solar Microwave Radio</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#06b6d4' }} />
              <span>LEO Satellite Backhaul</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ec4899' }} />
              <span>Sovereign Subscriber Cluster</span>
            </div>
          </div>
        </div>

        {/* Node Inspector Sidebar Panel */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {selectedNode ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(51, 65, 85, 0.5)', paddingBottom: '12px' }}>
                <div>
                  <span className="badge badge-emerald" style={{ textTransform: 'uppercase', marginBottom: '4px' }}>
                    {selectedNode.type}
                  </span>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{selectedNode.name}</h3>
                </div>
                <span className="badge badge-emerald">ONLINE</span>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {selectedNode.description}
              </div>

              {/* Specs Table */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(51, 65, 85, 0.4)' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>IP Address</span>
                  <span className="font-mono" style={{ fontWeight: 600, color: '#34d399' }}>{selectedNode.ip}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Throughput Load</span>
                  <span className="font-mono" style={{ fontWeight: 600 }}>{selectedNode.throughputMbps} / {selectedNode.maxCapacityMbps} Mbps</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Power Reserve</span>
                  <span className="font-mono" style={{ fontWeight: 600, color: selectedNode.batteryPct < 50 ? '#fbbf24' : '#34d399' }}>
                    {selectedNode.batteryPct}% ({selectedNode.powerSource})
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Temperature</span>
                  <span className="font-mono" style={{ fontWeight: 600 }}>{selectedNode.tempC} °C</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Connected Links</span>
                  <span className="font-mono" style={{ fontWeight: 600 }}>{selectedNode.connectedPeers} Active Links</span>
                </div>

              </div>

              {/* Connected Links list for this node */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>NODE BACKHAUL LINKS</span>
                {links.filter(l => l.source === selectedNode.id || l.target === selectedNode.id).map(l => {
                  const peerId = l.source === selectedNode.id ? l.target : l.source;
                  const peerNode = nodes.find(n => n.id === peerId);
                  const isSevered = severedLinkIds.includes(l.id);
                  return (
                    <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: 'rgba(30, 41, 59, 0.4)', borderRadius: '6px', fontSize: '0.75rem' }}>
                      <div>
                        <div style={{ fontWeight: 600, color: isSevered ? '#fb7185' : '#f8fafc' }}>
                          → {peerNode?.name || peerId}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{l.type} • {l.latencyMs}ms</div>
                      </div>
                      <button 
                        className={isSevered ? "btn-primary" : "btn-outline-amber"} 
                        style={{ padding: '4px 8px', fontSize: '0.7rem' }}
                        onClick={() => onToggleLinkState(l.id)}
                      >
                        {isSevered ? "Reconnect" : "Sever Link"}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                  <RefreshCw size={14} /> Ping Test
                </button>
                <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                  <Power size={14} /> Reboot Radio
                </button>
              </div>

            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
              Click any node on the map to inspect its real-time telemetry.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
