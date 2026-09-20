import React, { useState } from 'react';
import { ShieldAlert, Globe, Lock, Cpu, CheckCircle2, Plus, Ban, Database, Activity } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DnsPrivacyGuard({ dnsMetrics }) {
  const [blockedDomains, setBlockedDomains] = useState([
    { domain: 'analytics.google.com', category: 'Corporate Telemetry', count: 84120, status: 'Sinkholed' },
    { domain: 'telemetry.microsoft.com', category: 'OS Telemetry', count: 62410, status: 'Sinkholed' },
    { domain: 'graph.facebook.com', category: 'Tracker Network', count: 91200, status: 'Sinkholed' },
    { domain: 'ads.doubleclick.net', category: 'Ad Network', count: 120400, status: 'Sinkholed' }
  ]);

  const [newDomain, setNewDomain] = useState('');

  const handleAddBlockRule = (e) => {
    e.preventDefault();
    if (!newDomain) return;
    setBlockedDomains(prev => [
      { domain: newDomain, category: 'User Custom Sinkhole', count: 0, status: 'Sinkholed' },
      ...prev
    ]);
    setNewDomain('');
  };

  const doughnutData = {
    labels: dnsMetrics.topBlockedCategories.map(c => c.category),
    datasets: [
      {
        data: dnsMetrics.topBlockedCategories.map(c => c.count),
        backgroundColor: ['#10b981', '#06b6d4', '#8b5cf6'],
        borderColor: '#0f172a',
        borderWidth: 2
      }
    ]
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Privacy DNS Guard & IPFS Gateway</h2>
            <span className="badge badge-emerald"><Lock size={12} /> UNCENSORED DoH / DoT</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Zero-log recursive DNS resolver, automated tracker sinkholing, and decentralized web bridge to IPFS & Arweave.
          </p>
        </div>

        <span className="badge badge-cyan" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
          <Database size={14} /> IPFS Gateway Active (84.9k Blocks Pinned)
        </span>
      </div>

      {/* DNS Stats KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Total Queries (24h)</div>
          <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399' }}>{dnsMetrics.totalQueries24h.toLocaleString()}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Avg Latency: {dnsMetrics.avgResponseMs}ms</div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Blocked Trackers & Ads</div>
          <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#22d3ee' }}>{dnsMetrics.blockedQueries24h.toLocaleString()}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{dnsMetrics.blockRatePct}% of all traffic filtered</div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>DNS Protocol Security</div>
          <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#a78bfa' }}>DNS-over-HTTPS</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>TLS 1.3 Encrypted Wire Format</div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Log Policy</div>
          <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#34d399' }}>ZERO LOGS</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>RAM-Only Non-Persistent Storage</div>
        </div>
      </div>

      {/* Doughnut Chart + Rules List */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
        
        {/* Doughnut Chart */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, alignSelf: 'flex-start' }}>Filtered Category Breakdown</h3>
          <div style={{ width: '220px', height: '220px' }}>
            <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', fontSize: '0.75rem' }}>
            {dnsMetrics.topBlockedCategories.map((cat, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>• {cat.category}</span>
                <span className="font-mono" style={{ fontWeight: 600, color: '#fff' }}>{cat.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Sinkhole Rules */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Custom Sinkhole & DNS Rules</h3>
            <span className="badge badge-emerald">RAM FILTER</span>
          </div>

          <form onSubmit={handleAddBlockRule} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="e.g. tracker.badsite.com"
              value={newDomain}
              onChange={e => setNewDomain(e.target.value)}
              className="font-mono"
              style={{ flex: 1, padding: '10px 12px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff', fontSize: '0.85rem' }}
            />
            <button type="submit" className="btn-primary">
              <Plus size={16} /> Block Domain
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', maxHeight: '260px' }}>
            {blockedDomains.map((rule, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '6px', border: '1px solid rgba(51, 65, 85, 0.3)' }}>
                <div>
                  <div className="font-mono" style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fb7185' }}>
                    0.0.0.0 → {rule.domain}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{rule.category}</div>
                </div>
                <span className="badge badge-rose" style={{ fontSize: '0.65rem' }}>SINKHOLED ({rule.count.toLocaleString()})</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
