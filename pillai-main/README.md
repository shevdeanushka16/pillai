# ORBIT — AI-Powered Mega-Event Orchestration

> **Predict. Coordinate. Move.**  
> An intelligent capacity management and decision-support platform that helps mega-event organizers sense demand surges, predict bottlenecks, and orchestrate real-time interventions across crowds, accommodation, and transportation networks.

---

## 🌟 Overview

ORBIT addresses the critical challenge of sudden demand spikes during mega-events (concerts, global expos, sports championships). Rather than acting as a passive monitoring screen, ORBIT operates as a closed-loop intelligence system:

$$\text{SENSES} \longrightarrow \text{PREDICTS} \longrightarrow \text{RECOMMENDS} \longrightarrow \text{OPTIMIZES}$$

When 92,500 attendees converge on a venue district, ORBIT detects escalating arterial pressure, forecasts turnstile bottlenecks 30 minutes in advance, generates coordinated mitigation actions, and verifies measurable capacity recovery.

---

## 🎨 Design Philosophy

ORBIT breaks away from generic AI hackathon tropes (no neon cyberpunk glows, no dark purple gradients, no floating glassmorphism). Instead, it adopts a **modern operations and data-journalism aesthetic**:
- **Palette**: Calm canvas (`#F7F7F5`), primary ink (`#171717`), muted slate (`#6B6B67`), and subtle 1px borders (`#E4E4E0`).
- **Restrained Status Accents**: Safe (`#247A52`), Warning (`#B7791F`), High (`#C65D2E`), Critical (`#B83232`).
- **Apple-like Restraint**: Information conveyed through data hierarchy and clean interactions rather than decorative noise.

---

## 🧠 Explainable Decision Engine

ORBIT avoids black-box generative hallucinations, employing deterministic mathematical capacity modeling:

$$\text{pressureScore} = 0.40 \cdot \text{crowdDensity} + 0.25 \cdot \text{transportLoad} + 0.20 \cdot \text{hotelOccupancy} + 0.15 \cdot \text{venueCapacity}$$

### Risk Tiers
- **0–39**: `NORMAL` (Safe, flow rates optimal)
- **40–59**: `MODERATE` (Operating within acceptable buffers)
- **60–79**: `HIGH` (Pre-emptive intervention advised)
- **80–100**: `CRITICAL` (Arterial saturation; unified alert declared)

---

## 🚀 Key Modules & Interactive Features

1. **Command Center**:
   - **Calibrated Event Pressure Gauge**: Dynamic score calculation with animated cubic ease-out transitions.
   - **Interactive City Flow Schematic**: Custom SVG vector topology map representing arterial routes, gates, and districts. Clicking any node (Arena, Metro, Bus Hub, Gate A, Gate C, Hotels) opens a live telemetry inspection drawer.
   - **Next 30 Minutes Projection Chart**: Line chart displaying projected crowd concentration peaking at 96% with a 91% confidence rating.
   - **Next Actions Operational Dispatch**: Numbered operational directives (`01 Divert Arrivals`, `02 Activate Shuttle`, `03 Shift Stays`, `04 Flatten Arrivals`) with individual toggles and batch execution.
   - **Before / After Matrix**: Instant verification modal displaying capacity drops across all sectors.
   - **Interactive Phasing Timeline**: Click to scrub through event phases (`3:00 PM`, `4:00 PM`, `5:00 PM`, `7:00 PM`, `9:30 PM`).

2. **Crowd Analytics**:
   - Zone A–D spatial load comparisons.
   - Hourly ingress trend curves (2:00 PM – 10:00 PM).
   - Real-time turnstile queue telemetry for Gates A, B, and C.
   - Peak forecast indicator (96,000 visitors at 7:00 PM).

3. **Accommodation Capacity**:
   - Tabular lodging ledger tracking 85 hotels and 6,800 rooms across 4 zones.
   - Zone A saturation detection with one-click rebalance to Zone C buffer hotels.

4. **Transportation Network**:
   - Corridor load metrics and travel times across Highway, Western Express, Dedicated Shuttle, and Suburban Rail.
   - Dedicated **"ACTIVATE ROUTE 3"** control with simulated fleet staging and toast feedback.

5. **Visitor Guidance Portal**:
   - Public-facing transit planner with origin selection across major hubs (`Andheri Metro`, `Bandra Terminus`, `Airport BOM`, `Dadar Junction`).
   - Recommends **Metro + Shuttle (32 min, Low Crowd)** via Gate C, warning attendees to avoid the congested highway route.
   - **"Send Route to Phone"** simulated SMS pass dispatch.

6. **Incident SITREP Generator**:
   - TopBar `SITREP BRIEF` tool compiling an official incident briefing for police, venue security, and transit field commanders, ready to print or copy.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Bundler & Tooling**: Vite
- **Styling**: Tailwind CSS
- **Charts & Data Visualization**: Recharts
- **Icons**: Lucide React
- **Architecture**: Context API + Custom Hooks (`useAnimatedNumber`)

---

## 💻 Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/orbit.git
cd orbit

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 👥 Hackathon Team Presentation Script (3-Minute Flow)

1. **Baseline State**: Present Command Center at normal operations (48,200 visitors, 55 Moderate pressure).
2. **Surge Trigger**: Click **"SIMULATE DEMAND SURGE"**. Point out the count-up to 92,500 visitors and the jump to **91 CRITICAL**.
3. **Sensing & Predicting**: Show Zone A and Route 1 turning critical red on the SVG map; point out the 30-minute line chart peaking at 96%.
4. **Transparent Logic**: Click **"DECISION LOGIC"** to show the transparent weighted formula and active rules.
5. **Orchestrated Action**: Click **"APPLY ALL ACTIONS"**. Show the **Before / After** modal proving pressure reduced to 66 (Moderate).
6. **Visitor Experience**: Switch to **Visitor Guidance** to demonstrate how end-users receive route guidance to Gate C via Metro + Shuttle.
