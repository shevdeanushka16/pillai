import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Sliders,
  RotateCcw,
  CloudRain,
  TrainTrack,
  DoorClosed,
  Zap,
} from 'lucide-react';

export const TelemetrySlidersDrawer: React.FC = () => {
  const {
    showSlidersDrawer,
    setShowSlidersDrawer,
    metrics,
    pressureScore,
    riskEvaluation,
    currentEvent,
    telemetryOverrides,
    setTelemetryOverride,
    resetTelemetryOverrides,
  } = useApp();

  if (!showSlidersDrawer) return null;

  const handleVisitorsChange = (visitors: number) => {
    // Dynamically derive crowd density based on venue capacity
    const crowdDensity = Math.min(100, Math.round((visitors / currentEvent.capacity) * 100));
    setTelemetryOverride('visitors', visitors);
    setTelemetryOverride('crowdDensity', crowdDensity);
  };

  const applyStressPreset = (preset: 'rain' | 'metro' | 'gate' | 'rush') => {
    switch (preset) {
      case 'rain':
        setTelemetryOverride('transportLoad', 96);
        setTelemetryOverride('crowdDensity', 85);
        break;
      case 'metro':
        setTelemetryOverride('transportLoad', 98);
        break;
      case 'gate':
        setTelemetryOverride('venueCapacity', 98);
        setTelemetryOverride('crowdDensity', 92);
        break;
      case 'rush':
        handleVisitorsChange(currentEvent.expectedAttendance);
        setTelemetryOverride('transportLoad', 89);
        setTelemetryOverride('venueCapacity', 94);
        break;
    }
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden bg-black/50 backdrop-blur-xs animate-in fade-in duration-200 flex justify-end">
      <div className="w-full max-w-md bg-white border-l border-border h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Top Header */}
        <div className="p-5 border-b border-border bg-surface-subtle flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-orbit/10 text-orbit flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold font-mono tracking-tight text-primary">
                  SENSOR OVERRIDE DECK
                </h2>
                {telemetryOverrides && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-warning-subtle text-warning-text border border-warning/30 font-bold">
                    MANUAL OVERRIDE
                  </span>
                )}
              </div>
              <p className="text-[11px] text-secondary font-mono">
                Interactive real-time telemetry testing for evaluators
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowSlidersDrawer(false)}
            className="p-1.5 rounded-md text-secondary hover:text-primary hover:bg-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Mathematical Formula Telemetry Display */}
        <div className="p-4 bg-slate-950 text-slate-100 border-b border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-slate-400 uppercase">DYNAMIC PRESSURE OUTPUT</span>
            <span
              className="px-2 py-0.5 rounded text-[10px] font-bold font-mono"
              style={{ backgroundColor: `${riskEvaluation.colorHex}30`, color: riskEvaluation.colorHex }}
            >
              {riskEvaluation.label} RISK
            </span>
          </div>

          <div className="flex items-baseline justify-between font-mono">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold tracking-tight text-white">
                {pressureScore}
              </span>
              <span className="text-xs text-slate-400">/ 100</span>
            </div>

            <div className="text-right text-[11px] text-slate-400">
              <span>ACTIVE CAPACITY BUFFER: </span>
              <strong className="text-white">{Math.max(0, 100 - pressureScore)}%</strong>
            </div>
          </div>

          {/* Calibrated Formula Representation */}
          <div className="mt-3 pt-2.5 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex flex-wrap gap-x-2 gap-y-1">
            <span>0.40·({metrics.crowdDensity}%)</span>
            <span>+</span>
            <span>0.25·({metrics.transportLoad}%)</span>
            <span>+</span>
            <span>0.20·({metrics.hotelOccupancy}%)</span>
            <span>+</span>
            <span>0.15·({metrics.venueCapacity}%)</span>
          </div>
        </div>

        {/* Sliders Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Slider 1: Inbound Visitors */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-secondary font-medium uppercase">INBOUND ATTENDEES</span>
              <strong className="text-primary font-bold">
                {metrics.visitors.toLocaleString()} pax{' '}
                <span className="text-secondary font-normal font-sans">
                  ({metrics.crowdDensity}% cap)
                </span>
              </strong>
            </div>
            <input
              type="range"
              min={10000}
              max={Math.max(120000, currentEvent.expectedAttendance * 1.2)}
              step={1000}
              value={metrics.visitors}
              onChange={(e) => handleVisitorsChange(Number(e.target.value))}
              className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-orbit"
            />
            <div className="flex justify-between text-[10px] font-mono text-secondary">
              <span>10,000</span>
              <span>Capacity: {currentEvent.capacity.toLocaleString()}</span>
              <span>120,000+</span>
            </div>
          </div>

          {/* Slider 2: Transport Load */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-secondary font-medium uppercase">TRANSPORT CORRIDOR LOAD</span>
              <strong
                className={`font-bold ${
                  metrics.transportLoad >= 80
                    ? 'text-critical'
                    : metrics.transportLoad >= 60
                    ? 'text-high'
                    : 'text-primary'
                }`}
              >
                {metrics.transportLoad}%
              </strong>
            </div>
            <input
              type="range"
              min={15}
              max={100}
              step={1}
              value={metrics.transportLoad}
              onChange={(e) => setTelemetryOverride('transportLoad', Number(e.target.value))}
              className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-orbit"
            />
            <div className="flex justify-between text-[10px] font-mono text-secondary">
              <span>Flowing (15%)</span>
              <span>Heavy (60%)</span>
              <span>Gridlocked (100%)</span>
            </div>
          </div>

          {/* Slider 3: Turnstile Capacity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-secondary font-medium uppercase">VENUE GATE SATURATION</span>
              <strong
                className={`font-bold ${
                  metrics.venueCapacity >= 80 ? 'text-critical' : 'text-primary'
                }`}
              >
                {metrics.venueCapacity}%
              </strong>
            </div>
            <input
              type="range"
              min={15}
              max={100}
              step={1}
              value={metrics.venueCapacity}
              onChange={(e) => setTelemetryOverride('venueCapacity', Number(e.target.value))}
              className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-orbit"
            />
            <div className="flex justify-between text-[10px] font-mono text-secondary">
              <span>Clear Turnstiles</span>
              <span>Buffer Saturated</span>
              <span>Gate Crushes</span>
            </div>
          </div>

          {/* Slider 4: Hotel Occupancy */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-secondary font-medium uppercase">HOTEL DISTRICT OCCUPANCY</span>
              <strong className="text-primary font-bold">{metrics.hotelOccupancy}%</strong>
            </div>
            <input
              type="range"
              min={25}
              max={100}
              step={1}
              value={metrics.hotelOccupancy}
              onChange={(e) => setTelemetryOverride('hotelOccupancy', Number(e.target.value))}
              className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-orbit"
            />
            <div className="flex justify-between text-[10px] font-mono text-secondary">
              <span>Vacancy Available (25%)</span>
              <span>High (75%)</span>
              <span>Sold Out (100%)</span>
            </div>
          </div>

          {/* Quick Disaster Stress Presets */}
          <div className="pt-3 border-t border-border space-y-2.5">
            <span className="text-[11px] font-mono uppercase text-secondary font-semibold block">
              INSTANT STRESS TESTS (PRESETS):
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => applyStressPreset('rain')}
                className="flex items-center gap-1.5 p-2 border border-border hover:border-orbit rounded text-left text-xs font-mono text-primary transition-colors bg-surface hover:bg-surface-subtle"
              >
                <CloudRain className="w-3.5 h-3.5 text-orbit shrink-0" />
                <span>Monsoon Flood</span>
              </button>

              <button
                onClick={() => applyStressPreset('metro')}
                className="flex items-center gap-1.5 p-2 border border-border hover:border-orbit rounded text-left text-xs font-mono text-primary transition-colors bg-surface hover:bg-surface-subtle"
              >
                <TrainTrack className="w-3.5 h-3.5 text-warning shrink-0" />
                <span>Metro Stoppage</span>
              </button>

              <button
                onClick={() => applyStressPreset('gate')}
                className="flex items-center gap-1.5 p-2 border border-border hover:border-orbit rounded text-left text-xs font-mono text-primary transition-colors bg-surface hover:bg-surface-subtle"
              >
                <DoorClosed className="w-3.5 h-3.5 text-critical shrink-0" />
                <span>Gate A Bottleneck</span>
              </button>

              <button
                onClick={() => applyStressPreset('rush')}
                className="flex items-center gap-1.5 p-2 border border-border hover:border-orbit rounded text-left text-xs font-mono text-primary transition-colors bg-surface hover:bg-surface-subtle"
              >
                <Zap className="w-3.5 h-3.5 text-high shrink-0" />
                <span>Peak Rush Surge</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-4 border-t border-border bg-surface-subtle flex items-center justify-between gap-3">
          <button
            onClick={resetTelemetryOverrides}
            className="flex items-center gap-1.5 px-3 py-2 border border-border rounded text-xs font-mono text-secondary hover:text-primary hover:bg-surface transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET TO SENSORS</span>
          </button>

          <button
            onClick={() => setShowSlidersDrawer(false)}
            className="px-5 py-2 bg-primary text-white rounded text-xs font-mono font-medium hover:bg-neutral-800 transition-colors"
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
};
