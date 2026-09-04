import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Cpu, CheckCircle2, AlertTriangle } from 'lucide-react';
import { MetricPill } from './MetricPill';

export const DecisionEngineModal: React.FC = () => {
  const { showEngineModal, setShowEngineModal, metrics, pressureScore, rules, riskEvaluation } = useApp();

  if (!showEngineModal) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white border border-border rounded-lg max-w-2xl w-full shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-[#FAFAF8]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-orbit-subtle text-orbit rounded">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-primary uppercase tracking-wide font-mono">
                EXPLAINABLE DECISION ENGINE
              </h3>
              <p className="text-xs text-secondary">
                Deterministic capacity modeling & transparent orchestration logic
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowEngineModal(false)}
            className="text-secondary hover:text-primary p-1 rounded hover:bg-surface-subtle transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Formula Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-secondary">
                Mathematical Capacity Formula
              </span>
              <MetricPill status={riskEvaluation.level} />
            </div>

            <div className="p-4 bg-surface-subtle border border-border rounded font-mono text-xs text-primary space-y-2">
              <div className="font-semibold text-orbit">
                pressureScore = 0.40(crowd) + 0.25(transport) + 0.20(hotel) + 0.15(venue)
              </div>
              <div className="text-secondary pt-1 border-t border-border flex flex-wrap gap-y-1 gap-x-2">
                <span>= 0.40 × {metrics.crowdDensity}%</span>
                <span>+ 0.25 × {metrics.transportLoad}%</span>
                <span>+ 0.20 × {metrics.hotelOccupancy}%</span>
                <span>+ 0.15 × {metrics.venueCapacity}%</span>
              </div>
              <div className="pt-2 text-primary font-bold text-sm flex items-center justify-between">
                <span>Computed Score:</span>
                <span>
                  {(0.4 * metrics.crowdDensity + 0.25 * metrics.transportLoad + 0.2 * metrics.hotelOccupancy + 0.15 * metrics.venueCapacity).toFixed(2)} → {pressureScore} / 100 ({riskEvaluation.level})
                </span>
              </div>
            </div>
          </div>

          {/* Current Dynamic Inputs Table */}
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-secondary block mb-2">
              Live Input Telemetry
            </span>
            <div className="border border-border rounded overflow-hidden text-xs">
              <table className="w-full">
                <thead className="bg-[#F2F2EE] text-secondary font-mono uppercase text-[11px] border-b border-border">
                  <tr>
                    <th className="py-2 px-3 text-left">Vector</th>
                    <th className="py-2 px-3 text-right">Weight</th>
                    <th className="py-2 px-3 text-right">Current Value</th>
                    <th className="py-2 px-3 text-right">Weighted Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-mono">
                  <tr>
                    <td className="py-2 px-3 font-medium">Crowd Density</td>
                    <td className="py-2 px-3 text-right text-secondary">40%</td>
                    <td className="py-2 px-3 text-right font-semibold">{metrics.crowdDensity}%</td>
                    <td className="py-2 px-3 text-right text-orbit">{(0.4 * metrics.crowdDensity).toFixed(1)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium">Transport Load</td>
                    <td className="py-2 px-3 text-right text-secondary">25%</td>
                    <td className="py-2 px-3 text-right font-semibold">{metrics.transportLoad}%</td>
                    <td className="py-2 px-3 text-right text-orbit">{(0.25 * metrics.transportLoad).toFixed(1)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium">Hotel Occupancy</td>
                    <td className="py-2 px-3 text-right text-secondary">20%</td>
                    <td className="py-2 px-3 text-right font-semibold">{metrics.hotelOccupancy}%</td>
                    <td className="py-2 px-3 text-right text-orbit">{(0.2 * metrics.hotelOccupancy).toFixed(1)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium">Venue Capacity</td>
                    <td className="py-2 px-3 text-right text-secondary">15%</td>
                    <td className="py-2 px-3 text-right font-semibold">{metrics.venueCapacity}%</td>
                    <td className="py-2 px-3 text-right text-orbit">{(0.15 * metrics.venueCapacity).toFixed(1)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Transparent Rule Evaluation Engine */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-secondary block">
              Operational Decision Rules
            </span>
            <div className="space-y-2">
              {rules.map((r) => (
                <div
                  key={r.id}
                  className={`p-3 border rounded flex items-start justify-between gap-3 text-xs ${
                    r.triggered
                      ? 'border-critical/40 bg-critical-subtle/50 text-critical-text'
                      : 'border-border bg-surface text-secondary'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {r.triggered ? (
                      <AlertTriangle className="w-4 h-4 text-critical shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-safe shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-mono font-semibold">
                        IF {r.condition} (Current: {r.value}%)
                      </div>
                      <div className="text-primary mt-0.5">{r.action}</div>
                    </div>
                  </div>
                  <span
                    className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded border shrink-0 ${
                      r.triggered
                        ? 'border-critical/40 bg-white text-critical font-bold'
                        : 'border-border bg-[#F7F7F5] text-secondary'
                    }`}
                  >
                    {r.triggered ? 'TRIGGERED' : 'PASS'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#FAFAF8] border-t border-border flex items-center justify-between">
          <span className="text-[11px] font-mono text-secondary">
            Zero black-box LLM hallucinations • 100% deterministic rules
          </span>
          <button
            onClick={() => setShowEngineModal(false)}
            className="px-4 py-1.5 bg-primary text-white text-xs font-medium rounded hover:bg-neutral-800 transition-colors"
          >
            Close Engine Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
