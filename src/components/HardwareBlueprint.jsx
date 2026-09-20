import React, { useState } from 'react';
import { Cpu, Radio, Sun, Shield, Terminal, Copy, Check, Download, Layers, CheckCircle2 } from 'lucide-react';

export default function HardwareBlueprint() {
  const [copiedCode, setCopiedCode] = useState(false);

  const bgpConfigSnippet = `# MikroTik RouterOS / OpenWrt BGP Configuration for Sovereign AS65001
/routing bgp connection
add name="HE-Transit-AS6939" remote.as=6939 remote.address=216.218.252.1 local.role=ebgp templates=default
add name="Cogent-Transit-AS174" remote.as=174 remote.address=38.104.0.1 local.role=ebgp templates=default

/routing bgp network
add network=185.220.101.0/24
add network=2a0f:9400::/32

# WireGuard Zero-Trust Mesh Peer Announcement
/interface wireguard
add listen-port=51820 name=wg-sovereign-mesh private-key="[LOCAL_PRIV_KEY]"

/interface wireguard peers
add interface=wg-sovereign-mesh public-key="9xK2...mL8P=" allowed-address=10.64.10.14/32
`;

  const copyConfig = () => {
    navigator.clipboard.writeText(bgpConfigSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const hardwareBOM = [
    { component: '60GHz Point-to-Point Radio Dish', specs: 'Ubiquiti Wave Pro / MikroTik Cube 60Pro', estCost: '$290 / pair', purpose: 'High-capacity 2.5 Gbps wireless backbone link between hilltop towers' },
    { component: 'Off-Grid Solar Power Array', specs: '4x 200W Monocrystalline Panels + Victron MPPT 100/30', estCost: '$450', purpose: 'Continuous off-grid clean energy for radio towers' },
    { component: 'LiFePO4 Battery Storage Bank', specs: '48V 100Ah (4.8 kWh) Lithium Iron Phosphate', estCost: '$680', purpose: 'Guarantees 48-72 hours of uninterrupted tower power during rain/blackouts' },
    { component: 'Edge BGP Core Router', specs: 'MikroTik CCR2004-16G-2S+ (Dual 10G SFP+)', estCost: '$590', purpose: 'Hardware wire-speed BGP routing, firewall, and WireGuard VPN encryption' },
    { component: 'Rooftop Client Access Points', specs: 'Ubiquiti Wave Nano / Wi-Fi 6E Mesh Radios', estCost: '$120 / house', purpose: 'Connects individual subscriber rooftops to the neighborhood mesh tower' }
  ];

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Sovereign ISP Hardware & Deployment Blueprint</h2>
            <span className="badge badge-emerald"><Cpu size={12} /> OPEN SOURCE SPECS</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Complete architectural blueprint, bill of materials (BOM), solar sizing, and BGP router setup instructions.
          </p>
        </div>
      </div>

      {/* Bill of Materials Table */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={18} color="#34d399" /> Recommended Hardware Bill of Materials (BOM)
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.6)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 12px' }}>Component</th>
                <th style={{ padding: '10px 12px' }}>Recommended Hardware Model</th>
                <th style={{ padding: '10px 12px' }}>Est. Cost</th>
                <th style={{ padding: '10px 12px' }}>Role & Purpose</th>
              </tr>
            </thead>
            <tbody>
              {hardwareBOM.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.3)' }}>
                  <td style={{ padding: '12px', fontWeight: 700, color: '#f8fafc' }}>{item.component}</td>
                  <td className="font-mono" style={{ padding: '12px', color: '#22d3ee', fontSize: '0.8rem' }}>{item.specs}</td>
                  <td className="font-mono" style={{ padding: '12px', color: '#fbbf24', fontWeight: 600 }}>{item.estCost}</td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.4 }}>{item.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* BGP & Router Configuration Snippet */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={18} color="#a78bfa" /> OpenWrt / RouterOS BGP & WireGuard Config Template
          </h3>
          <button className="btn-secondary" onClick={copyConfig} style={{ fontSize: '0.75rem' }}>
            {copiedCode ? <Check size={14} color="#34d399" /> : <Copy size={14} />} {copiedCode ? "Copied to Clipboard!" : "Copy Snippet"}
          </button>
        </div>

        <pre className="font-mono" style={{ padding: '16px', background: '#090d16', borderRadius: '8px', border: '1px solid rgba(51, 65, 85, 0.6)', color: '#34d399', fontSize: '0.8rem', overflowX: 'auto', lineHeight: 1.5 }}>
          {bgpConfigSnippet}
        </pre>
      </div>

    </div>
  );
}
