import React from 'react';
import { TIMELINE_SCHEDULE } from '../../data/mockData';
import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { EventTimePoint } from '../../context/AppContext';

export const EventTimeline: React.FC = () => {
  const { simulatedTime, setSimulatedTime } = useApp();

  return (
    <div className="bg-surface border border-border rounded-md p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-3 mb-4 gap-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-secondary" />
          <h3 className="text-xs font-semibold tracking-wider font-mono uppercase text-primary">
            EVENT PHASING TIMELINE (CLICK TO SCRUB PHASE)
          </h3>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-secondary">
          <span>ACTIVE SIMULATED TIME:</span>
          <span className="font-bold text-primary bg-[#F2F2EE] px-2 py-0.5 rounded border border-border">
            {simulatedTime} IST
          </span>
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="relative">
        {/* Connecting line */}
        <div className="hidden md:block absolute top-4 left-6 right-6 h-0.5 bg-border -z-0" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 relative z-10">
          {TIMELINE_SCHEDULE.map((event) => {
            const isSelected = simulatedTime === event.time;

            return (
              <button
                key={event.time}
                onClick={() => setSimulatedTime(event.time as EventTimePoint)}
                className={`p-3 rounded border text-left transition-all relative ${
                  isSelected
                    ? 'border-orbit ring-2 ring-orbit/20 bg-orbit-subtle/40 shadow-sm'
                    : event.isPeak
                    ? 'border-high/60 bg-high-subtle/30 hover:border-high'
                    : 'border-border bg-surface hover:bg-[#FAF9F6] hover:border-border-strong'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`font-mono text-xs font-bold ${
                      isSelected
                        ? 'text-orbit'
                        : event.isPeak
                        ? 'text-high'
                        : 'text-primary'
                    }`}
                  >
                    {event.time}
                  </span>
                  {event.isPeak && (
                    <span className="flex items-center gap-1 text-[9px] font-mono font-bold uppercase bg-high text-white px-1.5 py-0.5 rounded">
                      <AlertCircle className="w-2.5 h-2.5" />
                      PEAK
                    </span>
                  )}
                  {isSelected && (
                    <span className="text-[9px] font-mono font-bold text-orbit flex items-center gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      CURRENT
                    </span>
                  )}
                </div>

                <div className="text-xs font-bold text-primary mb-1">
                  {event.label}
                </div>
                <div className="text-[11px] text-secondary leading-snug">
                  {event.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
