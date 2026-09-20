export const initialNodes = [
  {
    id: "node-gw-1",
    name: "AS65001 Gateway Alpha",
    type: "gateway",
    status: "online",
    x: 400,
    y: 120,
    lat: 37.7749,
    lng: -122.4194,
    asn: "AS65001",
    ip: "185.220.101.1",
    throughputMbps: 2450,
    maxCapacityMbps: 10000,
    connectedPeers: 5,
    powerSource: "Grid + Generator",
    batteryPct: 100,
    tempC: 38,
    uplink: "Fiber Transit (Cogent / HE)",
    description: "Main Autonomous System Edge Router and BGP Peering Point"
  },
  {
    id: "node-sat-1",
    name: "Orbital Backhaul Relay",
    type: "satellite",
    status: "online",
    x: 180,
    y: 80,
    lat: 37.8000,
    lng: -122.4500,
    asn: "AS14593",
    ip: "10.64.0.1",
    throughputMbps: 450,
    maxCapacityMbps: 1000,
    connectedPeers: 2,
    powerSource: "Solar Satellite Array",
    batteryPct: 98,
    tempC: 22,
    uplink: "LEO Satellite Constellation",
    description: "Failover high-altitude satellite link for emergency routing"
  },
  {
    id: "node-hill-1",
    name: "Ridge Top Solar Tower 01",
    type: "solar-tower",
    status: "online",
    x: 240,
    y: 280,
    lat: 37.7600,
    lng: -122.4400,
    ip: "10.64.1.1",
    throughputMbps: 820,
    maxCapacityMbps: 2500,
    connectedPeers: 4,
    powerSource: "Off-Grid Solar (800W)",
    batteryPct: 86,
    tempC: 31,
    uplink: "60GHz Millimeter Wave Dish",
    description: "Primary wireless backbone tower powered by LiFePO4 battery array"
  },
  {
    id: "node-hill-2",
    name: "North Peak Relay Station",
    type: "solar-tower",
    status: "warning",
    x: 580,
    y: 260,
    lat: 37.7900,
    lng: -122.4000,
    ip: "10.64.1.2",
    throughputMbps: 610,
    maxCapacityMbps: 2500,
    connectedPeers: 3,
    powerSource: "Off-Grid Solar (600W)",
    batteryPct: 42,
    tempC: 36,
    uplink: "5GHz Point-to-Point Radio",
    description: "Secondary mesh relay tower. Operating on battery during cloud cover."
  },
  {
    id: "node-hub-south",
    name: "Valley Community Micro-IXP",
    type: "micro-ixp",
    status: "online",
    x: 320,
    y: 440,
    lat: 37.7300,
    lng: -122.4200,
    ip: "10.64.2.1",
    throughputMbps: 1120,
    maxCapacityMbps: 5000,
    connectedPeers: 8,
    powerSource: "Community Microgrid",
    batteryPct: 92,
    tempC: 29,
    uplink: "Dark Fiber Ring + Microwave",
    description: "Community-owned switching fabric serving southern district"
  },
  {
    id: "node-client-sec1",
    name: "Co-op Housing Mesh Cluster A",
    type: "client-cluster",
    status: "online",
    x: 180,
    y: 520,
    lat: 37.7200,
    lng: -122.4500,
    ip: "10.64.10.0/24",
    throughputMbps: 380,
    maxCapacityMbps: 1000,
    connectedPeers: 42,
    powerSource: "Local AC",
    batteryPct: 100,
    tempC: 25,
    uplink: "Wi-Fi 6E Mesh Array",
    description: "42 Sovereign subscriber households connected via rooftop receivers"
  },
  {
    id: "node-client-sec2",
    name: "Eco-Village Mesh Cluster B",
    type: "client-cluster",
    status: "online",
    x: 520,
    y: 480,
    lat: 37.7400,
    lng: -122.3800,
    ip: "10.64.20.0/24",
    throughputMbps: 540,
    maxCapacityMbps: 1000,
    connectedPeers: 68,
    powerSource: "Micro-hydro + Battery",
    batteryPct: 95,
    tempC: 27,
    uplink: "Optical Wireless (Free Space Optics)",
    description: "68 Sovereign subscriber nodes connected via zero-trust VPN mesh"
  }
];

