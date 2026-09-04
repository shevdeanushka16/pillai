import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, Copy, Check, X, Printer } from 'lucide-react';
import { MetricPill } from './MetricPill';

export const SitrepModal: React.FC = () => {
  const { showSitrepModal, setShowSitrepModal, metrics, pressureScore, riskEvaluation, simulationState, simulatedTime, actions } = useApp();
  const [copied, setCopied] = useState(false);

  if (!showSitrepModal) return null;

  const sitrepText = `=====================================================
ORBIT MEGA-EVENT SITUATION REPORT (SITREP)
EVENT: Mumbai Mega Concert (BKC Arena)
DATE: 03 SEP 2026 | TIME: ${simulatedTime} IST
STATUS: ${riskEvaluation.level} (Pressure Score: ${pressureScore}/100)
=====================================================

1. TELEMETRY SUMMARY:
- Inbound Attendees: ${metrics.visitors.toLocaleString()} pax
- Crowd Density: ${metrics.crowdDensity}%
- Transit Corridor Load: ${metrics.transportLoad}%
- Accommodation Saturation: ${metrics.hotelOccupancy}%
- Venue Ingress Gate Capacity: ${metrics.venueCapacity}%

2. THREAT & BOTTLENECK ASSESSMENT:
${
  pressureScore >= 80
    ? '- CRITICAL STRAIN: Gate A turnstiles experiencing severe queues (>28 min wait). Highway Route 1 at 92% vehicular congestion.'
    : pressureScore >= 60
    ? '- HIGH STRAIN: Increasing arrivals ahead of 7:00 PM Headliner performance. Zone A approaching saturation buffer.'
    : '- STABLE: Flow rates operating within planned capacity buffers.'
}

3. ACTIVE ORCHESTRATION DIRECTIVES:
${actions
  .filter((a) => a.applied)
  .map((a) => `[ACTIVE] ${a.number} ${a.title} - ${a.subtitle} (${a.expectedImpact})`)
  .join('\n') || '- None currently deployed (Standby mode).'}

4. FIELD DISPATCH DIRECTIVES:
- Transit Police: Enforce bus priority lane on Route 3 (Metro to Gate C bypass).
- Venue Security: Open all 14 scanning lanes at Gate C; broadcast digital signage rerouting Gate A queues.
- Hospitality: Trigger automated room incentives for Zone C northern hotels.

REPORT COMPILED BY: ORBIT SENSE-PREDICT AUTOMATION ENGINE
=====================================================`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sitrepText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white border border-border rounded-lg max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-[#FAFAF8] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-orbit-subtle text-orbit rounded">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-wider uppercase text-secondary block">
                COMMAND DISPATCH
              </span>
              <h3 className="text-sm font-semibold text-primary font-mono uppercase">
                INCIDENT SITUATION REPORT (SITREP)
              </h3>
            </div>
          </div>
          <button
            onClick={() => setShowSitrepModal(false)}
            className="text-secondary hover:text-primary p-1 rounded hover:bg-surface-subtle transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Metadata Banner */}
          <div className="p-4 bg-surface-subtle border border-border rounded flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div>
              <span className="text-secondary text-[10px] uppercase block">INCIDENT IDENTIFIER</span>
              <span className="font-bold text-primary">ORBIT-BKC-20260903-SIT01</span>
            </div>
            <div>
              <span className="text-secondary text-[10px] uppercase block">TIMESTAMP</span>
              <span className="font-bold text-primary">03 SEP 2026 • {simulatedTime}</span>
            </div>
            <div>
              <span className="text-secondary text-[10px] uppercase block">EVENT STAGE</span>
              <span className="font-bold text-primary">{simulationState.toUpperCase()}</span>
            </div>
            <div>
              <span className="text-secondary text-[10px] uppercase block">RISK EVALUATION</span>
              <MetricPill status={riskEvaluation.level} size="sm" />
            </div>
          </div>

          {/* Monospace Formatted SITREP Text Box */}
          <div className="bg-[#FAF9F6] border border-border rounded p-4 font-mono text-xs text-primary leading-relaxed whitespace-pre-wrap select-all">
            {sitrepText}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 bg-[#FAFAF8] border-t border-border flex items-center justify-between">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs font-mono text-secondary hover:text-primary px-3 py-1.5 border border-border rounded transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PRINT SITREP</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-orbit hover:bg-orbit-hover text-white text-xs font-mono font-medium rounded transition-all shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>COPIED TO CLIPBOARD</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>COPY SITREP TEXT</span>
                </>
              )}
            </button>
            <button
              onClick={() => setShowSitrepModal(false)}
              className="px-4 py-1.5 bg-surface border border-border hover:bg-surface-subtle text-primary text-xs font-mono font-medium rounded transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
