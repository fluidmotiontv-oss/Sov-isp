import React, { useState } from 'react';
import { Sun, BatteryCharging, Zap, Thermometer, Wind, AlertCircle, ShieldCheck, Power, RefreshCw } from 'lucide-react';

export default function SolarTelemetry({ nodes }) {
  const solarTowers = nodes.filter(n => n.type === 'solar-tower' || n.type === 'gateway');
  const [ecoPowerMode, setEcoPowerMode] = useState(false);

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Off-Grid Solar & Resilience Telemetry</h2>
            <span className="badge badge-amber"><Sun size={12} /> 100% RENEWABLE BACKBONE</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Real-time monitoring of hilltop microwave tower solar arrays, LiFePO4 battery banks, thermal sensors, and autonomous microgrid power distribution.
          </p>
        </div>

        <button 
          className={ecoPowerMode ? "btn-primary" : "btn-outline-amber"} 
          onClick={() => setEcoPowerMode(!ecoPowerMode)}
        >
          <Power size={16} /> {ecoPowerMode ? "Eco-Power Mode Active" : "Enable Storm Eco-Power Mode"}
        </button>
      </div>

      {/* Grid Power & Solar Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Current Solar Generation</div>
          <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fbbf24' }}>1,420 <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Watts</span></div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Peak Solar Irradiance Active</div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>System Battery Bank</div>
          <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399' }}>88.4% <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Charged</span></div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>48 Hours Emergency Autonomy</div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Radio Power Consumption</div>
          <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#22d3ee' }}>380 <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Watts</span></div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Net Power Surplus: +1,040W</div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Grid Uptime (30d)</div>
          <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399' }}>100.0%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Zero City Grid Dependence</div>
        </div>
      </div>

      {/* Solar Tower Node Telemetry Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {solarTowers.map(node => (
          <div key={node.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>OFF-GRID TOWER</span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginTop: '4px' }}>{node.name}</h3>
              </div>
              <span className="badge badge-emerald">{node.status.toUpperCase()}</span>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {node.description}
            </div>

            {/* Battery Progress Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>LiFePO4 48V Battery Pack</span>
                <span className="font-mono" style={{ fontWeight: 700, color: node.batteryPct < 50 ? '#fbbf24' : '#34d399' }}>{node.batteryPct}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(51, 65, 85, 0.5)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${node.batteryPct}%`, height: '100%', background: node.batteryPct < 50 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : 'linear-gradient(90deg, #10b981, #34d399)', transition: 'width 0.4s ease' }} />
              </div>
            </div>

            {/* Detailed Sensors Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(51, 65, 85, 0.4)' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sun size={16} color="#fbbf24" />
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>Solar Input</span>
                  <span className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 600 }}>640W</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={16} color="#22d3ee" />
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>Radio Drain</span>
                  <span className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 600 }}>145W</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Thermometer size={16} color="#f43f5e" />
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>Enclosure Temp</span>
                  <span className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{node.tempC} °C</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wind size={16} color="#a78bfa" />
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>Wind Speed</span>
                  <span className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 600 }}>14 km/h</span>
                </div>
              </div>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
