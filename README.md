# 🌐 AetherOS // Sovereign ISP Suite

> **Decentralized Autonomous Community Network, Mesh Topology Simulator & BGP Core Management Platform.**

![Sovereign ISP](https://img.shields.io/badge/Status-Active-10b981?style=for-the-badge)
![ASN](https://img.shields.io/badge/ASN-AS65001-06b6d4?style=for-the-badge)
![WireGuard](https://img.shields.io/badge/Security-WireGuard_Noise_IK-8b5cf6?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-f59e0b?style=for-the-badge)

AetherOS is a web-based command center for planning, deploying, simulating, and monitoring community-owned **Sovereign Internet Service Providers (ISPs)**. It provides autonomous network management outside single corporate monopoly control, featuring off-grid solar telemetry, real-time mesh canvas simulation, BGP route broadcasting, uncensored DNS-over-HTTPS, and zero-trust WireGuard subscriber onboarding.

---

## ⚡ Key Features

- **🌐 Autonomous System Core (AS65001)**: Multi-homed BGP peering management (Hurricane Electric, Cogent, local IXPs) with RPKI validation and IP prefix broadcast controls (`185.220.101.0/24` IPv4, `2a0f:9400::/32` IPv6).
- **📡 Interactive Mesh Topology Canvas**: Real-time visual map with animated packet flow pulses across dark fiber, 60GHz millimeter-wave dish radios, free-space optics, and LEO satellite uplinks.
- **⚡ Disaster & Weather Simulation Engine**: Test live dynamic mesh rerouting under simulated fiber cuts and solar power outages.
- **☀️ Off-Grid Solar & Battery Telemetry**: Track hilltop tower solar array wattage, LiFePO4 battery discharge cycles, enclosure thermal metrics, and storm eco-power modes.
- **🔐 Sovereign Subscribers & WireGuard Generator**: Public-key authenticated peer management, P2P mesh token credit balances, and instant `.conf` WireGuard mesh VPN configuration exports.
- **🛡️ Uncensored DoH & IPFS Gateway**: Zero-log recursive DNS-over-HTTPS resolver with automated tracking sinkholes and decentralized web bridges to IPFS & Arweave.
- **🛠️ Construction & Hardware Blueprint**: Complete DIY Bill of Materials (Ubiquiti/MikroTik radio selection, solar panel sizing, and OpenWrt/RouterOS BGP config snippets).

---

## 🛠️ Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- `npm` or `yarn`

### Installation & Local Setup

```bash
# Clone the repository
git clone https://github.com/fluidmotiontv-oss/sovereign-isp.git

# Navigate into project folder
cd sovereign-isp

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open `http://localhost:5173/` in your browser to access the AetherOS Sovereign ISP Command Center.

---

## 🏗️ Architecture Stack

- **Frontend**: React 19 + Vite
- **Styling**: Vanilla CSS custom design system with dark mode glassmorphism & HSL accents
- **Visuals & Charts**: HTML5 Canvas animation engine, Lucide React Icons, Chart.js & `react-chartjs-2`
- **UI FX**: Canvas Confetti

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
