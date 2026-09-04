import React, { useState } from 'react';
import { MetricPill } from '../components/common/MetricPill';
import {
  Compass,
  MapPin,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Train,
  Car,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const VisitorGuidance: React.FC = () => {
  const { addToast, currentEvent } = useApp();

  const getCityOrigins = (city: string) => {
    if (city.toLowerCase().includes('mumbai')) {
      return [
        'Andheri Metro (Line 1)',
        'Bandra Terminus (Western Railway)',
        'Chhatrapati Shivaji Airport (BOM)',
        'Dadar Junction (Central / Western)',
      ];
    }
    if (city.toLowerCase().includes('delhi')) {
      return [
        'New Delhi Railway Station (NDLS)',
        'Indira Gandhi Airport (DEL T3)',
        'Rajiv Chowk Metro (Blue/Yellow Line)',
        'Kashmere Gate ISBT Transit Hub',
      ];
    }
    return [
      `Central Railway Terminal (${city})`,
      `International Airport (${city})`,
      `Metro Line 1 Express Station`,
      `Interstate Bus Terminal (${city})`,
    ];
  };

  const origins = getCityOrigins(currentEvent.city);
  const [fromLocation, setFromLocation] = useState(origins[0]);
  const toLocation = `${currentEvent.venueName} (${currentEvent.city})`;
  const [hasSearched, setHasSearched] = useState(true);
  const [showPhoneSent, setShowPhoneSent] = useState(false);

  // Sync fromLocation if current city changes
  React.useEffect(() => {
    setFromLocation(origins[0]);
  }, [currentEvent.city]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    addToast(`Route recalculated from ${fromLocation}`, 'info');
  };

  const handleSendToPhone = () => {
    setShowPhoneSent(true);
    addToast('Turn-by-turn route sent via SMS to mobile (+91 98*** 42100)', 'success');
    setTimeout(() => setShowPhoneSent(false), 4000);
  };

  // Dynamic travel times based on origin
  const getTravelTimes = () => {
    if (fromLocation.includes('Bandra') || fromLocation.includes('Rajiv')) {
      return { metro: 24, road: 38, metroArrival: '7:06 PM', roadArrival: '7:20 PM' };
    }
    if (fromLocation.includes('Airport')) {
      return { metro: 28, road: 52, metroArrival: '7:10 PM', roadArrival: '7:34 PM' };
    }
    if (fromLocation.includes('Dadar') || fromLocation.includes('Kashmere')) {
      return { metro: 35, road: 49, metroArrival: '7:17 PM', roadArrival: '7:31 PM' };
    }
    // Default
    return { metro: 32, road: 45, metroArrival: '7:14 PM', roadArrival: '7:27 PM' };
  };

  const times = getTravelTimes();

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono tracking-wider uppercase text-secondary block">
            Visitor Transit Portal
          </span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary font-mono">
            FIND YOUR BEST ROUTE
          </h1>
          <p className="text-sm text-secondary mt-1">
            Predictive arrival navigation optimized for minimal queue times and crowd avoidance
          </p>
        </div>

        <button
          onClick={handleSendToPhone}
          className="flex items-center gap-1.5 px-3.5 py-2 border border-border rounded text-xs font-mono text-secondary hover:text-primary hover:bg-surface-subtle transition-colors self-start sm:self-auto"
        >
          <Smartphone className="w-3.5 h-3.5 text-orbit" />
          <span>SEND ROUTE TO PHONE</span>
        </button>
      </div>

      {/* Origin / Destination Search Form */}
      <div className="bg-surface border border-border rounded-md p-5">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-mono uppercase text-secondary block mb-1.5 font-medium">
                FROM ORIGIN
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary">
                  <MapPin className="w-4 h-4" />
                </div>
                <select
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-border rounded text-xs sm:text-sm text-primary font-mono focus:outline-none focus:border-orbit focus:ring-1 focus:ring-orbit/30"
                >
                  {origins.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-secondary block mb-1.5 font-medium">
                TO DESTINATION
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary">
                  <Compass className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={toLocation}
                  readOnly
                  className="w-full pl-9 pr-3 py-2 bg-[#FAF9F6] border border-border rounded text-xs sm:text-sm text-primary font-mono focus:outline-none cursor-default"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] font-mono text-secondary">
              Telemetry updated every 30 seconds from {currentEvent.city} Traffic Police & Transit rail
            </span>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-xs font-mono font-medium rounded hover:bg-neutral-800 transition-all shadow-sm"
            >
              <span>FIND BEST ROUTE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* Phone Confirmation Alert */}
      {showPhoneSent && (
        <div className="p-3 bg-[#EBF6F0] border border-safe/40 rounded flex items-center justify-between text-xs font-mono text-safe-text animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-safe" />
            <span>Navigation pass dispatched to your mobile. {currentEvent.alternateGate} fast-track turnstile barcode included.</span>
          </div>
          <span className="font-bold">✓ DELIVERED</span>
        </div>
      )}

      {/* Search Results */}
      {hasSearched && (
        <div className="space-y-6">
          {/* Top Recommendation vs Alternative Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* RECOMMENDED ROUTE */}
            <div className="bg-surface border-2 border-safe/70 rounded-md p-5 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 bg-safe text-white text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-bl">
                ✓ RECOMMENDED
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-safe-text font-bold block">
                  RECOMMENDED ROUTE
                </span>
                <h3 className="text-xl font-bold text-primary font-mono mt-1 flex items-center gap-2">
                  <Train className="w-5 h-5 text-safe" />
                  <span>METRO + SHUTTLE</span>
                </h3>

                <div className="flex items-center gap-4 my-4 font-mono">
                  <div>
                    <span className="text-3xl font-bold text-primary">{times.metro}</span>
                    <span className="text-xs text-secondary ml-1">min</span>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div>
                    <MetricPill status="NORMAL" label="LOW CROWD" size="sm" />
                    <span className="text-xs text-secondary block mt-0.5">
                      42% transport load
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs border-t border-border pt-3">
                  <div className="flex items-center gap-2 text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-safe shrink-0" />
                    <span>{fromLocation} → Express Transit Terminal</span>
                  </div>
                  <div className="flex items-center gap-2 text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-safe shrink-0" />
                    <span>Dedicated {currentEvent.shuttleRoute} → {currentEvent.alternateGate}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-mono">
                <span className="text-safe font-bold">Fastest & Least Congested</span>
                <span className="text-secondary">Arrives by {times.metroArrival}</span>
              </div>
            </div>

            {/* AVOID / ALTERNATIVE ROUTE */}
            <div className="bg-surface border border-border rounded-md p-5 relative overflow-hidden flex flex-col justify-between opacity-95">
              <div className="absolute top-0 right-0 bg-critical-subtle text-critical-text border-b border-l border-critical/30 text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-bl">
                ⚠ AVOID
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-secondary font-bold block">
                  ALTERNATIVE OPTION
                </span>
                <h3 className="text-xl font-bold text-primary font-mono mt-1 flex items-center gap-2">
                  <Car className="w-5 h-5 text-secondary" />
                  <span>ROAD ROUTE ({currentEvent.highwayCorridor.toUpperCase()})</span>
                </h3>

                <div className="flex items-center gap-4 my-4 font-mono">
                  <div>
                    <span className="text-3xl font-bold text-critical">{times.road}</span>
                    <span className="text-xs text-secondary ml-1">min</span>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div>
                    <MetricPill status="CRITICAL" label="HIGH CROWD" size="sm" />
                    <span className="text-xs text-secondary block mt-0.5">
                      87% transport load
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs border-t border-border pt-3">
                  <div className="flex items-center gap-2 text-secondary">
                    <AlertTriangle className="w-4 h-4 text-critical shrink-0" />
                    <span>Severe vehicular bottleneck near {currentEvent.primaryGate} entrance</span>
                  </div>
                  <div className="flex items-center gap-2 text-secondary">
                    <AlertTriangle className="w-4 h-4 text-critical shrink-0" />
                    <span>Parking structure approaching 98% saturation</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-mono">
                <span className="text-critical font-bold">+{times.road - times.metro} min delay risk</span>
                <span className="text-secondary">Arrives by {times.roadArrival}</span>
              </div>
            </div>
          </div>

          {/* Explanation Banner */}
          <div className="p-4 bg-surface border border-border rounded-md flex items-start gap-3">
            <div className="p-2 bg-orbit-subtle text-orbit rounded shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-orbit font-bold block">
                PREDICTIVE ROUTING EXPLANATION
              </span>
              <p className="text-xs text-primary font-medium mt-1 leading-relaxed">
                "ORBIT recommends Metro + Shuttle because the {currentEvent.highwayCorridor} corridor is predicted to experience heavy congestion within 20 minutes."
              </p>
            </div>
          </div>

          {/* Gate Queue Comparison Table */}
          <div className="bg-surface border border-border rounded-md p-5">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-secondary block">
                  Turnstile Wait Comparison
                </span>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
                  LIVE VENUE GATE QUEUES
                </h4>
              </div>
              <span className="text-[11px] font-mono text-secondary">
                {currentEvent.gatesCount || 14} TURNSTILES PER GATE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 border border-border rounded bg-white">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary">{currentEvent.primaryGate.toUpperCase()}</span>
                  <span className="text-critical text-[10px] uppercase font-bold">28 MIN WAIT</span>
                </div>
                <span className="text-secondary text-[11px] block mt-1">Direct arterial link (Heavily queued)</span>
              </div>

              <div className="p-3 border border-border rounded bg-white">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary">GATE B (CENTRAL)</span>
                  <span className="text-warning text-[10px] uppercase font-bold">14 MIN WAIT</span>
                </div>
                <span className="text-secondary text-[11px] block mt-1">Pedestrian concourse link (Moderate)</span>
              </div>

              <div className="p-3 border border-safe/60 rounded bg-[#EBF6F0]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-safe-text">{currentEvent.alternateGate.toUpperCase()}</span>
                  <span className="text-safe font-bold text-[10px] uppercase">2 MIN WAIT ★</span>
                </div>
                <span className="text-safe-text text-[11px] block mt-1">{currentEvent.shuttleRoute} staging bay (Fast-Track)</span>
              </div>
            </div>
          </div>

          {/* RECOMMENDED GATE CARD */}
          <div className="bg-surface border border-border rounded-md p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-secondary font-bold block">
                RECOMMENDED GATE FOR FASTEST INGRESS
              </span>
              <div className="flex items-center gap-3 mt-1">
                <h4 className="text-2xl font-bold font-mono text-primary">
                  {currentEvent.alternateGate.toUpperCase()}
                </h4>
                <MetricPill status="NORMAL" label="OPEN BUFFER" size="sm" />
              </div>
              <p className="text-xs text-secondary mt-1">
                Directly connected to {currentEvent.shuttleRoute} staging bay. Dedicated scanning turnstiles.
              </p>
            </div>

            <div className="p-3 bg-[#EBF6F0] border border-safe/30 rounded text-right shrink-0">
              <span className="text-[10px] font-mono uppercase text-safe-text block">
                CURRENT GATE QUEUE
              </span>
              <span className="text-2xl font-bold font-mono text-safe">
                42%
              </span>
              <span className="text-[10px] font-mono text-secondary block">
                Wait time: ~2 minutes
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
