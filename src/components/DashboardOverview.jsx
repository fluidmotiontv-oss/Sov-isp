import React, { useEffect, useRef, useState } from 'react';
import { Activity, Server, Radio, Sun, Users, Shield, ArrowUpRight, ArrowDownRight, Zap, RefreshCw, CheckCircle2, AlertTriangle, Plus, Globe } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function DashboardOverview({ nodes, links, bgpPeers, subscribers, onSelectTab, onAddNodeModal }) {
  const [trafficHistory, setTrafficHistory] = useState(() => {
    const times = [];
    const rx = [];
    const tx = [];
    const now = new Date();
    for (let i = 12; i >= 0; i--) {
      const t = new Date(now.getTime() - i * 5000);
      times.push(t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      rx.push(Math.floor(1800 + Math.random() * 400));
      tx.push(Math.floor(800 + Math.random() * 200));
    }
    return { times, rx, tx };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const tStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setTrafficHistory(prev => {
        const times = [...prev.times.slice(1), tStr];
        const rxVal = Math.floor(1900 + Math.random() * 550);
        const txVal = Math.floor(850 + Math.random() * 250);
        return { times, rx: [...prev.rx.slice(1), rxVal], tx: [...prev.tx.slice(1), txVal] };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const totalRx = trafficHistory.rx[trafficHistory.rx.length - 1];
  const totalTx = trafficHistory.tx[trafficHistory.tx.length - 1];

  const chartData = {
    labels: trafficHistory.times,
    datasets: [
      {
        label: 'Download (Rx Mbps)',
        data: trafficHistory.rx,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
      },
      {
        label: 'Upload (Tx Mbps)',
        data: trafficHistory.tx,
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.15)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 12 } }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        borderColor: '#334155',
        borderWidth: 1,
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1'
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(51, 65, 85, 0.3)' },
        ticks: { color: '#64748b' }
      },
      y: {
        grid: { color: 'rgba(51, 65, 85, 0.3)' },
        ticks: { color: '#64748b' }
      }
    }
  };

  const logs = [
    { time: '19:52:10', text: 'BGP Prefix 185.220.101.0/24 announced via Hurricane Electric (AS6939)', level: 'info' },
    { time: '19:48:02', text: 'Ridge Top Solar Tower 01 switched to internal battery backup (86% remaining)', level: 'warn' },
    { time: '19:42:15', text: 'Zero-Trust Mesh Tunnel established for subscriber SUB-0916 (dan.freedom)', level: 'success' },
    { time: '19:35:40', text: 'Starlink Orbital Backhaul sync complete (38ms latency, 450 Mbps available)', level: 'info' },
    { time: '19:20:11', text: 'Free-Space Optics link (North Peak <-> Valley IXP) RSSI optimal at -52 dBm', level: 'success' }
  ];

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner Alert */}
      <div className="glass-panel scanline-effect" style={{ padding: '16px 20px', background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CheckCircle2 size={20} color="#34d399" />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Autonomous System AS65001 is Fully Decentralized & Online</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Operating 7 Mesh Nodes • 110 Sovereign Households Connected • Zero Single Points of Failure</div>
          </div>
        </div>
        <button className="btn-primary" onClick={onAddNodeModal}>
          <Plus size={16} /> Deploy New Mesh Node
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        
        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Aggregate Traffic</span>
            <Activity size={18} color="#34d399" />
          </div>
          <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399' }}>
            {(totalRx + totalTx).toLocaleString()} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Mbps</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowDownRight size={14} color="#34d399" /> {totalRx} Mbps Rx
            <ArrowUpRight size={14} color="#22d3ee" style={{ marginLeft: '6px' }} /> {totalTx} Mbps Tx
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px', cursor: 'pointer' }} onClick={() => onSelectTab('topology')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Active Mesh Nodes</span>
            <Server size={18} color="#22d3ee" />
          </div>
          <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800 }}>
            {nodes.length} <span style={{ fontSize: '0.9rem', color: '#34d399' }}>Nodes</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
            1 Gateway • 2 Solar Towers • 1 IXP • 1 Sat
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px', cursor: 'pointer' }} onClick={() => onSelectTab('solar')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Solar Battery Health</span>
            <Sun size={18} color="#fbbf24" />
          </div>
          <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fbbf24' }}>
            86% <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Avg Reserve</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
            1.4 kW Solar Gen • 48h LiFePO4 Autonomy
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px', cursor: 'pointer' }} onClick={() => onSelectTab('subscribers')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Sovereign Subscribers</span>
            <Users size={18} color="#a78bfa" />
          </div>
          <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#a78bfa' }}>
            110 <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Peers</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
            100% WireGuard Mesh Encrypted
          </div>
        </div>

      </div>

      {/* Main Chart + Event Log section */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        
        {/* Real-time Bandwidth Line Graph */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Real-Time Throughput Telemetry</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Live aggregate traffic throughput sampled every 3s</p>
            </div>
            <span className="badge badge-emerald" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} /> LIVE TELEMETRY
            </span>
          </div>

          <div style={{ height: '280px', width: '100%' }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Live System Log Ticker */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Autonomous Event Log</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Syslog / BGP</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: '280px' }}>
            {logs.map((l, idx) => (
              <div key={idx} style={{ padding: '10px 12px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '8px', borderLeft: `3px solid ${l.level === 'warn' ? '#fbbf24' : l.level === 'success' ? '#34d399' : '#06b6d4'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2px' }}>
                  <span className="font-mono">{l.time}</span>
                  <span style={{ textTransform: 'uppercase', fontWeight: 700, color: l.level === 'warn' ? '#fbbf24' : l.level === 'success' ? '#34d399' : '#06b6d4' }}>{l.level}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                  {l.text}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Sovereign Features Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        
        <div className="glass-panel" style={{ padding: '18px', borderTop: '3px solid #10b981' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={18} color="#10b981" /> No Corporate Monopoly Control
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Nodes are physically owned by local neighborhood hosts and connected via direct microwave point-to-point links and dark fiber rings.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '18px', borderTop: '3px solid #06b6d4' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={18} color="#06b6d4" /> Independent Autonomous System
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Registered ASN 65001 with multi-homed BGP peering (Hurricane Electric, Cogent, local IXPs) for zero single-carrier leverage.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '18px', borderTop: '3px solid #f59e0b' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={18} color="#f59e0b" /> Grid-Independent Solar Resiliency
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Tower nodes feature integrated solar arrays and LiFePO4 battery banks capable of keeping the network operational during city grid blackouts.
          </p>
        </div>

      </div>

    </div>
  );
}
