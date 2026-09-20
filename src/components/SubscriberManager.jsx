import React, { useState } from 'react';
import { Users, Shield, Download, Plus, Key, CheckCircle2, DollarSign, Wallet, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SubscriberManager({ subscribers, onSelectWireGuardConfig }) {
  const [subList, setSubList] = useState(subscribers);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newHandle, setNewHandle] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newTier, setNewTier] = useState('Community Sovereign (100 Mbps)');

  const handleAddSubscriber = (e) => {
    e.preventDefault();
    if (!newHandle) return;

    const newSub = {
      id: `SUB-${Math.floor(1000 + Math.random() * 9000)}`,
      handle: newHandle.includes('.') ? newHandle : `${newHandle}.mesh`,
      address: newAddress || 'Rooftop Mesh Unit',
      tier: newTier,
      planPrice: newTier.includes('100') ? '$25 / mo' : newTier.includes('1 Gbps') ? '$50 / mo' : 'Free Tier',
      balance: '50 MESH',
      status: 'Active',
      wgPublicKey: `${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 6)}=`,
      dataUsedGb: 0.0,
      ip: `10.64.10.${Math.floor(100 + Math.random() * 150)}`
    };

    setSubList(prev => [newSub, ...prev]);
    setShowAddModal(false);
    setNewHandle('');
    setNewAddress('');
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Sovereign Subscribers & Zero-Trust Authentication</h2>
            <span className="badge badge-emerald"><Shield size={12} /> WIREGUARD NOISE IK</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Decentralized peer management, public key authentication, token billing balances, and instant WireGuard configuration generator.
          </p>
        </div>

        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Register New Subscriber
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Total Active Peers</div>
          <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399' }}>{subList.length} Connected</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>100% Encrypted Mesh Tunnels</div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Monthly Community Treasury</div>
          <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#22d3ee' }}>$2,750 / mo</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Funded via P2P Mesh Credits & Fiat</div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Aggregate Data Served</div>
          <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#a78bfa' }}>8.02 <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>TB</span></div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Zero ISP Data Caps</div>
        </div>
      </div>

      {/* Subscriber Table */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} color="#34d399" /> Registered Mesh Subscribers
          </h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.6)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 12px' }}>Subscriber Handle</th>
                <th style={{ padding: '10px 12px' }}>Assigned IPv4</th>
                <th style={{ padding: '10px 12px' }}>Speed Tier</th>
                <th style={{ padding: '10px 12px' }}>Token Balance</th>
                <th style={{ padding: '10px 12px' }}>WireGuard Public Key</th>
                <th style={{ padding: '10px 12px' }}>Data Used</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subList.map((sub) => (
                <tr key={sub.id} style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.3)' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 700, color: '#f8fafc' }}>{sub.handle}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{sub.address}</div>
                  </td>
                  <td className="font-mono" style={{ padding: '12px', color: '#34d399', fontWeight: 600 }}>{sub.ip}</td>
                  <td style={{ padding: '12px' }}>
                    <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>{sub.tier}</span>
                  </td>
                  <td className="font-mono" style={{ padding: '12px', color: '#fbbf24', fontWeight: 600 }}>{sub.balance}</td>
                  <td className="font-mono" style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{sub.wgPublicKey}</td>
                  <td className="font-mono" style={{ padding: '12px' }}>{sub.dataUsedGb} GB</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => onSelectWireGuardConfig(sub)}>
                      <Download size={14} /> Get Config
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Subscriber Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '420px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Register New Sovereign Peer</h3>
            
            <form onSubmit={handleAddSubscriber} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Peer Handle / Domain
                </label>
                <input
                  type="text"
                  placeholder="e.g. dave.freedom"
                  value={newHandle}
                  onChange={e => setNewHandle(e.target.value)}
                  className="font-mono"
                  style={{ width: '100%', padding: '10px', background: 'rgba(15,23,42,0.8)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Physical Location / Rooftop Node ID
                </label>
                <input
                  type="text"
                  placeholder="Rooftop Antenna 12B"
                  value={newAddress}
                  onChange={e => setNewAddress(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'rgba(15,23,42,0.8)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Select Bandwidth Tier
                </label>
                <select
                  value={newTier}
                  onChange={e => setNewTier(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'rgba(15,23,42,0.8)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
                >
                  <option value="Mesh Free (10 Mbps)">Mesh Free (10 Mbps) - $0</option>
                  <option value="Community Sovereign (100 Mbps)">Community Sovereign (100 Mbps) - $25/mo</option>
                  <option value="Fiber Core (1 Gbps)">Fiber Core (1 Gbps) - $50/mo</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  Generate Peer Keys
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
