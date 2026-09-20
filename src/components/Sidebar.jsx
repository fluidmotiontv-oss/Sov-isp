import React from 'react';
import { LayoutDashboard, Network, Globe, Sun, Users, ShieldAlert, Cpu } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'overview', label: 'Command Center', icon: LayoutDashboard },
    { id: 'topology', label: 'Mesh Topology Map', icon: Network },
    { id: 'bgp', label: 'BGP Autonomous Core', icon: Globe },
    { id: 'solar', label: 'Solar & Power Telemetry', icon: Sun },
    { id: 'subscribers', label: 'Subscribers & WireGuard', icon: Users },
    { id: 'privacy', label: 'Privacy DNS & IPFS', icon: ShieldAlert },
    { id: 'blueprint', label: 'Hardware Blueprint', icon: Cpu },
  ];

  return (
    <aside className="glass-panel" style={{ width: '250px', borderRadius: 0, borderTop: 'none', borderBottom: 'none', borderLeft: 'none', padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ padding: '0 12px 12px 12px', borderBottom: '1px solid rgba(51, 65, 85, 0.4)' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          NAVIGATION MODULES
        </span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '8px',
                border: isActive ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid transparent',
                background: isActive ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                color: isActive ? '#34d399' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                width: '100%'
              }}
            >
              <Icon size={18} color={isActive ? '#34d399' : '#64748b'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Status Card */}
      <div style={{ marginTop: 'auto', padding: '12px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '8px', border: '1px solid rgba(51, 65, 85, 0.5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Zero-Trust Mesh</span>
          <span className="badge badge-emerald" style={{ padding: '2px 6px', fontSize: '0.65rem' }}>ENCRYPTED</span>
        </div>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          WireGuard Noise IK Protocol • Uncensored Mesh Routing
        </p>
      </div>
    </aside>
  );
}
