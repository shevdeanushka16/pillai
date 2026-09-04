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
} from 'recharts';
import { Bus, Check, Sparkles } from 'lucide-react';

export const Transportation: React.FC = () => {
  const { routes, activateRoute3 } = useApp();

  const route3 = routes.find((r) => r.id === 'route-3');
  const isRoute3Active = route3?.active;

  const handleActivateRoute3 = () => {
    activateRoute3();
  };

  // Chart data
  const chartData = routes.map((r) => ({
    name: r.name.split(' (')[0],
    fullName: r.name,
    load: r.load,
    time: r.travelTimeMin,
    status: r.status,
  }));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono tracking-wider uppercase text-secondary block">
            Corridor & Transit Telemetry
          </span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary font-mono">
            TRANSPORTATION NETWORK
          </h1>
          <p className="text-sm text-secondary mt-1">
            Real-time arterial traffic load, transit headway, and shuttle fleet staging
          </p>
        </div>

        <div>
          <button
            onClick={handleActivateRoute3}
            disabled={isRoute3Active}
            className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-mono font-medium transition-all ${
              isRoute3Active
                ? 'bg-[#EBF6F0] text-safe border border-safe/30 cursor-default'
                : 'bg-orbit hover:bg-orbit-hover text-white shadow-sm'
            }`}
          >
            {isRoute3Active ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>ROUTE 3 ACTIVE ✓</span>
              </>
            ) : (
              <>
                <Bus className="w-3.5 h-3.5" />
                <span>ACTIVATE ROUTE 3</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Route Table */}
      <div className="bg-surface border border-border rounded-md overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-[#FAFAF8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bus className="w-4 h-4 text-secondary" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
              CORRIDOR LOAD & TRAVEL TIME
            </h3>
          </div>
          <span className="text-[11px] font-mono text-secondary">
            INTELLIGENT FLEET STAGING
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#F2F2EE] text-secondary uppercase text-[11px] border-b border-border">
              <tr>
                <th className="py-3 px-5">CORRIDOR / ROUTE</th>
                <th className="py-3 px-5 text-right">LOAD %</th>
                <th className="py-3 px-5 text-right">TRAVEL TIME</th>
                <th className="py-3 px-5 text-right">CORRIDOR STATUS</th>
                <th className="py-3 px-5 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {routes.map((route) => (
                <tr key={route.id} className="hover:bg-[#FAF9F6] transition-colors">
                  <td className="py-3.5 px-5 font-bold text-primary flex items-center gap-2">
                    <span>{route.name}</span>
                    {route.id === 'route-3' && (
                      <span className="text-[10px] font-normal text-orbit bg-orbit-subtle px-1.5 py-0.5 rounded border border-orbit/20">
                        Dedicated Ingress Shuttle
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <span className="font-bold text-primary mr-2">{route.load}%</span>
                    <span className="inline-block w-16 bg-[#EBEBE6] h-1.5 rounded-full overflow-hidden align-middle">
                      <span
                        className={`block h-full ${
                          route.load >= 80
                            ? 'bg-critical'
                            : route.load >= 60
                            ? 'bg-high'
                            : 'bg-safe'
                        }`}
                        style={{ width: `${route.load}%` }}
                      />
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right font-medium text-secondary">
                    {route.travelTimeMin} min
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <MetricPill status={route.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    {route.id === 'route-3' ? (
                      <button
                        onClick={handleActivateRoute3}
                        className={`px-2.5 py-1 rounded text-[11px] font-mono font-medium transition-all ${
                          isRoute3Active
                            ? 'bg-safe text-white'
                            : 'border border-border hover:border-primary text-primary'
                        }`}
                      >
                        {isRoute3Active ? 'ACTIVE ✓' : 'ACTIVATE →'}
                      </button>
                    ) : (
                      <span className="text-secondary text-[11px]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart & Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Route Load Chart */}
        <div className="lg:col-span-7 bg-surface border border-border rounded-md p-5">
          <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-secondary block">
                Arterial Congestion Ratio
              </span>
              <h3 className="text-sm font-semibold tracking-tight text-primary">
                CORRIDOR LOAD DISTRIBUTION (%)
              </h3>
            </div>
            <span className="text-xs font-mono text-secondary">
              GPS Probe Feed
            </span>
          </div>

          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                          <div className="font-bold text-primary">{item.fullName}</div>
                          <div className="text-secondary">Load: <span className="font-bold text-primary">{item.load}%</span></div>
                          <div className="text-secondary">Travel Time: {item.time} min</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="load"
                  fill="#315CFF"
                  radius={[4, 4, 0, 0]}
                  barSize={36}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orbit Insight & Quick Controls */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          <div className="bg-surface border border-border rounded-md p-5 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-orbit">
                <Sparkles className="w-4 h-4" />
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold">
                  ORBIT INSIGHT
                </span>
              </div>
              <h4 className="text-sm font-semibold text-primary">
                "Route 3 provides the lowest projected congestion."
              </h4>
              <p className="text-xs text-secondary leading-relaxed">
                By deploying 18 dedicated electric shuttle buses via the reserved transit lane between Andheri Metro and Gate C, transit load across Highway Route 1 can be reduced by 21%.
              </p>
            </div>

            <div className="pt-4 border-t border-border mt-4">
              <button
                onClick={handleActivateRoute3}
                disabled={isRoute3Active}
                className={`w-full py-2.5 rounded text-xs font-mono font-medium transition-all ${
                  isRoute3Active
                    ? 'bg-[#EBF6F0] text-safe border border-safe/30'
                    : 'bg-primary text-white hover:bg-neutral-800 shadow-sm'
                }`}
              >
                {isRoute3Active ? 'ROUTE 3 ACTIVE ✓ (18 SHUTTLES STAGED)' : 'ACTIVATE ROUTE 3 NOW →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