export const initialLinks = [
  { id: "link-1", source: "node-gw-1", target: "node-sat-1", capacityMbps: 1000, currentLoadMbps: 120, latencyMs: 28, type: "satellite" },
  { id: "link-2", source: "node-gw-1", target: "node-hill-1", capacityMbps: 5000, currentLoadMbps: 850, latencyMs: 2, type: "fiber" },
  { id: "link-3", source: "node-gw-1", target: "node-hill-2", capacityMbps: 2500, currentLoadMbps: 610, latencyMs: 4, type: "wireless-60ghz" },
  { id: "link-4", source: "node-hill-1", target: "node-hub-south", capacityMbps: 2500, currentLoadMbps: 820, latencyMs: 3, type: "wireless-60ghz" },
  { id: "link-5", source: "node-hill-2", target: "node-hub-south", capacityMbps: 1000, currentLoadMbps: 310, latencyMs: 6, type: "wireless-5ghz" },
  { id: "link-6", source: "node-hub-south", target: "node-client-sec1", capacityMbps: 1000, currentLoadMbps: 380, latencyMs: 5, type: "mesh-wifi" },
  { id: "link-7", source: "node-hub-south", target: "node-client-sec2", capacityMbps: 1000, currentLoadMbps: 540, latencyMs: 4, type: "mesh-fso" },
  { id: "link-8", source: "node-hill-1", target: "node-client-sec1", capacityMbps: 1000, currentLoadMbps: 150, latencyMs: 7, type: "backup-mesh" }
];

export const bgpPeers = [
  { asn: "AS6939", name: "Hurricane Electric (Transit)", type: "Transit", state: "Established", prefixCount: 945200, uptime: "42d 12h", latency: "14ms", rpkiValid: true },
  { asn: "AS174", name: "Cogent Communications (Transit)", type: "Transit", state: "Established", prefixCount: 938100, uptime: "19d 08h", latency: "11ms", rpkiValid: true },
  { asn: "AS25840", name: "SF-MIX Community IXP", type: "IXP Peering", state: "Established", prefixCount: 14200, uptime: "112d 04h", latency: "1ms", rpkiValid: true },
  { asn: "AS14593", name: "Starlink SpaceX Backhaul", type: "Failover Transit", state: "Active Standby", prefixCount: 120, uptime: "8d 21h", latency: "38ms", rpkiValid: true }
];

export const subscribersData = [
  { id: "SUB-0911", handle: "dragon9ph.mesh", address: "Mobile Phone Node", tier: "Fiber Core (1 Gbps)", planPrice: "$50 / mo (or 50 MESH)", balance: "500 MESH", status: "Active", wgPrivateKey: "eK9v2M8Pq1wE5rT0yU4iO7aS3dF6gH8jK9xV4bZ1nM8=", wgPublicKey: "9xK2...mL8P=", dataUsedGb: 12.4, ip: "10.64.10.99" },
  { id: "SUB-0912", handle: "alice.mesh", address: "Rooftop 4A - North Ave", tier: "Community Sovereign (100 Mbps)", planPrice: "$25 / mo (or 25 MESH)", balance: "120 MESH", status: "Active", wgPublicKey: "9xK2...mL8P=", dataUsedGb: 482.4, ip: "10.64.10.14" },
  { id: "SUB-0913", handle: "bob.sovereign", address: "Solar Cabin 12", tier: "Fiber Core (1 Gbps)", planPrice: "$50 / mo (or 50 MESH)", balance: "45 MESH", status: "Active", wgPublicKey: "3bF9...qZ1X=", dataUsedGb: 1204.1, ip: "10.64.10.19" },
  { id: "SUB-0914", handle: "charlie.node", address: "Hilltop Barn", tier: "Host Node Relay (Free 1Gbps)", planPrice: "$0 (Relay Host)", balance: "410 MESH", status: "Active", wgPublicKey: "7vR4...wK9N=", dataUsedGb: 3410.8, ip: "10.64.1.15" },
  { id: "SUB-0915", handle: "eco_coop_hall", address: "Community Hall Bld 3", tier: "Fiber Core (1 Gbps)", planPrice: "$50 / mo", balance: "200 MESH", status: "Active", wgPublicKey: "8mP1...kJ5Q=", dataUsedGb: 2890.0, ip: "10.64.20.10" },
  { id: "SUB-0916", handle: "dan.freedom", address: "Trailer Unit #8", tier: "Mesh Free (10 Mbps)", planPrice: "$0 Free Tier", balance: "0 MESH", status: "Active", wgPublicKey: "1aX0...pL3Z=", dataUsedGb: 45.2, ip: "10.64.10.88" }
];

export const dnsMetrics = {
  totalQueries24h: 1842090,
  blockedQueries24h: 412080,
  blockRatePct: 22.37,
  avgResponseMs: 3.4,
  dohStatus: "Active - Encrypted DoH/DoT",
  ipfsGatewayConnected: true,
  ipfsPinnedBlocks: 84920,
  topBlockedCategories: [
    { category: "Ad Networks & Tracking", count: 210450, pct: 51.1 },
    { category: "Malware & Phishing Sinkhole", count: 124300, pct: 30.1 },
    { category: "Corporate Telemetry / Bloat", count: 77330, pct: 18.8 }
  ]
};
