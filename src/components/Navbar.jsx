import React from 'react';
import { Network, ShieldCheck, Zap, AlertTriangle, Radio, Activity, RefreshCw } from 'lucide-react';

export default function Navbar({ 
  nodes, 
  links, 
  simulationState, 
  setSimulationState, 
  onTriggerSimulation,
  onResetSimulation
}) {
  const totalThroughput = nodes.reduce((acc, n) => acc + (n.status === 'online' ? n.throughputMbps : 0), 0);
  const activeCount = nodes.filter(n => n.status === 'online').length;
  const warningCount = nodes.filter(n => n.status === 'warning' || n.status === 'offline').length;

  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', padding: '14px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)'
          }}>
            <Network size={24} color="#10b981" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #fff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                AETHER // SOVEREIGN ISP
              </h1>
              <span className="badge badge-emerald">
                <ShieldCheck size={12} /> AS65001
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Decentralized Autonomous Community Network & BGP Core
            </p>
          </div>
        </div>

        {/* Real-time KPI Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div className="glass-panel" style={{ padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity size={16} color="#34d399" />
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Network Traffic</span>
              <span className="font-mono" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#34d399' }}>
                {(totalThroughput / 1000).toFixed(2)} Gbps
              </span>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Radio size={16} color="#22d3ee" />
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Nodes Status</span>
              <span className="font-mono" style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                <span style={{ color: '#34d399' }}>{activeCount} Active</span>
                {warningCount > 0 && <span style={{ color: '#fbbf24', marginLeft: '6px' }}>({warningCount} Warning)</span>}
              </span>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Zap size={16} color="#f59e0b" />
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Off-Grid Power</span>
              <span className="font-mono" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fbbf24' }}>
                88.4% Solar/Battery
              </span>
            </div>
          </div>
        </div>

        {/* Simulation Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {simulationState !== 'normal' ? (
            <button className="btn-secondary" onClick={onResetSimulation}>
              <RefreshCw size={14} /> Restore Normal Operations
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn-outline-amber" onClick={() => onTriggerSimulation('fiber_cut')}>
                <AlertTriangle size={14} /> Simulate Fiber Cut
              </button>
              <button className="btn-secondary" onClick={() => onTriggerSimulation('solar_storm')}>
                <Zap size={14} /> Solar Blackout
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
