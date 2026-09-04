import React from 'react';
import { useApp } from '../context/AppContext';
import { MetricPill } from '../components/common/MetricPill';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

export const CrowdAnalytics: React.FC = () => {
  const { zones, simulationState } = useApp();

  // Zone comparison bar data
  const zoneBarData = zones.map((z) => ({
    name: z.name,
    district: z.district,
    density: z.crowdDensity,
    visitors: z.currentVisitors,
    capacity: z.capacityLimit,
    status: z.status,
  }));

  // Historical & Projected Crowd Trend (Hourly from 2 PM to 10 PM)
  const isSurge = simulationState === 'surge';
  const isOptimized = simulationState === 'optimized';

  const hourlyTrendData = [
    { time: '2:00 PM', zoneA: 20, zoneB: 15, zoneC: 18, total: 14000 },
    { time: '3:00 PM', zoneA: 38, zoneB: 28, zoneC: 32, total: 28000 },
    { time: '4:00 PM', zoneA: 55, zoneB: 42, zoneC: 45, total: 42000 },
    { time: '5:00 PM', zoneA: 72, zoneB: 50, zoneC: 60, total: 61000 },
    { time: '6:00 PM', zoneA: isSurge ? 86 : isOptimized ? 74 : 64, zoneB: 56, zoneC: isSurge ? 78 : 50, total: isSurge ? 82000 : 68000 },
    { time: '7:00 PM', zoneA: isSurge ? 96 : isOptimized ? 72 : 70, zoneB: 62, zoneC: isSurge ? 88 : 54, total: isSurge ? 96000 : 72000 },
    { time: '8:00 PM', zoneA: isSurge ? 92 : isOptimized ? 68 : 66, zoneB: 58, zoneC: isSurge ? 76 : 48, total: isSurge ? 89000 : 67000 },
    { time: '9:00 PM', zoneA: 70, zoneB: 52, zoneC: 65, total: 60000 },
    { time: '10:00 PM', zoneA: 35, zoneB: 30, zoneC: 40, total: 32000 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono tracking-wider uppercase text-secondary block">
            Spatial Distribution
          </span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary font-mono">
            CROWD ANALYTICS
          </h1>
          <p className="text-sm text-secondary mt-1">
            Real-time zone density metrics and turnstile queue telemetry
          </p>
        </div>

        {/* Peak Forecast Highlight Card */}
        <div className="bg-surface border border-border rounded-md px-5 py-3 flex items-center gap-5">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-secondary block">
              PEAK FORECAST
            </span>
            <div className="text-xl font-bold font-mono text-primary">
              96,000 visitors
            </div>
            <span className="text-xs font-mono text-high font-semibold">
              7:00 PM (Headliner)
            </span>
          </div>
          <div className="p-2.5 bg-[#FDF1EB] border border-high/30 rounded text-high shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 4 Zone Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {zones.map((zone) => (
          <div
            key={zone.id}
            className="bg-surface border border-border rounded-md p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-primary font-mono">
                  {zone.name}
                </h3>
                <span className="text-[11px] text-secondary block">
                  {zone.district}
                </span>
              </div>
              <MetricPill status={zone.status} size="sm" />
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className="text-3xl font-bold font-mono text-primary">
                {zone.crowdDensity}%
              </span>
              <span className="text-xs font-mono text-secondary">
                {zone.currentVisitors.toLocaleString()} / {zone.capacityLimit.toLocaleString()}
              </span>
            </div>

            {/* Capacity Bar */}
            <div className="w-full bg-[#EBEBE6] h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  zone.crowdDensity >= 85
                    ? 'bg-critical'
                    : zone.crowdDensity >= 60
                    ? 'bg-high'
                    : 'bg-safe'
                }`}
                style={{ width: `${zone.crowdDensity}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hourly Trend Across Zones */}
        <div className="lg:col-span-7 bg-surface border border-border rounded-md p-5">
          <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-secondary block">
                Temporal Ingress Pattern
              </span>
              <h3 className="text-sm font-semibold tracking-tight text-primary">
                CROWD TREND (HOURLY DENSITY %)
              </h3>
            </div>
            <span className="text-xs font-mono text-secondary">
              2:00 PM – 10:00 PM
            </span>
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EAEAE5" vertical={false} />
                <XAxis
                  dataKey="time"
                  tickLine={false}
                  axisLine={{ stroke: '#E4E4E0' }}
                  tick={{ fill: '#6B6B67', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
                />
                <YAxis
                  domain={[0, 100]}
                  tickLine={false}
                  axisLine={{ stroke: '#E4E4E0' }}
                  tick={{ fill: '#6B6B67', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
                  unit="%"
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-surface border border-border p-2.5 rounded shadow-sm text-xs font-mono">
                          <div className="text-primary font-bold mb-1">{label}</div>
                          {payload.map((entry) => (
                            <div key={entry.name} className="flex justify-between gap-3 text-secondary">
                              <span>{entry.name}:</span>
                              <span className="font-bold text-primary">{entry.value}%</span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', paddingTop: '10px' }}
                />
                <Line type="monotone" name="Zone A (Venue)" dataKey="zoneA" stroke="#B83232" strokeWidth={2} dot={false} />
                <Line type="monotone" name="Zone B (Hotels)" dataKey="zoneB" stroke="#B7791F" strokeWidth={1.75} dot={false} />
                <Line type="monotone" name="Zone C (Transit)" dataKey="zoneC" stroke="#315CFF" strokeWidth={1.75} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Zone Comparison Bar Chart */}
        <div className="lg:col-span-5 bg-surface border border-border rounded-md p-5">
          <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-secondary block">
                Comparative Load
              </span>
              <h3 className="text-sm font-semibold tracking-tight text-primary">
                ZONE CAPACITY COMPARISON
              </h3>
            </div>
            <span className="text-xs font-mono text-secondary">
              CURRENT
            </span>
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EAEAE5" vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={{ stroke: '#E4E4E0' }}
                  tick={{ fill: '#6B6B67', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
                />
                <YAxis
                  domain={[0, 100]}
                  tickLine={false}
                  axisLine={{ stroke: '#E4E4E0' }}
                  tick={{ fill: '#6B6B67', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
                  unit="%"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-surface border border-border p-2 rounded shadow-sm text-xs font-mono">
                          <div className="font-bold text-primary">{item.name} ({item.district})</div>
                          <div className="text-secondary">Density: <span className="font-bold text-primary">{item.density}%</span></div>
                          <div className="text-secondary">Occupancy: {item.visitors.toLocaleString()} / {item.capacity.toLocaleString()}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="density"
                  fill="#171717"
                  radius={[4, 4, 0, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Gate Turnstile Ingress Telemetry */}
      <div className="bg-surface border border-border rounded-md p-5">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-secondary block">
              Venue Ingress Ports
            </span>
            <h3 className="text-sm font-semibold tracking-tight text-primary">
              GATE-LEVEL QUEUE SATURATION
            </h3>
          </div>
          <span className="text-xs font-mono text-secondary">
            OPTICAL TURNSTILE SENSORS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-border rounded bg-white">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono font-bold text-sm text-primary">GATE A (WEST ARTERIAL)</span>
              <MetricPill status={simulationState === 'surge' ? 'CRITICAL' : 'MODERATE'} size="sm" />
            </div>
            <div className="text-2xl font-mono font-bold text-primary mt-2">
              {simulationState === 'surge' ? '96%' : '52%'}
            </div>
            <div className="text-xs text-secondary mt-1">
              Throughput: 340 pax/min • Queue wait: {simulationState === 'surge' ? '28 min' : '4 min'}
            </div>
          </div>

          <div className="p-4 border border-border rounded bg-white">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono font-bold text-sm text-primary">GATE B (SOUTH TRANSIT)</span>
              <MetricPill status={simulationState === 'surge' ? 'HIGH' : 'NORMAL'} size="sm" />
            </div>
            <div className="text-2xl font-mono font-bold text-primary mt-2">
              {simulationState === 'surge' ? '74%' : '44%'}
            </div>
            <div className="text-xs text-secondary mt-1">
              Throughput: 280 pax/min • Queue wait: {simulationState === 'surge' ? '14 min' : '3 min'}
            </div>
          </div>

          <div className="p-4 border border-border rounded bg-white">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono font-bold text-sm text-primary">GATE C (NORTH BYPASS)</span>
              <MetricPill status="NORMAL" label="RECOMMENDED" size="sm" />
            </div>
            <div className="text-2xl font-mono font-bold text-safe mt-2">
              {simulationState === 'optimized' ? '42%' : '38%'}
            </div>
            <div className="text-xs text-secondary mt-1">
              Throughput: 180 pax/min • Queue wait: 2 min (Under-utilized)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
