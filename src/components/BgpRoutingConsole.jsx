import React, { useState } from 'react';
import { Globe, ShieldCheck, ArrowUpRight, Radio, RefreshCw, CheckCircle2, AlertTriangle, Layers, Plus } from 'lucide-react';

export default function BgpRoutingConsole({ bgpPeers }) {
  const [prefixes, setPrefixes] = useState([
    { prefix: '185.220.101.0/24', type: 'IPv4 Provider Aggregatable', rpki: 'Valid', status: 'Announced', origin: 'AS65001' },
    { prefix: '2a0f:9400::/32', type: 'IPv6 Global Unicast', rpki: 'Valid', status: 'Announced', origin: 'AS65001' },
    { prefix: '10.64.0.0/16', type: 'Sovereign Internal Overlay', rpki: 'N/A (Mesh Private)', status: 'Internal BGP', origin: 'AS65001' }
  ]);

  const [newPrefix, setNewPrefix] = useState('');
  const [announcedMessage, setAnnouncedMessage] = useState('');

  const handleAnnouncePrefix = (e) => {
    e.preventDefault();
    if (!newPrefix) return;
    setPrefixes(prev => [
      ...prev,
      { prefix: newPrefix, type: 'IPv4 Custom Allocation', rpki: 'Valid', status: 'Announced', origin: 'AS65001' }
    ]);
    setAnnouncedMessage(`Prefix ${newPrefix} successfully announced to BGP upstream peers!`);
    setNewPrefix('');
    setTimeout(() => setAnnouncedMessage(''), 4000);
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Autonomous System Core (AS65001)</h2>
            <span className="badge badge-emerald"><ShieldCheck size={12} /> RPKI SIGNED</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Independent BGP peering fabric connecting to global transit Tier-1 networks and local Internet Exchange Points (IXPs).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary">
            <RefreshCw size={14} /> Soft Re-config BGP
          </button>
        </div>
      </div>

      {/* ASN Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Autonomous System</div>
          <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399' }}>AS65001</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Registered Sovereign Network</div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Global IPv4 Prefixes</div>
          <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#22d3ee' }}>185.220.101.0/24</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>256 Public Addresses Allocated</div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Global IPv6 Block</div>
          <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#a78bfa' }}>2a0f:9400::/32</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Trillion Sovereign Endpoints</div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Active Transit Peers</div>
          <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24' }}>4 Multi-homed</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Zero single-carrier lock-in</div>
        </div>
      </div>

      {/* Upstream BGP Peering Table */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={18} color="#06b6d4" /> Upstream BGP Peering Sessions
          </h3>
          <span className="badge badge-cyan">MULTI-HOMED TRANSIT</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.6)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 12px' }}>Peer ASN</th>
                <th style={{ padding: '10px 12px' }}>Peer Name</th>
                <th style={{ padding: '10px 12px' }}>Session Type</th>
                <th style={{ padding: '10px 12px' }}>BGP State</th>
                <th style={{ padding: '10px 12px' }}>Accepted Prefixes</th>
                <th style={{ padding: '10px 12px' }}>Latency</th>
                <th style={{ padding: '10px 12px' }}>RPKI Status</th>
              </tr>
            </thead>
            <tbody>
              {bgpPeers.map((p, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.3)' }}>
                  <td className="font-mono" style={{ padding: '12px', fontWeight: 700, color: '#34d399' }}>{p.asn}</td>
                  <td style={{ padding: '12px', fontWeight: 600 }}>{p.name}</td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{p.type}</td>
                  <td style={{ padding: '12px' }}>
                    <span className="badge badge-emerald">{p.state}</span>
                  </td>
                  <td className="font-mono" style={{ padding: '12px' }}>{p.prefixCount.toLocaleString()}</td>
                  <td className="font-mono" style={{ padding: '12px', color: '#22d3ee' }}>{p.latency}</td>
                  <td style={{ padding: '12px' }}>
                    <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>VALIDATED</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Prefix Announcements & Route Manager */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} color="#a78bfa" /> Active IP Prefix Advertisements
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {prefixes.map((p, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '8px', border: '1px solid rgba(51, 65, 85, 0.4)' }}>
                <div>
                  <div className="font-mono" style={{ fontWeight: 700, fontSize: '0.95rem', color: '#34d399' }}>
                    {p.prefix}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {p.type} • Origin {p.origin}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="badge badge-emerald">{p.status}</span>
                  <span className="badge badge-cyan">{p.rpki}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Announce New Subnet Form */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>BGP Route Announcement</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Advertise new sovereign IP blocks or community subnets to global BGP tables.
          </p>

          {announcedMessage && (
            <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '6px', color: '#34d399', fontSize: '0.8rem' }}>
              {announcedMessage}
            </div>
          )}

          <form onSubmit={handleAnnouncePrefix} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Subnet CIDR (e.g. 198.51.100.0/24)
              </label>
              <input
                type="text"
                value={newPrefix}
                onChange={e => setNewPrefix(e.target.value)}
                placeholder="198.51.100.0/24"
                className="font-mono"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>
              <Plus size={16} /> Broadcast BGP Route
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
