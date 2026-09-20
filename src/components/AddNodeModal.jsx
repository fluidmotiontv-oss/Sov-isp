import React, { useState } from 'react';
import { Plus, X, Server, Radio, Sun, Globe } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AddNodeModal({ onClose, onAddNode }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('solar-tower');
  const [powerSource, setPowerSource] = useState('Off-Grid Solar (600W)');
  const [capacityMbps, setCapacityMbps] = useState(2500);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;

    const newNode = {
      id: `node-${Date.now()}`,
      name,
      type,
      status: 'online',
      x: 350 + Math.floor(Math.random() * 200 - 100),
      y: 250 + Math.floor(Math.random() * 150 - 75),
      lat: 37.75 + (Math.random() * 0.04 - 0.02),
      lng: -122.42 + (Math.random() * 0.04 - 0.02),
      ip: `10.64.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 250)}`,
      throughputMbps: Math.floor(100 + Math.random() * 400),
      maxCapacityMbps: Number(capacityMbps),
      connectedPeers: 3,
      powerSource,
      batteryPct: 94,
      tempC: 28,
      uplink: type === 'solar-tower' ? '60GHz Radio Dish' : type === 'satellite' ? 'LEO Satellite' : 'Dark Fiber',
      description: `Newly deployed sovereign ${type} node operating on ${powerSource}`
    };

    onAddNode(newNode);
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.5 } });
    onClose();
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="glass-panel" style={{ width: '460px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Deploy New Mesh Node</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Node Identifier / Name
            </label>
            <input
              type="text"
              placeholder="e.g. West Ridge Microwave Relay 03"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', background: 'rgba(15,23,42,0.8)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Node Functional Type
            </label>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', background: 'rgba(15,23,42,0.8)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
            >
              <option value="solar-tower">Solar Microwave Relay Tower</option>
              <option value="micro-ixp">Community Micro-IXP Hub</option>
              <option value="gateway">Core Gateway Router</option>
              <option value="satellite">LEO Satellite Uplink</option>
              <option value="client-cluster">Subscriber Rooftop Cluster</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Power Grid Architecture
            </label>
            <input
              type="text"
              value={powerSource}
              onChange={e => setPowerSource(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', background: 'rgba(15,23,42,0.8)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Max Wireless / Link Capacity (Mbps)
            </label>
            <input
              type="number"
              value={capacityMbps}
              onChange={e => setCapacityMbps(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', background: 'rgba(15,23,42,0.8)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
            <button type="button" className="btn-secondary" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              <Plus size={16} /> Broadcast & Provision Node
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
