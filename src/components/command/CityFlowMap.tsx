import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Navigation,
  Zap,
  Radio,
  Smartphone,
  X,
  AlertTriangle,
  Flame,
  ShieldCheck,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

interface GeoEntityDetails {
  id: string;
  name: string;
  category: 'gate' | 'corridor' | 'hub' | 'venue';
  status: 'NORMAL' | 'MODERATE' | 'CRITICAL';
  statusLabel: string;
  coordinates: string;
  telemetry: { label: string; value: string; isAlert?: boolean }[];
  diagnosis: string;
  actionId?: string;
  actionLabel?: string;
  secondaryAction?: {
    type: 'vms' | 'mobile';
    label: string;
  };
}

export const CityFlowMap: React.FC = () => {
  const {
    currentEvent,
    simulationState,
    actions,
    toggleAction,
    metrics,
    selectedMapNode,
    setSelectedMapNode,
    setFocusedIncidentCardId,
    showCopilotDrawer,
    setShowCopilotDrawer,
    showSlidersDrawer,
    showEventModal,
    showActuationModal,
    setShowActuationModal,
    showSitrepModal,
    showEngineModal,
    showMobilePassModal,
    setShowMobilePassModal,
    showBeforeAfterModal,
    addToast,
  } = useApp();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const [selectedEntity, setSelectedEntity] = useState<GeoEntityDetails | null>(null);
  const [mapTheme, setMapTheme] = useState<'voyager' | 'dark' | 'osm'>('dark');

  // Automatically dismiss map entity drawer whenever an app drawer or modal is opened
  useEffect(() => {
    if (
      showCopilotDrawer ||
      showSlidersDrawer ||
      showEventModal ||
      showActuationModal ||
      showSitrepModal ||
      showEngineModal ||
      showMobilePassModal ||
      showBeforeAfterModal
    ) {
      setSelectedEntity(null);
    }
  }, [
    showCopilotDrawer,
    showSlidersDrawer,
    showEventModal,
    showActuationModal,
    showSitrepModal,
    showEngineModal,
    showMobilePassModal,
    showBeforeAfterModal,
  ]);

  const divertActive = Boolean(
    simulationState === 'optimized' || actions.find((a) => a.id === 'divert-arrivals')?.applied
  );
  const shuttleActive = Boolean(
    simulationState === 'optimized' || actions.find((a) => a.id === 'activate-shuttle')?.applied
  );

  // Dynamic status evaluation
  const gateAStatus: 'NORMAL' | 'MODERATE' | 'CRITICAL' =
    divertActive
      ? 'MODERATE'
      : simulationState === 'surge'
      ? 'CRITICAL'
      : 'NORMAL';

  const gateBStatus: 'NORMAL' | 'MODERATE' | 'CRITICAL' =
    simulationState === 'surge' ? 'MODERATE' : 'NORMAL';

  const gateCStatus: 'NORMAL' | 'MODERATE' | 'CRITICAL' =
    divertActive ? 'NORMAL' : simulationState === 'surge' ? 'NORMAL' : 'NORMAL';

  const highwayStatus: 'NORMAL' | 'MODERATE' | 'CRITICAL' =
    divertActive
      ? 'MODERATE'
      : simulationState === 'surge'
      ? 'CRITICAL'
      : 'NORMAL';

  const shuttleStatus: 'NORMAL' | 'MODERATE' | 'CRITICAL' = shuttleActive ? 'NORMAL' : 'NORMAL';

  const getStatusColor = (status: 'NORMAL' | 'MODERATE' | 'CRITICAL') => {
    switch (status) {
      case 'CRITICAL':
        return '#EF4444'; // Red
      case 'MODERATE':
        return '#F59E0B'; // Amber
      case 'NORMAL':
        return '#10B981'; // Green
    }
  };

  // Geographic coordinates generator based on event venue
  const getVenueGeoData = () => {
    const isWankhede = currentEvent.id === 'wankhede-derby' || currentEvent.title.toLowerCase().includes('wankhede');
    const isDelhi = currentEvent.city.toLowerCase().includes('delhi');

    if (isWankhede) {
      // Wankhede Stadium, Churchgate, Mumbai
      const center: [number, number] = [18.9389, 72.8258];
      return {
        center,
        zoom: 16,
        boundary: [
          [18.9405, 72.8242],
          [18.9408, 72.8272],
          [18.9372, 72.8275],
          [18.9370, 72.8245],
        ] as [number, number][],
        gates: [
          {
            id: 'gate-a',
            name: currentEvent.primaryGate,
            pos: [18.9378, 72.8245] as [number, number],
            status: gateAStatus,
            waitMin: divertActive ? 9 : simulationState === 'surge' ? 28 : 3,
            loadPercent: divertActive ? 52 : simulationState === 'surge' ? 92 : 44,
          },
          {
            id: 'gate-b',
            name: 'Gate B (East Stand Entry)',
            pos: [18.9372, 72.8265] as [number, number],
            status: gateBStatus,
            waitMin: simulationState === 'surge' ? 14 : 2,
            loadPercent: simulationState === 'surge' ? 72 : 38,
          },
          {
            id: 'gate-c',
            name: currentEvent.alternateGate,
            pos: [18.9404, 72.8268] as [number, number],
            status: gateCStatus,
            waitMin: 2,
            loadPercent: divertActive ? 58 : 24,
            isFastTrack: true,
          },
        ],
        hubs: [
          {
            id: 'metro',
            name: 'Churchgate Railway & Metro Terminal',
            type: 'metro' as const,
            pos: [18.9352, 72.8275] as [number, number],
          },
          {
            id: 'bus',
            name: 'Marine Drive Express Bus Concourse',
            type: 'bus' as const,
            pos: [18.9418, 72.8235] as [number, number],
          },
        ],
        corridors: [
          {
            id: 'corridor-highway',
            name: currentEvent.highwayCorridor,
            type: 'highway' as const,
            status: highwayStatus,
            path: [
              [18.9310, 72.8230],
              [18.9340, 72.8238],
              [18.9365, 72.8242],
              [18.9378, 72.8245],
            ] as [number, number][],
          },
          {
            id: 'corridor-shuttle',
            name: currentEvent.shuttleRoute,
            type: 'shuttle' as const,
            status: shuttleStatus,
            path: [
              [18.9352, 72.8275],
              [18.9380, 72.8290],
              [18.9408, 72.8285],
              [18.9404, 72.8268],
            ] as [number, number][],
          },
        ],
      };
    }

    if (isDelhi) {
      // Bharat Mandapam, Pragati Maidan, New Delhi
      const center: [number, number] = [28.6186, 77.2415];
      return {
        center,
        zoom: 15,
        boundary: [
          [28.6230, 77.2370],
          [28.6235, 77.2450],
          [28.6140, 77.2460],
          [28.6135, 77.2380],
        ] as [number, number][],
        gates: [
          {
            id: 'gate-a',
            name: currentEvent.primaryGate,
            pos: [28.6160, 77.2380] as [number, number],
            status: gateAStatus,
            waitMin: divertActive ? 10 : simulationState === 'surge' ? 26 : 4,
            loadPercent: divertActive ? 54 : simulationState === 'surge' ? 90 : 42,
          },
          {
            id: 'gate-b',
            name: 'Gate 7 (Bhairon Marg Concourse)',
            pos: [28.6138, 77.2420] as [number, number],
            status: gateBStatus,
            waitMin: simulationState === 'surge' ? 12 : 3,
            loadPercent: simulationState === 'surge' ? 68 : 36,
          },
          {
            id: 'gate-c',
            name: currentEvent.alternateGate,
            pos: [28.6215, 77.2445] as [number, number],
            status: gateCStatus,
            waitMin: 2,
            loadPercent: divertActive ? 62 : 28,
            isFastTrack: true,
          },
        ],
        hubs: [
          {
            id: 'metro',
            name: 'Supreme Court / Pragati Maidan Metro',
            type: 'metro' as const,
            pos: [28.6245, 77.2405] as [number, number],
          },
          {
            id: 'bus',
            name: 'Ring Road Transit Terminal',
            type: 'bus' as const,
            pos: [28.6130, 77.2470] as [number, number],
          },
        ],
        corridors: [
          {
            id: 'corridor-highway',
            name: currentEvent.highwayCorridor,
            type: 'highway' as const,
            status: highwayStatus,
            path: [
              [28.6080, 77.2340],
              [28.6120, 77.2360],
              [28.6160, 77.2380],
            ] as [number, number][],
          },
          {
            id: 'corridor-shuttle',
            name: currentEvent.shuttleRoute,
            type: 'shuttle' as const,
            status: shuttleStatus,
            path: [
              [28.6245, 77.2405],
              [28.6250, 77.2440],
              [28.6215, 77.2445],
            ] as [number, number][],
          },
        ],
      };
    }

    // Default: Mumbai BKC Arena (Jio World Garden / MMRDA Grounds)
    const center: [number, number] = [19.0660, 72.8685];
    return {
      center,
      zoom: 16,
      boundary: [
        [19.0682, 72.8655],
        [19.0685, 72.8715],
        [19.0638, 72.8718],
        [19.0636, 72.8658],
      ] as [number, number][],
      gates: [
        {
          id: 'gate-a',
          name: currentEvent.primaryGate,
          pos: [19.0662, 72.8656] as [number, number],
          status: gateAStatus,
          waitMin: divertActive ? 8 : simulationState === 'surge' ? 28 : 3,
          loadPercent: divertActive ? 50 : simulationState === 'surge' ? 92 : 46,
        },
        {
          id: 'gate-b',
          name: 'Gate B (South Concourse)',
          pos: [19.0637, 72.8688] as [number, number],
          status: gateBStatus,
          waitMin: simulationState === 'surge' ? 14 : 2,
          loadPercent: simulationState === 'surge' ? 74 : 35,
        },
        {
          id: 'gate-c',
          name: currentEvent.alternateGate,
          pos: [19.0683, 72.8698] as [number, number],
          status: gateCStatus,
          waitMin: 2,
          loadPercent: divertActive ? 60 : 26,
          isFastTrack: true,
        },
      ],
      hubs: [
        {
          id: 'metro',
          name: 'BKC Metro Terminal (Line 3)',
          type: 'metro' as const,
          pos: [19.0630, 72.8590] as [number, number],
        },
        {
          id: 'bus',
          name: 'Central MMRDA Bus Bay',
          type: 'bus' as const,
          pos: [19.0618, 72.8660] as [number, number],
        },
      ],
      corridors: [
        {
          id: 'corridor-highway',
          name: currentEvent.highwayCorridor,
          type: 'highway' as const,
          status: highwayStatus,
          path: [
            [19.0580, 72.8520],
            [19.0615, 72.8580],
            [19.0645, 72.8625],
            [19.0662, 72.8656],
          ] as [number, number][],
        },
        {
          id: 'corridor-shuttle',
          name: currentEvent.shuttleRoute,
          type: 'shuttle' as const,
          status: shuttleStatus,
          path: [
            [19.0630, 72.8590],
            [19.0665, 72.8605],
            [19.0686, 72.8645],
            [19.0683, 72.8698],
          ] as [number, number][],
        },
      ],
    };
  };

  const geoData = getVenueGeoData();

  // Helper to open overlay details for an entity & sync with copilot
  const handleSelectGate = (gate: typeof geoData.gates[0], autoFly: boolean = true) => {
    setSelectedMapNode(gate.id);
    if (gate.id === 'gate-a') {
      setFocusedIncidentCardId('card-bottleneck');
    } else if (gate.id === 'gate-c') {
      setFocusedIncidentCardId('card-custom');
    }

    if (autoFly && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(gate.pos, 17, { duration: 0.8 });
    }

    if (!showCopilotDrawer && !showSlidersDrawer) {
      setSelectedEntity({
        id: gate.id,
        name: gate.name,
        category: 'gate',
        status: gate.status,
        statusLabel:
          gate.status === 'CRITICAL'
            ? 'CRITICAL BOTTLENECK'
            : gate.status === 'MODERATE'
            ? 'APPROACHING SATURATION'
            : 'NORMAL QUEUE FLOW',
        coordinates: `${gate.pos[0].toFixed(4)}° N, ${gate.pos[1].toFixed(4)}° E`,
        telemetry: [
          { label: 'Wait Time', value: `${gate.waitMin} min queue`, isAlert: gate.waitMin > 15 },
          { label: 'Turnstile Saturation', value: `${gate.loadPercent}%`, isAlert: gate.loadPercent > 80 },
          { label: 'Scanning Lanes', value: `${currentEvent.gatesCount || 14} Active` },
          { label: 'Hourly Ingress', value: `${Math.round((gate.loadPercent / 100) * 8500)} pax/hr` },
        ],
        diagnosis:
          gate.status === 'CRITICAL'
            ? `Severe pedestrian clustering at ${gate.name} turnstiles due to concentrated arrivals from ${currentEvent.highwayCorridor}. Queue depth threatens perimeter barrier capacity.`
            : gate.status === 'MODERATE'
            ? `Turnstiles at ${gate.name} operating within steady throughput, but arrival curve indicates moderate surge within 15 minutes.`
            : `Fast-track scanning active at ${gate.name}. Flow rates operating under zero-friction parameters with dedicated shuttle staging.`,
        actionId: gate.id === 'gate-a' ? 'divert-arrivals' : undefined,
        actionLabel: gate.id === 'gate-a' ? `Approve Diversion to ${currentEvent.alternateGate}` : undefined,
        secondaryAction: {
          type: 'mobile',
          label: 'Dispatch Mobile Pass Reroute',
        },
      });
    }
  };

  const handleSelectCorridor = (corridor: typeof geoData.corridors[0], autoFly: boolean = true) => {
    setSelectedMapNode(corridor.id);
    if (corridor.type === 'highway') {
      setFocusedIncidentCardId('card-weather');
    } else {
      setFocusedIncidentCardId('card-headway');
    }

    if (autoFly && mapInstanceRef.current && corridor.path.length > 0) {
      const midPoint = corridor.path[Math.floor(corridor.path.length / 2)];
      mapInstanceRef.current.flyTo(midPoint, 16, { duration: 0.8 });
    }

    if (!showCopilotDrawer && !showSlidersDrawer) {
      setSelectedEntity({
        id: corridor.id,
        name: corridor.name,
        category: 'corridor',
        status: corridor.status,
        statusLabel:
          corridor.status === 'CRITICAL'
            ? 'ARTERIAL CONGESTION'
            : corridor.status === 'MODERATE'
            ? 'HEAVY TRANSIT LOAD'
            : 'OPTIMAL CLEARANCE',
        coordinates: `${corridor.path[0][0].toFixed(4)}° N, ${corridor.path[0][1].toFixed(4)}° E`,
        telemetry: [
          { label: 'Corridor Friction', value: `${metrics.transportLoad}% Load`, isAlert: metrics.transportLoad > 75 },
          { label: 'Average Speed', value: corridor.status === 'CRITICAL' ? '12 km/h' : '48 km/h', isAlert: corridor.status === 'CRITICAL' },
          { label: 'Transit Mode', value: corridor.type === 'highway' ? 'Vehicular Arterial' : 'Electric Bus Shuttle' },
          { label: 'Active Fleet', value: corridor.type === 'shuttle' ? '18 Coaches' : 'Municipal Flyover' },
        ],
        diagnosis:
          corridor.status === 'CRITICAL'
            ? `Inbound vehicular volume exceeds artery capacity. Recommended action: deploy roadside VMS LED gantries to detour motorists toward elevated metro links.`
            : `Corridor operating with planned throughput. Dedicated public transport priority lane maintained.`,
        actionId: corridor.type === 'shuttle' ? 'activate-shuttle' : 'divert-arrivals',
        actionLabel: corridor.type === 'shuttle' ? 'Deploy 18 Staged Shuttles' : 'Execute Corridor Divert',
        secondaryAction: {
          type: 'vms',
          label: 'Update Highway VMS Signs',
        },
      });
    }
  };

  const handleSelectVenue = (autoFly: boolean = true) => {
    setSelectedMapNode('arena');
    setFocusedIncidentCardId('card-brief-01');

    if (autoFly && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(geoData.center, 16, { duration: 0.8 });
    }

    if (!showCopilotDrawer && !showSlidersDrawer) {
      setSelectedEntity({
        id: 'venue-boundary',
        name: currentEvent.venueName,
        category: 'venue',
        status: simulationState === 'surge' ? 'MODERATE' : 'NORMAL',
        statusLabel: `${currentEvent.title.toUpperCase()} BOUNDARY`,
        coordinates: `${geoData.center[0].toFixed(4)}° N, ${geoData.center[1].toFixed(4)}° E`,
        telemetry: [
          { label: 'Licensed Capacity', value: `${currentEvent.capacity.toLocaleString()} pax` },
          { label: 'Expected Crowd', value: `${currentEvent.expectedAttendance.toLocaleString()} pax` },
          { label: 'District Pressure', value: `${simulationState === 'surge' ? '88/100' : '48/100'}`, isAlert: simulationState === 'surge' },
          { label: 'Perimeter Security', value: 'Level 3 Active' },
        ],
        diagnosis: `Perimeter boundaries for ${currentEvent.venueName} are actively monitored by municipal police and ORBIT automated crowd analytics sensors.`,
        actionId: 'apply-all',
        actionLabel: 'Apply Coordinated District Rebalance',
      });
    }
  };

  // React to external selection (e.g. from Auto-Pilot Demo, TopBar, or Copilot Drawer)
  useEffect(() => {
    if (!selectedMapNode) {
      setSelectedEntity(null);
      return;
    }
    if (selectedMapNode === 'gate-a') {
      const g = geoData.gates.find((x) => x.id === 'gate-a');
      if (g) handleSelectGate(g, true);
    } else if (selectedMapNode === 'gate-c') {
      const g = geoData.gates.find((x) => x.id === 'gate-c');
      if (g) handleSelectGate(g, true);
    } else if (selectedMapNode === 'corridor-highway') {
      const c = geoData.corridors.find((x) => x.type === 'highway');
      if (c) handleSelectCorridor(c, true);
    } else if (selectedMapNode === 'corridor-shuttle') {
      const c = geoData.corridors.find((x) => x.type === 'shuttle');
      if (c) handleSelectCorridor(c, true);
    } else if (selectedMapNode === 'arena' || selectedMapNode === 'venue-boundary') {
      handleSelectVenue(true);
    }
  }, [selectedMapNode]);

  // Initialize and update Leaflet Map instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: geoData.center,
        zoom: geoData.zoom,
        zoomControl: false,
        attributionControl: false,
      });

      L.control.zoom({ position: 'bottomleft' }).addTo(map);
      mapInstanceRef.current = map;
      layerGroupRef.current = L.layerGroup().addTo(map);
    }

    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;

    // Pan smoothly if venue changed
    map.flyTo(geoData.center, geoData.zoom, { duration: 1.2 });

    // Clear existing geo layers
    layerGroup?.clearLayers();

    // Clean OpenStreetMap tiles without watermark / API key requirement
    let tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    if (mapTheme === 'voyager') {
      tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    } else if (mapTheme === 'osm') {
      tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    }

    // Set base map tiles
    const tiles = L.tileLayer(tileUrl, {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    });
    tiles.addTo(layerGroup!);

    // 1. Draw Real-World Venue Boundary Polygon
    const isVenueSelected = selectedMapNode === 'arena' || selectedMapNode === 'venue-boundary';
    const venuePolygon = L.polygon(geoData.boundary, {
      color: isVenueSelected ? '#10B981' : '#315CFF',
      weight: isVenueSelected ? 4.5 : 2.5,
      opacity: isVenueSelected ? 1 : 0.85,
      fillColor: isVenueSelected ? '#10B981' : '#315CFF',
      fillOpacity: isVenueSelected ? 0.28 : 0.15,
      dashArray: isVenueSelected ? undefined : '4, 6',
    });

    venuePolygon.on('click', () => handleSelectVenue(true));
    venuePolygon.bindTooltip(
      `<strong>${currentEvent.venueName}</strong><br/>Capacity: ${currentEvent.capacity.toLocaleString()} PAX`,
      { className: 'leaflet-tooltip-orbit', permanent: false }
    );
    venuePolygon.addTo(layerGroup!);

    // 2. Draw Arterial Corridors (Highway and Shuttle)
    geoData.corridors.forEach((c) => {
      const isHighway = c.type === 'highway';
      const isCorridorSelected = selectedMapNode === c.id;
      const baseColor = isHighway
        ? getStatusColor(c.status)
        : shuttleActive
        ? '#10B981'
        : '#3B82F6';

      const polyline = L.polyline(c.path, {
        color: isCorridorSelected ? (c.status === 'CRITICAL' ? '#EF4444' : c.status === 'MODERATE' ? '#F59E0B' : '#10B981') : baseColor,
        weight: isCorridorSelected ? (isHighway ? 9 : 7) : (isHighway ? 6 : 4),
        opacity: isCorridorSelected ? 1 : 0.85,
        dashArray: isHighway && !isCorridorSelected ? undefined : isHighway ? undefined : '6, 8',
        lineCap: 'round',
        lineJoin: 'round',
      });

      polyline.on('click', () => handleSelectCorridor(c, true));
      polyline.bindTooltip(
        `<strong>${c.name}</strong><br/>Status: ${c.status} (${isHighway ? 'Arterial Corridor' : 'Dedicated Shuttle'})${isCorridorSelected ? '<br/><span style="color:#F59E0B;font-weight:bold;">★ FOCUSED ENTITY</span>' : ''}`,
        { className: 'leaflet-tooltip-orbit' }
      );
      polyline.addTo(layerGroup!);
    });

    // 3. Draw Entry Gate Markers with Dynamic Live Status Colors & Focused Pulse Rings
    geoData.gates.forEach((gate) => {
      const color = getStatusColor(gate.status);
      const isCrit = gate.status === 'CRITICAL';
      const isMod = gate.status === 'MODERATE';
      const isGateSelected = selectedMapNode === gate.id;

      // Custom HTML Marker with severity-based pulse and active focus halo
      const iconHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          ${
            isGateSelected
              ? `<span class="animate-ping absolute inline-flex h-10 w-10 rounded-full ${
                  isCrit ? 'bg-rose-500' : isMod ? 'bg-amber-500' : 'bg-emerald-500'
                } opacity-75"></span>`
              : isCrit
              ? `<span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-rose-500 opacity-60"></span>`
              : ''
          }
          <div style="background-color: ${color}; box-shadow: 0 0 ${isGateSelected ? '18px' : '10px'} ${color};" class="relative flex items-center justify-center ${
            isGateSelected ? 'w-8 h-8 scale-110' : 'w-7 h-7'
          } rounded-full text-white font-mono font-bold text-[10px] border-2 ${
            isGateSelected ? 'border-amber-300 ring-2 ring-white ring-offset-1' : 'border-white'
          } transition-transform duration-300">
            ${gate.id === 'gate-a' ? 'A' : gate.id === 'gate-c' ? 'C' : 'B'}
          </div>
          <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap ${
            isGateSelected ? 'bg-amber-500 text-neutral-950 font-extrabold ring-1 ring-white' : 'bg-neutral-900/90 text-white'
          } font-mono text-[9px] px-1.5 py-0.5 rounded shadow-sm pointer-events-none transition-colors">
            ${gate.waitMin}m
          </div>
        </div>
      `;

      const gateIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-gate-icon',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker(gate.pos, { icon: gateIcon });
      marker.on('click', () => handleSelectGate(gate, true));
      marker.bindTooltip(
        `<strong>${gate.name}</strong><br/>Queue: ${gate.waitMin} min | Saturation: ${gate.loadPercent}%${isGateSelected ? '<br/><span style="color:#F59E0B;font-weight:bold;">★ FOCUSED ENTITY</span>' : ''}`,
        { className: 'leaflet-tooltip-orbit' }
      );
      marker.addTo(layerGroup!);
    });

    // 4. Draw Transit Hubs (Metro & Bus Stations)
    geoData.hubs.forEach((hub) => {
      const isMetro = hub.type === 'metro';
      const hubHtml = `
        <div class="relative flex items-center justify-center cursor-pointer">
          <div class="flex items-center justify-center w-6 h-6 rounded-lg bg-neutral-900 border border-neutral-600 text-white shadow-md">
            ${isMetro ? '🚇' : '🚌'}
          </div>
        </div>
      `;

      const hubIcon = L.divIcon({
        html: hubHtml,
        className: 'custom-hub-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker(hub.pos, { icon: hubIcon });
      marker.bindTooltip(`<strong>${hub.name}</strong><br/>${isMetro ? 'Rapid Transit Hub' : 'Regional Bus Bay'}`, {
        className: 'leaflet-tooltip-orbit',
      });
      marker.addTo(layerGroup!);
    });
  }, [currentEvent, simulationState, divertActive, shuttleActive, mapTheme, selectedMapNode]);

  return (
    <div className="bg-surface border border-border rounded-xl shadow-xs overflow-hidden relative">
      {/* Header Bar */}
      <div className="px-5 py-3.5 border-b border-border bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orbit/10 text-orbit flex items-center justify-center">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold font-mono text-primary tracking-tight uppercase">
                GEOSPATIAL PERIMETER & TRANSIT RADAR
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                LIVE GPS FEED
              </span>
            </div>
            <p className="text-xs text-secondary font-mono">
              Real-world venue polygon, turnstile gates & arterial routes for {currentEvent.venueName}
            </p>
          </div>
        </div>

        {/* Quick Focus Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap text-[11px] font-mono">
          <span className="text-secondary font-bold text-[10px] uppercase mr-1">QUICK FOCUS:</span>
          <button
            onClick={() => {
              const g = geoData.gates.find((x) => x.id === 'gate-a');
              if (g) handleSelectGate(g, true);
            }}
            className={`px-2 py-0.5 rounded border transition-colors ${
              selectedMapNode === 'gate-a'
                ? 'bg-rose-500 text-white border-rose-600 font-bold'
                : 'bg-white hover:bg-neutral-100 text-secondary border-border'
            }`}
          >
            Gate A (West)
          </button>
          <button
            onClick={() => {
              const g = geoData.gates.find((x) => x.id === 'gate-c');
              if (g) handleSelectGate(g, true);
            }}
            className={`px-2 py-0.5 rounded border transition-colors ${
              selectedMapNode === 'gate-c'
                ? 'bg-emerald-600 text-white border-emerald-700 font-bold'
                : 'bg-white hover:bg-neutral-100 text-secondary border-border'
            }`}
          >
            Gate C (Shuttle)
          </button>
          <button
            onClick={() => {
              const c = geoData.corridors.find((x) => x.type === 'highway');
              if (c) handleSelectCorridor(c, true);
            }}
            className={`px-2 py-0.5 rounded border transition-colors ${
              selectedMapNode === 'corridor-highway'
                ? 'bg-amber-500 text-white border-amber-600 font-bold'
                : 'bg-white hover:bg-neutral-100 text-secondary border-border'
            }`}
          >
            Highway Corridor
          </button>
          <button
            onClick={() => handleSelectVenue(true)}
            className={`px-2 py-0.5 rounded border transition-colors ${
              selectedMapNode === 'arena' || selectedMapNode === 'venue-boundary'
                ? 'bg-orbit text-white border-orbit font-bold'
                : 'bg-white hover:bg-neutral-100 text-secondary border-border'
            }`}
          >
            Venue Boundary
          </button>
        </div>

        {/* Map Legend & Tile Layer Switcher */}
        <div className="flex items-center gap-3">
          {/* Legend Pills */}
          <div className="hidden md:flex items-center gap-2 text-[10px] font-mono">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Normal (&lt;5m)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Capacity (&gt;12m)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>Bottleneck (&gt;25m)</span>
            </span>
          </div>

          {/* Theme Selector */}
          <div className="flex items-center bg-surface-subtle p-0.5 rounded-lg border border-border text-[10px] font-mono">
            <button
              onClick={() => setMapTheme('dark')}
              className={`px-2 py-1 rounded ${
                mapTheme === 'dark' ? 'bg-white font-bold text-primary shadow-xs' : 'text-secondary'
              }`}
            >
              Dark
            </button>
            <button
              onClick={() => setMapTheme('voyager')}
              className={`px-2 py-1 rounded ${
                mapTheme === 'voyager' ? 'bg-white font-bold text-primary shadow-xs' : 'text-secondary'
              }`}
            >
              Street
            </button>
            <button
              onClick={() => setMapTheme('osm')}
              className={`px-2 py-1 rounded ${
                mapTheme === 'osm' ? 'bg-white font-bold text-primary shadow-xs' : 'text-secondary'
              }`}
            >
              OSM
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="relative w-full h-[460px] bg-neutral-950 overflow-hidden">
        <div ref={mapContainerRef} className={`w-full h-full ${mapTheme === 'dark' ? 'map-theme-dark' : ''}`} />

        {/* Floating Quick Stats Overlay on Map */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
          <div className="bg-neutral-900/90 backdrop-blur-md border border-neutral-700/80 rounded-lg p-3 text-white shadow-xl pointer-events-auto max-w-xs space-y-1.5 font-mono">
            <div className="flex items-center justify-between text-[10px] text-neutral-400">
              <span>ACTIVE VENUE GPS</span>
              <span className="text-emerald-400 font-bold">MONITORED</span>
            </div>
            <div className="text-xs font-bold text-neutral-100 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-orbit" />
              <span className="truncate">{currentEvent.venueName}</span>
            </div>
            <div className="text-[10px] text-neutral-400 flex items-center justify-between pt-1 border-t border-neutral-800">
              <span>Corridor: {currentEvent.highwayCorridor}</span>
              <span className="text-neutral-300 font-bold">{metrics.transportLoad}% Load</span>
            </div>
          </div>
        </div>

        {/* Interactive Slide-Out Overlay Drawer */}
        {selectedEntity && (
          <div className="absolute inset-y-0 right-0 z-30 w-full sm:w-96 bg-white/95 backdrop-blur-md border-l border-border shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-border bg-white flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                      selectedEntity.status === 'CRITICAL'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : selectedEntity.status === 'MODERATE'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {selectedEntity.status === 'CRITICAL' && <Flame className="w-3 h-3 text-rose-600 animate-pulse" />}
                    {selectedEntity.status === 'MODERATE' && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                    {selectedEntity.status === 'NORMAL' && <ShieldCheck className="w-3 h-3 text-emerald-600" />}
                    <span>{selectedEntity.statusLabel}</span>
                  </span>
                </div>
                <h4 className="text-sm font-bold font-mono text-primary uppercase">
                  {selectedEntity.name}
                </h4>
                <div className="text-[10px] font-mono text-secondary">
                  Geo: {selectedEntity.coordinates}
                </div>
              </div>

              <button
                onClick={() => setSelectedEntity(null)}
                className="p-1 text-secondary hover:text-primary rounded hover:bg-neutral-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              {/* Telemetry Grid */}
              <div className="grid grid-cols-2 gap-2">
                {selectedEntity.telemetry.map((t, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border font-mono ${
                      t.isAlert
                        ? 'bg-rose-50/70 border-rose-200 text-rose-800'
                        : 'bg-surface border-border text-primary'
                    }`}
                  >
                    <span className="text-[10px] text-secondary uppercase font-semibold block truncate">
                      {t.label}
                    </span>
                    <span
                      className={`text-sm font-bold block mt-0.5 truncate ${
                        t.isAlert ? 'text-rose-700 font-extrabold' : 'text-primary'
                      }`}
                    >
                      {t.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Diagnosis Note */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-secondary tracking-wider block">
                  GEOSPATIAL SITUATIONAL DIAGNOSIS
                </span>
                <p className="text-xs text-primary leading-relaxed bg-surface-subtle p-2.5 rounded-lg border border-border">
                  {selectedEntity.diagnosis}
                </p>
              </div>

              {/* Real-World Sensor Mesh Note */}
              <div className="p-2.5 rounded-lg bg-orbit-subtle/30 border border-orbit/20 text-xs font-mono text-primary space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-orbit text-[11px] uppercase">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>SENSE-PREDICT AUTOMATION ACTIVE</span>
                </div>
                <p className="text-[11px] text-secondary">
                  Telemetry streaming at 30-second intervals from municipal police sensors, Bluetooth perimeter beacons & metro turnstiles.
                </p>
              </div>
            </div>

            {/* Drawer Action Footer */}
            <div className="p-4 border-t border-border bg-surface-subtle space-y-2">
              {selectedEntity.actionId && (
                <button
                  onClick={() => {
                    if (selectedEntity.actionId === 'apply-all') {
                      addToast('Coordinated district rebalance protocol executed.', 'success');
                    } else if (selectedEntity.actionId) {
                      toggleAction(selectedEntity.actionId);
                      addToast(`Targeted countermeasure dispatched: ${selectedEntity.actionLabel}`, 'success');
                    }
                    setSelectedEntity(null);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-neutral-800 text-white rounded-lg text-xs font-mono font-bold transition-all shadow-md active:scale-98"
                >
                  <Zap className="w-3.5 h-3.5 fill-current text-amber-400" />
                  <span>{selectedEntity.actionLabel || 'Dispatch Mitigation'}</span>
                </button>
              )}

              {/* View in Incident Copilot CTA */}
              <button
                onClick={() => {
                  setSelectedEntity(null);
                  setShowCopilotDrawer(true);
                  if (selectedEntity.id === 'gate-a') {
                    setFocusedIncidentCardId('card-bottleneck');
                  } else if (selectedEntity.id === 'gate-c') {
                    setFocusedIncidentCardId('card-custom');
                  } else if (selectedEntity.category === 'corridor') {
                    setFocusedIncidentCardId(selectedEntity.id === 'corridor-highway' ? 'card-weather' : 'card-headway');
                  } else {
                    setFocusedIncidentCardId('card-brief-01');
                  }
                  addToast(`Opening AI Copilot for ${selectedEntity.name}...`, 'info');
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 rounded-lg text-xs font-mono font-bold transition-all shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Open Incident Card in Copilot →</span>
              </button>

              {selectedEntity.secondaryAction && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const actionType = selectedEntity.secondaryAction?.type;
                      setSelectedEntity(null);
                      if (actionType === 'vms') {
                        setShowActuationModal(true);
                      } else {
                        setShowMobilePassModal(true);
                      }
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-border hover:bg-surface rounded-lg text-xs font-mono text-secondary hover:text-primary transition-colors"
                  >
                    {selectedEntity.secondaryAction.type === 'vms' ? (
                      <Radio className="w-3.5 h-3.5 text-safe" />
                    ) : (
                      <Smartphone className="w-3.5 h-3.5 text-orbit" />
                    )}
                    <span>{selectedEntity.secondaryAction.label}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info Strip */}
      <div className="px-5 py-2.5 bg-surface-subtle border-t border-border flex items-center justify-between text-xs font-mono text-secondary">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-safe animate-pulse" />
          <span>Click any entry gate pin, arterial corridor polyline, or stadium boundary to inspect live telemetry</span>
        </span>
        <span className="hidden sm:inline-block">
          Projection: WGS 84 (EPSG:4326) • Leaflet Engine
        </span>
      </div>
    </div>
  );
};
