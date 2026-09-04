import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, ArrowRight, X, TrendingDown } from 'lucide-react';

export const BeforeAfter: React.FC = () => {
  const { showBeforeAfterModal, setShowBeforeAfterModal, pressureScore, metrics, currentEvent } = useApp();

  if (!showBeforeAfterModal) return null;

  const currentScore = pressureScore;
  const surgeBaseline = 91;
  const delta = surgeBaseline - currentScore;

  const transportLoadPct = metrics.transportLoad;
  const hotelOccupancyPct = metrics.hotelOccupancy;
  const venueCapacityPct = metrics.venueCapacity;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white border border-border rounded-lg max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-[#FAFAF8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-safe-subtle text-safe rounded">
              <TrendingDown className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-wider uppercase text-secondary block">
                Impact Verification • {currentEvent.venueName}
              </span>
              <h3 className="text-sm font-semibold text-primary font-mono">
                PRESSURE REDUCED
              </h3>
            </div>
          </div>
          <button
            onClick={() => setShowBeforeAfterModal(false)}
            className="text-secondary hover:text-primary p-1 rounded hover:bg-surface-subtle transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status transformation banner */}
          <div className="p-4 bg-[#EBF6F0] border border-safe/30 rounded flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase text-safe-text font-bold block">
                Unified Status Transition
              </span>
              <div className="flex items-center gap-2 mt-1 font-mono text-sm font-bold">
                <span className="text-critical bg-critical-subtle px-2 py-0.5 rounded border border-critical/30">
                  SURGE (91)
                </span>
                <ArrowRight className="w-4 h-4 text-secondary" />
                <span className="text-safe bg-white px-2 py-0.5 rounded border border-safe/40 shadow-sm">
                  ACTIVE ({currentScore})
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-safe font-bold block">
                {delta >= 0 ? `−${delta}` : `+${Math.abs(delta)}`} PTS
              </span>
              <span className="text-[11px] text-secondary font-mono">Net Relief Delta</span>
            </div>
          </div>

          <p className="text-xs text-secondary italic">
            "Coordinated actions reduced projected event pressure across arterial transit, hotel occupancy, and venue ingress."
          </p>

          {/* Comparison Matrix */}
          <div className="border border-border rounded overflow-hidden">
            <table className="w-full text-xs font-mono">
              <thead className="bg-[#F2F2EE] text-secondary uppercase text-[11px] border-b border-border">
                <tr>
                  <th className="py-2.5 px-4 text-left">Sector Vector</th>
                  <th className="py-2.5 px-4 text-right text-critical">BEFORE (SURGE)</th>
                  <th className="py-2.5 px-4 text-right text-safe">CURRENT</th>
                  <th className="py-2.5 px-4 text-right text-orbit">RELIEF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-3 px-4 font-semibold text-primary">Transport Load</td>
                  <td className="py-3 px-4 text-right font-bold text-critical">88%</td>
                  <td className="py-3 px-4 text-right font-bold text-safe">{transportLoadPct}%</td>
                  <td className="py-3 px-4 text-right text-safe font-bold">−{Math.max(0, 88 - transportLoadPct)}%</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-primary">Hotels Occupancy</td>
                  <td className="py-3 px-4 text-right font-bold text-critical">91%</td>
                  <td className="py-3 px-4 text-right font-bold text-safe">{hotelOccupancyPct}%</td>
                  <td className="py-3 px-4 text-right text-safe font-bold">−{Math.max(0, 91 - hotelOccupancyPct)}%</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-primary">Venue Capacity</td>
                  <td className="py-3 px-4 text-right font-bold text-critical">94%</td>
                  <td className="py-3 px-4 text-right font-bold text-safe">{venueCapacityPct}%</td>
                  <td className="py-3 px-4 text-right text-safe font-bold">−{Math.max(0, 94 - venueCapacityPct)}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#FAFAF8] border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-secondary font-mono">
            <CheckCircle2 className="w-4 h-4 text-safe" />
            <span>Simulated actions verified & deployed</span>
          </div>
          <button
            onClick={() => setShowBeforeAfterModal(false)}
            className="px-4 py-1.5 bg-primary text-white text-xs font-medium rounded hover:bg-neutral-800 transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
