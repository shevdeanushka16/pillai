import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, CheckCircle2, X, Zap } from 'lucide-react';
import { MetricPill } from '../common/MetricPill';

interface NodeDetails {
  id: string;
  name: string;
  category: string;
  status: 'NORMAL' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  telemetry: { label: string; value: string }[];
  actionPrompt?: string;
  actionId?: string;
}

export const CityFlowMap: React.FC = () => {
  const { simulationState, actions, toggleAction } = useApp();
  const [activeHoverNode, setActiveHoverNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<NodeDetails | null>(null);

  const shuttleActive = simulationState === 'optimized' || actions.find((a) => a.id === 'activate-shuttle')?.applied;
  const divertActive = simulationState === 'optimized' || actions.find((a) => a.id === 'divert-arrivals')?.applied;

  // Determine district status colors based on state
  const getZoneStatus = (zoneId: 'A' | 'B' | 'C' | 'D') => {
    if (simulationState === 'normal') {
      return zoneId === 'A' ? 'MODERATE' : 'NORMAL';
    }
    if (simulationState === 'surge') {
      if (zoneId === 'A') return divertActive ? 'HIGH' : 'CRITICAL';
      if (zoneId === 'C') return shuttleActive ? 'MODERATE' : 'HIGH';
      if (zoneId === 'B') return 'MODERATE';
      return 'NORMAL';
    }
    // optimized
    if (zoneId === 'A') return 'HIGH';
    if (zoneId === 'C') return 'MODERATE';
    if (zoneId === 'B') return 'NORMAL';
    return 'NORMAL';
  };

  const zoneAStatus = getZoneStatus('A');
  const zoneBStatus = getZoneStatus('B');
  const zoneCStatus = getZoneStatus('C');
  const zoneDStatus = getZoneStatus('D');

  const getNodeDetails = (id: string): NodeDetails => {
    switch (id) {
      case 'metro':
        return {
          id: 'metro',
          name: 'Andheri Metro Station',
          category: 'Rapid Transit Terminal',
          status: simulationState === 'surge' ? 'HIGH' : 'NORMAL',
          telemetry: [
            { label: 'Train Headway', value: '2.5 min intervals' },
            { label: 'Platform Density', value: simulationState === 'surge' ? '86%' : '44%' },
            { label: 'Hourly Ingress', value: simulationState === 'surge' ? '18,400 pax/hr' : '8,200 pax/hr' },
            { label: 'Corridor Connection', value: 'Route 1 (Highway) & Route 3 (Shuttle)' },
          ],
          actionPrompt: shuttleActive ? 'Shuttle Route 3 Active' : 'Activate Dedicated Route 3 Shuttle',
          actionId: 'activate-shuttle',
        };
      case 'bus':
        return {
          id: 'bus',
          name: 'Central Bus Hub',
          category: 'Staging & Transit Bay',
          status: 'NORMAL',
          telemetry: [
            { label: 'Staged Shuttles', value: '18 Electric Coaches' },
            { label: 'Queue Capacity', value: '1,200 pax buffer' },
            { label: 'Corridor Feed', value: 'Route 2 Express & Route 3 Shuttle' },
            { label: 'Standby Drivers', value: '24 Operators Active' },
          ],
          actionPrompt: 'Inspect Route 3 Fleet',
          actionId: 'activate-shuttle',
        };
      case 'venue':
        return {
          id: 'venue',
          name: 'Main Concert Arena (BKC)',
          category: 'Primary Mega-Event Arena',
          status: zoneAStatus,
          telemetry: [
            { label: 'Total Capacity', value: '65,000 Reserved Seats' },
            { label: 'Turnstile Port Count', value: '3 Major Gate Plazas (A, B, C)' },
            { label: 'Current Gate Load', value: simulationState === 'surge' ? '94% Saturated' : '58% Normal' },
            { label: 'Acoustic Compliance', value: '98.2 dB (Compliant)' },
          ],
          actionPrompt: divertActive ? 'Diversion Active' : 'Divert Ingress to Gate C',
          actionId: 'divert-arrivals',
        };
      case 'gate-a':
        return {
          id: 'gate-a',
          name: 'Gate A (West Arterial Entry)',
          category: 'Direct Highway Turnstile Plaza',
          status: divertActive ? 'MODERATE' : simulationState === 'surge' ? 'CRITICAL' : 'NORMAL',
          telemetry: [
            { label: 'Queue Wait Time', value: divertActive ? '6 minutes' : simulationState === 'surge' ? '28 minutes' : '4 minutes' },
            { label: 'Turnstile Throughput', value: '340 pax / minute' },
            { label: 'Queue Line Depth', value: divertActive ? '220 meters' : simulationState === 'surge' ? '980 meters' : '150 meters' },
            { label: 'Optical Sensor Status', value: '14/14 Turnstiles Online' },
          ],
          actionPrompt: divertActive ? 'Diverted to Gate C ✓' : 'Reroute Gate A → Gate C',
          actionId: 'divert-arrivals',
        };
      case 'gate-c':
        return {
          id: 'gate-c',
          name: 'Gate C (North Ingress Plaza)',
          category: 'Dedicated Shuttle Ingress Port',
          status: 'NORMAL',
          telemetry: [
            { label: 'Queue Wait Time', value: '2 minutes (Smooth)' },
            { label: 'Current Utilization', value: divertActive ? '42% (Optimal Absorption)' : '38% (Under-utilized)' },
            { label: 'Turnstile Throughput', value: '180 pax / minute (14 lanes)' },
            { label: 'Shuttle Bay Access', value: 'Direct pedestrian canopy' },
          ],
          actionPrompt: divertActive ? 'Receiving Flow ✓' : 'Direct Inbound Flow Here',
          actionId: 'divert-arrivals',
        };
      case 'hotels':
        return {
          id: 'hotels',
          name: 'Hospitality District Cluster',
          category: 'Lodging & Visitor Stays',
          status: zoneBStatus,
          telemetry: [
            { label: 'Hotel Properties', value: '31 Active Venues' },
            { label: 'Available Rooms', value: '580 Rooms Vacant' },
            { label: 'Cluster Occupancy', value: '71% (High Demand)' },
            { label: 'Auxiliary Cluster', value: 'Zone C (940 rooms available)' },
          ],
          actionPrompt: 'Shift Bookings to Zone C',
          actionId: 'shift-stays',
        };
      default:
        return {
          id,
          name: `District Node (${id.toUpperCase()})`,
          category: 'Spatial Zone',
          status: 'NORMAL',
          telemetry: [{ label: 'Telemetry', value: 'Active sensor feed' }],
        };
    }
  };

  const handleNodeClick = (id: string) => {
    setSelectedNode(getNodeDetails(id));
  };

  return (
    <div className="bg-surface border border-border rounded-md flex flex-col overflow-hidden relative">
      {/* Header bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-[#FAFAF8]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono tracking-wider uppercase text-secondary">
              CITY FLOW SCHEMATIC
            </span>
            <span className="text-[10px] font-mono bg-surface border border-border px-1.5 py-0.5 rounded text-secondary">
              INTERACTIVE TOPOLOGY • CLICK ANY NODE
            </span>
          </div>
          <h3 className="text-sm font-semibold tracking-tight text-primary">
            Event Arterials & Pedestrian Corridor Movement
          </h3>
        </div>

        {/* Legend */}
        <div className="hidden sm:flex items-center gap-4 text-[11px] font-mono">
          <span className="flex items-center gap-1.5 text-secondary">
            <span className="w-2 h-2 rounded-full bg-safe" />
            NORMAL
          </span>
          <span className="flex items-center gap-1.5 text-secondary">
            <span className="w-2 h-2 rounded-full bg-warning" />
            MODERATE
          </span>
          <span className="flex items-center gap-1.5 text-secondary">
            <span className="w-2 h-2 rounded-full bg-high" />
            HIGH
          </span>
          <span className="flex items-center gap-1.5 text-secondary">
            <span className="w-2 h-2 rounded-full bg-critical" />
            CRITICAL
          </span>
        </div>
      </div>

      {/* SVG Map Canvas */}
      <div className="relative w-full bg-[#FAF9F6] p-4 flex items-center justify-center overflow-hidden">
        {/* Subtle grid pattern */}
        <svg
          viewBox="0 0 820 440"
          className="w-full h-auto select-none max-w-4xl"
          style={{ minHeight: '340px' }}
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#EAEAE5" strokeWidth="0.75" />
            </pattern>
          </defs>

          {/* Background grid */}
          <rect width="820" height="440" fill="url(#grid)" />

          {/* ========================================================
              DISTRICT BOUNDARIES & LABELS
          ======================================================== */}
          {/* ZONE C: Transit District (Top-Left) */}
          <g className="cursor-pointer" onClick={() => handleNodeClick('metro')}>
            <rect
              x="30"
              y="30"
              width="360"
              height="180"
              rx="6"
              fill={zoneCStatus === 'HIGH' ? '#FDF1EB' : '#FFFFFF'}
              fillOpacity={zoneCStatus === 'HIGH' ? '0.6' : '0.8'}
              stroke={zoneCStatus === 'HIGH' ? '#C65D2E' : '#E4E4E0'}
              strokeWidth="1.5"
              strokeDasharray={zoneCStatus === 'HIGH' ? 'none' : '4 4'}
            />
            <text x="45" y="55" fill="#171717" fontSize="12" fontWeight="600" fontFamily="Inter, sans-serif">
              ZONE C
            </text>
            <text x="96" y="55" fill="#6B6B67" fontSize="11" fontFamily="JetBrains Mono, monospace">
              Transit District
            </text>
            <rect
              x="45"
              y="65"
              width="60"
              height="16"
              rx="2"
              fill={zoneCStatus === 'HIGH' ? '#FDF1EB' : '#EBF6F0'}
              stroke={zoneCStatus === 'HIGH' ? '#C65D2E' : '#247A52'}
              strokeWidth="0.75"
            />
            <text
              x="75"
              y="77"
              textAnchor="middle"
              fill={zoneCStatus === 'HIGH' ? '#98431E' : '#1C5B3E'}
              fontSize="9"
              fontWeight="600"
              fontFamily="JetBrains Mono, monospace"
            >
              {zoneCStatus}
            </text>
          </g>

          {/* ZONE A: Venue District (Top-Right) */}
          <g className="cursor-pointer" onClick={() => handleNodeClick('venue')}>
            <rect
              x="430"
              y="30"
              width="360"
              height="210"
              rx="6"
              fill={zoneAStatus === 'CRITICAL' ? '#FCEDED' : zoneAStatus === 'HIGH' ? '#FDF1EB' : '#FFFFFF'}
              fillOpacity="0.7"
              stroke={zoneAStatus === 'CRITICAL' ? '#B83232' : zoneAStatus === 'HIGH' ? '#C65D2E' : '#E4E4E0'}
              strokeWidth={zoneAStatus === 'CRITICAL' ? '2' : '1.5'}
            />
            <text x="445" y="55" fill="#171717" fontSize="12" fontWeight="600" fontFamily="Inter, sans-serif">
              ZONE A
            </text>
            <text x="496" y="55" fill="#6B6B67" fontSize="11" fontFamily="JetBrains Mono, monospace">
              Venue District (Main Arena)
            </text>
            <rect
              x="445"
              y="65"
              width="68"
              height="16"
              rx="2"
              fill={zoneAStatus === 'CRITICAL' ? '#FCEDED' : '#FEF8EE'}
              stroke={zoneAStatus === 'CRITICAL' ? '#B83232' : '#B7791F'}
              strokeWidth="0.75"
            />
            <text
              x="479"
              y="77"
              textAnchor="middle"
              fill={zoneAStatus === 'CRITICAL' ? '#8E2323' : '#8D5B15'}
              fontSize="9"
              fontWeight="600"
              fontFamily="JetBrains Mono, monospace"
            >
              {zoneAStatus}
            </text>
          </g>

          {/* ZONE D: Overflow District (Bottom-Left) */}
          <g>
            <rect
              x="30"
              y="230"
              width="360"
              height="180"
              rx="6"
              fill="#FFFFFF"
              fillOpacity="0.8"
              stroke="#E4E4E0"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <text x="45" y="255" fill="#171717" fontSize="12" fontWeight="600" fontFamily="Inter, sans-serif">
              ZONE D
            </text>
            <text x="96" y="255" fill="#6B6B67" fontSize="11" fontFamily="JetBrains Mono, monospace">
              Overflow & Staging District
            </text>
            <rect x="45" y="265" width="58" height="16" rx="2" fill="#EBF6F0" stroke="#247A52" strokeWidth="0.75" />
            <text
              x="74"
              y="277"
              textAnchor="middle"
              fill="#1C5B3E"
              fontSize="9"
              fontWeight="600"
              fontFamily="JetBrains Mono, monospace"
            >
              {zoneDStatus}
            </text>
          </g>

          {/* ZONE B: Hospitality District (Bottom-Right) */}
          <g className="cursor-pointer" onClick={() => handleNodeClick('hotels')}>
            <rect
              x="430"
              y="260"
              width="360"
              height="150"
              rx="6"
              fill={zoneBStatus === 'MODERATE' ? '#FEF8EE' : '#FFFFFF'}
              fillOpacity="0.7"
              stroke={zoneBStatus === 'MODERATE' ? '#B7791F' : '#E4E4E0'}
              strokeWidth="1.5"
            />
            <text x="445" y="285" fill="#171717" fontSize="12" fontWeight="600" fontFamily="Inter, sans-serif">
              ZONE B
            </text>
            <text x="496" y="285" fill="#6B6B67" fontSize="11" fontFamily="JetBrains Mono, monospace">
              Hospitality & Hotels Cluster
            </text>
            <rect
              x="445"
              y="295"
              width="68"
              height="16"
              rx="2"
              fill={zoneBStatus === 'MODERATE' ? '#FEF8EE' : '#EBF6F0'}
              stroke={zoneBStatus === 'MODERATE' ? '#B7791F' : '#247A52'}
              strokeWidth="0.75"
            />
            <text
              x="479"
              y="307"
              textAnchor="middle"
              fill={zoneBStatus === 'MODERATE' ? '#8D5B15' : '#1C5B3E'}
              fontSize="9"
              fontWeight="600"
              fontFamily="JetBrains Mono, monospace"
            >
              {zoneBStatus}
            </text>
          </g>

          {/* ========================================================
              MOVEMENT ROUTES & FLOW PATHS
          ======================================================== */}
          {/* ROUTE 1: Metro Station -> Gate A (Arterial Corridor) */}
          <g>
            <path
              d="M 170 130 C 280 130, 360 110, 485 110"
              fill="none"
              stroke={simulationState === 'surge' && !divertActive ? '#B83232' : '#6B6B67'}
              strokeWidth={simulationState === 'surge' && !divertActive ? '4' : '2'}
              strokeDasharray={simulationState === 'surge' && !divertActive ? '6 4' : 'none'}
              className={simulationState === 'surge' && !divertActive ? 'animate-flow-fast' : ''}
            />
            {/* Label */}
            <rect x="290" y="100" width="84" height="18" rx="2" fill="#FFFFFF" stroke="#E4E4E0" strokeWidth="0.75" />
            <text x="332" y="113" textAnchor="middle" fill="#6B6B67" fontSize="9" fontFamily="JetBrains Mono, monospace">
              Route 1 (Arterial)
            </text>
          </g>

          {/* ROUTE 3: Dedicated Shuttle Bypass (Metro -> North Gate C) */}
          <g>
            <path
              d="M 170 110 C 220 50, 480 40, 640 85"
              fill="none"
              stroke={shuttleActive ? '#315CFF' : '#D0D0C8'}
              strokeWidth={shuttleActive ? '3.5' : '1.5'}
              strokeDasharray={shuttleActive ? '8 5' : '4 4'}
              className={shuttleActive ? 'animate-flow-optimized' : ''}
            />
            <rect
              x="360"
              y="40"
              width="104"
              height="18"
              rx="2"
              fill={shuttleActive ? '#EEF2FF' : '#FFFFFF'}
              stroke={shuttleActive ? '#315CFF' : '#E4E4E0'}
              strokeWidth="0.75"
            />
            <text
              x="412"
              y="53"
              textAnchor="middle"
              fill={shuttleActive ? '#315CFF' : '#6B6B67'}
              fontSize="9"
              fontWeight={shuttleActive ? '600' : '400'}
              fontFamily="JetBrains Mono, monospace"
            >
              Route 3 {shuttleActive ? '(SHUTTLE ACTIVE)' : '(Standby)'}
            </text>
          </g>

          {/* ROUTE 2: Bus Hub -> Gate B (Corridor) */}
          <g>
            <path
              d="M 280 200 C 350 200, 440 180, 525 180"
              fill="none"
              stroke={simulationState === 'surge' ? '#C65D2E' : '#6B6B67'}
              strokeWidth={simulationState === 'surge' ? '3' : '2'}
              strokeDasharray={simulationState === 'surge' ? '6 4' : 'none'}
              className={simulationState === 'surge' ? 'animate-flow-calm' : ''}
            />
            <rect x="360" y="185" width="80" height="18" rx="2" fill="#FFFFFF" stroke="#E4E4E0" strokeWidth="0.75" />
            <text x="400" y="198" textAnchor="middle" fill="#6B6B67" fontSize="9" fontFamily="JetBrains Mono, monospace">
              Route 2 (Express)
            </text>
          </g>

          {/* ROUTE 4: Overflow Zone D -> Bus Hub */}
          <g>
            <path d="M 180 320 C 220 320, 240 260, 260 215" fill="none" stroke="#6B6B67" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="195" y="275" fill="#6B6B67" fontSize="9" fontFamily="JetBrains Mono, monospace">
              Route 4 (Staging Link)
            </text>
          </g>

          {/* Hospitality Walkway: Hotels -> Gate B */}
          <g>
            <path d="M 590 320 C 580 250, 560 220, 550 195" fill="none" stroke="#247A52" strokeWidth="2" strokeDasharray="4 4" />
            <text x="585" y="260" fill="#247A52" fontSize="9" fontFamily="JetBrains Mono, monospace">
              Hospitality Corridor
            </text>
          </g>

          {/* ========================================================
              PHYSICAL HUBS & VENUE OBJECTS (CLICKABLE)
          ======================================================== */}
          {/* Metro Station (Zone C) */}
          <g
            className="cursor-pointer group"
            onClick={() => handleNodeClick('metro')}
            onMouseEnter={() => setActiveHoverNode('metro')}
            onMouseLeave={() => setActiveHoverNode(null)}
          >
            <circle cx="150" cy="130" r="18" fill="#FFFFFF" stroke="#315CFF" strokeWidth="2.5" />
            <rect x="144" y="124" width="12" height="12" rx="1" fill="#315CFF" />
            <text x="150" y="162" textAnchor="middle" fill="#171717" fontSize="11" fontWeight="600">
              Metro Station
            </text>
            <text x="150" y="174" textAnchor="middle" fill="#6B6B67" fontSize="9" fontFamily="JetBrains Mono, monospace">
              Andheri Arterial (Click)
            </text>
          </g>

          {/* Bus Hub (Zone C/D) */}
          <g
            className="cursor-pointer group"
            onClick={() => handleNodeClick('bus')}
            onMouseEnter={() => setActiveHoverNode('bus')}
            onMouseLeave={() => setActiveHoverNode(null)}
          >
            <circle cx="260" cy="200" r="15" fill="#FFFFFF" stroke="#171717" strokeWidth="2" />
            <rect x="254" y="194" width="12" height="12" rx="1" fill="#171717" />
            <text x="260" y="228" textAnchor="middle" fill="#171717" fontSize="11" fontWeight="600">
              Bus Hub
            </text>
            <text x="260" y="240" textAnchor="middle" fill="#6B6B67" fontSize="9" fontFamily="JetBrains Mono, monospace">
              18 Shuttles (Click)
            </text>
          </g>

          {/* Hotels Cluster (Zone B) */}
          <g
            className="cursor-pointer group"
            onClick={() => handleNodeClick('hotels')}
            onMouseEnter={() => setActiveHoverNode('hotels')}
            onMouseLeave={() => setActiveHoverNode(null)}
          >
            <rect x="580" y="325" width="80" height="42" rx="3" fill="#FFFFFF" stroke="#B7791F" strokeWidth="2" />
            <text x="620" y="344" textAnchor="middle" fill="#171717" fontSize="11" fontWeight="600">
              Hotels Cluster
            </text>
            <text x="620" y="357" textAnchor="middle" fill="#6B6B67" fontSize="9" fontFamily="JetBrains Mono, monospace">
              Zone B (Click)
            </text>
          </g>

          {/* MAIN VENUE (Zone A) */}
          <g
            className="cursor-pointer"
            onClick={() => handleNodeClick('venue')}
            onMouseEnter={() => setActiveHoverNode('venue')}
            onMouseLeave={() => setActiveHoverNode(null)}
          >
            {/* Arena Outline */}
            <rect
              x="530"
              y="80"
              width="220"
              height="125"
              rx="12"
              fill="#FFFFFF"
              stroke="#171717"
              strokeWidth="2.5"
            />
            {/* Arena Center Pitch / Stage */}
            <rect
              x="570"
              y="110"
              width="140"
              height="65"
              rx="6"
              fill="#F2F2EE"
              stroke="#D0D0C8"
              strokeWidth="1.5"
            />
            <text x="640" y="137" textAnchor="middle" fill="#171717" fontSize="13" fontWeight="700">
              MAIN VENUE
            </text>
            <text x="640" y="152" textAnchor="middle" fill="#6B6B67" fontSize="10" fontFamily="JetBrains Mono, monospace">
              Capacity: 65,000 Seats (Click)
            </text>

            {/* GATE A (West Entry) */}
            <g className="cursor-pointer" onClick={(e) => { e.stopPropagation(); handleNodeClick('gate-a'); }}>
              <circle
                cx="530"
                cy="110"
                r="10"
                fill={divertActive ? '#FFFFFF' : simulationState === 'surge' ? '#FCEDED' : '#FFFFFF'}
                stroke={divertActive ? '#247A52' : simulationState === 'surge' ? '#B83232' : '#6B6B67'}
                strokeWidth="2.5"
              />
              <text x="508" y="102" fill="#171717" fontSize="10" fontWeight="700" fontFamily="JetBrains Mono, monospace">
                Gate A
              </text>
              <text
                x="508"
                y="114"
                fill={divertActive ? '#247A52' : simulationState === 'surge' ? '#B83232' : '#6B6B67'}
                fontSize="8"
                fontWeight="600"
                fontFamily="JetBrains Mono, monospace"
              >
                {divertActive ? 'DIVERTED' : simulationState === 'surge' ? '96% CRIT' : '52%'}
              </text>
            </g>

            {/* GATE B (South Entry) */}
            <g className="cursor-pointer" onClick={(e) => { e.stopPropagation(); handleNodeClick('gate-b'); }}>
              <circle
                cx="550"
                cy="195"
                r="9"
                fill="#FFFFFF"
                stroke={simulationState === 'surge' ? '#C65D2E' : '#247A52'}
                strokeWidth="2"
              />
              <text x="525" y="212" fill="#171717" fontSize="10" fontWeight="700" fontFamily="JetBrains Mono, monospace">
                Gate B
              </text>
              <text x="525" y="223" fill="#6B6B67" fontSize="8" fontFamily="JetBrains Mono, monospace">
                {simulationState === 'surge' ? '74% HIGH' : '44%'}
              </text>
            </g>

            {/* GATE C (North Entry / Ingress Diversion) */}
            <g className="cursor-pointer" onClick={(e) => { e.stopPropagation(); handleNodeClick('gate-c'); }}>
              <circle
                cx="640"
                cy="80"
                r="10"
                fill={divertActive ? '#EBF6F0' : '#FFFFFF'}
                stroke={divertActive ? '#247A52' : '#247A52'}
                strokeWidth="2.5"
              />
              <text x="640" y="66" textAnchor="middle" fill="#171717" fontSize="10" fontWeight="700" fontFamily="JetBrains Mono, monospace">
                Gate C {divertActive && '✓ (RECEIVING FLOW)'}
              </text>
              <text
                x="640"
                y="98"
                textAnchor="middle"
                fill={divertActive ? '#247A52' : '#6B6B67'}
                fontSize="8"
                fontWeight="600"
                fontFamily="JetBrains Mono, monospace"
              >
                {divertActive ? '42% (OPEN ABSORPTION)' : '38% LOW'}
              </text>
            </g>
          </g>

          {/* Divert Flow Arrow from Gate A to Gate C if diverted */}
          {divertActive && (
            <g className="animate-pulse">
              <path
                d="M 525 95 C 530 65, 590 55, 630 72"
                fill="none"
                stroke="#247A52"
                strokeWidth="2.5"
                strokeDasharray="4 3"
              />
              <text x="575" y="60" textAnchor="middle" fill="#1C5B3E" fontSize="9" fontWeight="700" fontFamily="JetBrains Mono, monospace">
                DIVERTED 12,000 →
              </text>
            </g>
          )}
        </svg>

        {/* Hover inspection badge */}
        {activeHoverNode && !selectedNode && (
          <div className="absolute top-4 right-4 bg-white/95 border border-border px-3 py-1.5 rounded shadow-sm text-xs font-mono">
            <span className="text-secondary text-[10px] uppercase block">QUICK PEEK</span>
            <span className="text-primary font-bold uppercase">{activeHoverNode}</span>
          </div>
        )}

        {/* Slide-in Detailed Node Inspector Drawer */}
        {selectedNode && (
          <div className="absolute top-3 right-3 bottom-3 w-80 bg-white/95 backdrop-blur-sm border border-border rounded shadow-xl p-4 flex flex-col justify-between z-20 animate-in slide-in-from-right-4 duration-200">
            <div>
              <div className="flex items-start justify-between border-b border-border pb-2.5 mb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-secondary block">
                    {selectedNode.category}
                  </span>
                  <h4 className="text-sm font-bold text-primary font-mono">
                    {selectedNode.name}
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-secondary hover:text-primary p-1 rounded hover:bg-surface-subtle"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-mono text-secondary">Operational Status:</span>
                <MetricPill status={selectedNode.status} size="sm" />
              </div>

              {/* Telemetry rows */}
              <div className="space-y-2 font-mono text-xs">
                {selectedNode.telemetry.map((t) => (
                  <div key={t.label} className="p-2 bg-surface-subtle border border-border/80 rounded flex items-center justify-between">
                    <span className="text-secondary text-[11px]">{t.label}:</span>
                    <span className="font-bold text-primary text-[11px]">{t.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Action Trigger inside drawer */}
            {selectedNode.actionId && (
              <div className="pt-3 border-t border-border mt-3">
                <button
                  onClick={() => {
                    if (selectedNode.actionId) {
                      toggleAction(selectedNode.actionId);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-orbit hover:bg-orbit-hover text-white text-xs font-mono font-medium rounded transition-all shadow-sm"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{selectedNode.actionPrompt || 'Execute Direct Action'}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Summary Bar */}
      <div className="px-5 py-2.5 bg-surface border-t border-border flex flex-wrap items-center justify-between text-xs font-mono text-secondary">
        <div className="flex items-center gap-4">
          <span>ZONE A (VENUE): <strong className="text-primary font-bold">{zoneAStatus}</strong></span>
          <span>ZONE C (TRANSIT): <strong className="text-primary font-bold">{zoneCStatus}</strong></span>
          <span>GATE C STATUS: <strong className="text-safe font-bold">{divertActive ? 'RECOMMENDED' : 'STANDBY'}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          {simulationState === 'surge' && !divertActive && (
            <span className="text-critical flex items-center gap-1 font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" />
              Bottleneck detected at Gate A arterial
            </span>
          )}
          {divertActive && (
            <span className="text-safe flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Ingress diversion active: Gate A load relieved
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
