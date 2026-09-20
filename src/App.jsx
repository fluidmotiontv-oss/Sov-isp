import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DashboardOverview from './components/DashboardOverview';
import NetworkMap from './components/NetworkMap';
import BgpRoutingConsole from './components/BgpRoutingConsole';
import SolarTelemetry from './components/SolarTelemetry';
import SubscriberManager from './components/SubscriberManager';
import DnsPrivacyGuard from './components/DnsPrivacyGuard';
import HardwareBlueprint from './components/HardwareBlueprint';
import AddNodeModal from './components/AddNodeModal';
import WireGuardModal from './components/WireGuardModal';

import { initialNodes, initialLinks, bgpPeers, subscribersData, dnsMetrics } from './data/mockNetworkData';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [nodes, setNodes] = useState(initialNodes);
  const [links, setLinks] = useState(initialLinks);
  const [subscribers, setSubscribers] = useState(subscribersData);

  const [simulationState, setSimulationState] = useState('normal'); // 'normal' | 'fiber_cut' | 'solar_storm'
  const [showAddNodeModal, setShowAddNodeModal] = useState(false);
  const [selectedWgSubscriber, setSelectedWgSubscriber] = useState(null);

  const handleAddNode = (newNode) => {
    setNodes(prev => [...prev, newNode]);
    // Create connection link to nearest node or gateway
    const newLink = {
      id: `link-${Date.now()}`,
      source: newNode.id,
      target: 'node-gw-1',
      capacityMbps: newNode.maxCapacityMbps,
      currentLoadMbps: newNode.throughputMbps,
      latencyMs: 3,
      type: newNode.type === 'solar-tower' ? 'wireless-60ghz' : 'fiber'
    };
    setLinks(prev => [...prev, newLink]);
  };

  const handleToggleLinkState = (linkId) => {
    setLinks(prev => prev.map(l => {
      if (l.id === linkId) {
        return { ...l, currentLoadMbps: l.currentLoadMbps === 0 ? 450 : 0 };
      }
      return l;
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-dark)' }}>
      
      {/* Top Header Navbar */}
      <Navbar 
        nodes={nodes}
        links={links}
        simulationState={simulationState}
        setSimulationState={setSimulationState}
        onTriggerSimulation={(mode) => setSimulationState(mode)}
        onResetSimulation={() => setSimulationState('normal')}
      />

      {/* Main Container */}
      <div style={{ display: 'flex', flex: 1 }}>
        
        {/* Sidebar Navigation */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab View Content Area */}
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {activeTab === 'overview' && (
            <DashboardOverview 
              nodes={nodes} 
              links={links} 
              bgpPeers={bgpPeers}
              subscribers={subscribers}
              onSelectTab={setActiveTab}
              onAddNodeModal={() => setShowAddNodeModal(true)}
            />
          )}

          {activeTab === 'topology' && (
            <NetworkMap 
              nodes={nodes} 
              links={links}
              onAddNodeModal={() => setShowAddNodeModal(true)}
              simulationState={simulationState}
              onToggleLinkState={handleToggleLinkState}
            />
          )}

          {activeTab === 'bgp' && (
            <BgpRoutingConsole bgpPeers={bgpPeers} />
          )}

          {activeTab === 'solar' && (
            <SolarTelemetry nodes={nodes} />
          )}

          {activeTab === 'subscribers' && (
            <SubscriberManager 
              subscribers={subscribers} 
              onSelectWireGuardConfig={(sub) => setSelectedWgSubscriber(sub)}
            />
          )}

          {activeTab === 'privacy' && (
            <DnsPrivacyGuard dnsMetrics={dnsMetrics} />
          )}

          {activeTab === 'blueprint' && (
            <HardwareBlueprint />
          )}
        </main>
      </div>

      {/* Modals */}
      {showAddNodeModal && (
        <AddNodeModal 
          onClose={() => setShowAddNodeModal(false)}
          onAddNode={handleAddNode}
        />
      )}

      {selectedWgSubscriber && (
        <WireGuardModal 
          subscriber={selectedWgSubscriber}
          onClose={() => setSelectedWgSubscriber(null)}
        />
      )}

    </div>
  );
}
