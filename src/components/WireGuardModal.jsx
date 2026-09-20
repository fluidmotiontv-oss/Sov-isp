import React, { useState, useMemo } from 'react';
import { Download, Copy, Check, X, QrCode, Smartphone, Key } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

// Helper to generate a realistic 32-byte Base64 WireGuard Private Key
function generateWgPrivateKey() {
  const bytes = new Uint8Array(32);
  window.crypto.getRandomValues(bytes);
  // Clamp Curve25519 private key bytes as per WireGuard spec
  bytes[0] &= 248;
  bytes[31] &= 127;
  bytes[31] |= 64;
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export default function WireGuardModal({ subscriber, onClose }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('qr'); // 'qr' | 'raw'
  
  // Dynamically generate or reuse a valid Curve25519 Base64 PrivateKey
  const clientPrivateKey = useMemo(() => {
    return subscriber.wgPrivateKey || generateWgPrivateKey();
  }, [subscriber]);

  const confContent = `[Interface]
# Sovereign ISP Tunnel for ${subscriber.handle}
PrivateKey = ${clientPrivateKey}
Address = ${subscriber.ip}/32, 2a0f:9400::10/128
DNS = 10.64.0.1, 10.64.0.2

[Peer]
# Sovereign AS65001 Gateway Alpha
PublicKey = 9xK27m8L3pQv1wE5rT0yU4iO7aS3dF6gH8jK2mL8P=
Endpoint = 185.220.101.1:51820
AllowedIPs = 0.0.0.0/0, ::/0
PersistentKeepalive = 25
`;

  const copyConfig = () => {
    navigator.clipboard.writeText(confContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const downloadFile = () => {
    const element = document.createElement("a");
    const file = new Blob([confContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${subscriber.handle}_sovereign_mesh.conf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="glass-panel" style={{ width: '500px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span className="badge badge-emerald" style={{ fontSize: '0.65rem', marginBottom: '4px' }}>WIREGUARD MESH TUNNEL</span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Connect Peer: {subscriber.handle}</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* View Toggle Tabs */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(15,23,42,0.6)', padding: '4px', borderRadius: '8px' }}>
          <button 
            onClick={() => setActiveTab('qr')}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: '6px',
              background: activeTab === 'qr' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              color: activeTab === 'qr' ? '#34d399' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <QrCode size={16} /> Scan QR with Phone
          </button>
          <button 
            onClick={() => setActiveTab('raw')}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: '6px',
              background: activeTab === 'raw' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              color: activeTab === 'raw' ? '#34d399' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Smartphone size={16} /> Raw Config (.conf)
          </button>
        </div>

        {/* Generated Key Callout Box */}
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '10px 12px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Key size={12} color="#34d399" /> Client Curve25519 Private Key (Pre-Generated)
          </span>
          <span className="font-mono" style={{ fontSize: '0.8rem', color: '#34d399', wordBreak: 'break-all', fontWeight: 600 }}>
            {clientPrivateKey}
          </span>
        </div>

        {activeTab === 'qr' ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', padding: '8px 0' }}>
            <div style={{ padding: '12px', background: '#ffffff', borderRadius: '12px', boxShadow: '0 0 20px rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <QRCodeSVG value={confContent} size={210} level="M" />
            </div>

            <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <div style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '2px' }}>📱 Scan directly with WireGuard App</div>
              Open WireGuard on your phone ➔ Tap <b>+</b> ➔ <b>Create from QR code</b> ➔ Scan this screen!
            </div>
          </div>
        ) : (
          <>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Import this complete <span className="font-mono" style={{ color: '#34d399' }}>.conf</span> configuration into WireGuard:
            </p>

            <pre className="font-mono" style={{ padding: '14px', background: '#090d16', borderRadius: '8px', border: '1px solid rgba(51, 65, 85, 0.6)', color: '#34d399', fontSize: '0.75rem', overflowX: 'auto', lineHeight: 1.4 }}>
              {confContent}
            </pre>
          </>
        )}

        <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
          <button className="btn-secondary" onClick={copyConfig} style={{ flex: 1, justifyContent: 'center' }}>
            {copied ? <Check size={16} color="#34d399" /> : <Copy size={16} />} {copied ? "Copied!" : "Copy Config"}
          </button>
          <button className="btn-primary" onClick={downloadFile} style={{ flex: 1, justifyContent: 'center' }}>
            <Download size={16} /> Download .conf
          </button>
        </div>

      </div>
    </div>
  );
}
