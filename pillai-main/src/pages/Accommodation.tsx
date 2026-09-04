import React from 'react';
import { useApp } from '../context/AppContext';
import { MetricPill } from '../components/common/MetricPill';
import { Sparkles, ArrowRight, BedDouble, CheckCircle2 } from 'lucide-react';

export const Accommodation: React.FC = () => {
  const { hotels, simulationState, toggleAction, actions, addToast } = useApp();

  const shiftAction = actions.find((a) => a.id === 'shift-stays');
  const isShifted = shiftAction?.applied || simulationState === 'optimized';

  const handleShiftStays = () => {
    if (!isShifted) {
      toggleAction('shift-stays');
    } else {
      addToast('Stay shift reallocation is already active.', 'info');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono tracking-wider uppercase text-secondary block">
            Hospitality & Lodging
          </span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary font-mono">
            ACCOMMODATION CAPACITY
          </h1>
          <p className="text-sm text-secondary mt-1">
            Real-time hotel inventory and room availability across event districts
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShiftStays}
            className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-mono font-medium transition-all ${
              isShifted
                ? 'bg-[#EBF6F0] text-safe border border-safe/30'
                : 'bg-primary text-white hover:bg-neutral-800 shadow-sm'
            }`}
          >
            {isShifted ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>ZONE A → C REBALANCING ACTIVE</span>
              </>
            ) : (
              <>
                <span>REBALANCE TO ZONE C (820 ROOMS)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-border p-4 rounded-md">
          <span className="text-[10px] font-mono uppercase text-secondary block">TOTAL HOTELS</span>
          <span className="text-2xl font-bold font-mono text-primary">85</span>
          <span className="text-[11px] text-secondary block mt-0.5">Across 4 zones</span>
        </div>
        <div className="bg-surface border border-border p-4 rounded-md">
          <span className="text-[10px] font-mono uppercase text-secondary block">AVAILABLE ROOMS</span>
          <span className="text-2xl font-bold font-mono text-primary">
            {hotels.reduce((acc, h) => acc + h.availableRooms, 0).toLocaleString()}
          </span>
          <span className="text-[11px] text-secondary block mt-0.5">Out of 6,800 inventory</span>
        </div>
        <div className="bg-surface border border-border p-4 rounded-md">
          <span className="text-[10px] font-mono uppercase text-secondary block">OVERALL OCCUPANCY</span>
          <span className="text-2xl font-bold font-mono text-primary">
            {Math.round(
              (hotels.reduce((acc, h) => acc + (h.totalRooms - h.availableRooms), 0) /
                hotels.reduce((acc, h) => acc + h.totalRooms, 0)) *
                100
            )}%
          </span>
          <span className="text-[11px] text-secondary block mt-0.5">Event perimeter average</span>
        </div>
        <div className="bg-surface border border-border p-4 rounded-md">
          <span className="text-[10px] font-mono uppercase text-secondary block">RECOMMENDED CLUSTER</span>
          <span className="text-2xl font-bold font-mono text-orbit">ZONE C</span>
          <span className="text-[11px] text-secondary block mt-0.5">940 rooms available</span>
        </div>
      </div>

      {/* Editorial Capacity Table */}
      <div className="bg-surface border border-border rounded-md overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-[#FAFAF8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BedDouble className="w-4 h-4 text-secondary" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
              DISTRICT LODGING OCCUPANCY LEDGER
            </h3>
          </div>
          <span className="text-[11px] font-mono text-secondary">
            DATA REFRESH: REAL-TIME (PMS INTEGRATIONS)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#F2F2EE] text-secondary uppercase text-[11px] border-b border-border">
              <tr>
                <th className="py-3 px-5">ZONE</th>
                <th className="py-3 px-5 text-right">HOTELS</th>
                <th className="py-3 px-5 text-right">AVAILABLE ROOMS</th>
                <th className="py-3 px-5 text-right">OCCUPANCY</th>
                <th className="py-3 px-5 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {hotels.map((hotel) => (
                <tr key={hotel.zone} className="hover:bg-[#FAF9F6] transition-colors">
                  <td className="py-3.5 px-5 font-bold text-primary flex items-center gap-2">
                    <span>{hotel.zone}</span>
                    {hotel.zone === 'Zone A' && (
                      <span className="text-[10px] font-normal text-secondary">(Venue District)</span>
                    )}
                    {hotel.zone === 'Zone C' && (
                      <span className="text-[10px] font-normal text-orbit font-semibold">★ Recommended Buffer</span>
                    )}
                  </td>
                  <td className="py-3.5 px-5 text-right text-secondary">
                    {hotel.hotelsCount}
                  </td>
                  <td className="py-3.5 px-5 text-right font-bold text-primary">
                    {hotel.availableRooms.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <span className="font-bold text-primary mr-3">{hotel.occupancy}%</span>
                    <span className="inline-block w-16 bg-[#EBEBE6] h-1.5 rounded-full overflow-hidden align-middle">
                      <span
                        className={`block h-full ${
                          hotel.occupancy >= 85
                            ? 'bg-critical'
                            : hotel.occupancy >= 70
                            ? 'bg-high'
                            : 'bg-safe'
                        }`}
                        style={{ width: `${hotel.occupancy}%` }}
                      />
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <MetricPill status={hotel.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ORBIT Insight Banner */}
      <div className="p-4 bg-surface border border-border rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-orbit-subtle text-orbit rounded shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-orbit font-bold block">
              ORBIT INSIGHT
            </span>
            <p className="text-sm font-medium text-primary mt-0.5">
              "Zone A is approaching saturation. Zone C has sufficient available capacity."
            </p>
            <p className="text-xs text-secondary mt-1">
              Triggering automated accommodation booking incentives redirects inbound overnight attendees to the northern rail transit corridor.
            </p>
          </div>
        </div>

        <button
          onClick={handleShiftStays}
          className="shrink-0 px-4 py-2 border border-border hover:border-primary text-xs font-mono font-medium rounded transition-all bg-white"
        >
          {isShifted ? 'Active in Dispatch' : 'Shift Inbound Bookings →'}
        </button>
      </div>
    </div>
  );
};
