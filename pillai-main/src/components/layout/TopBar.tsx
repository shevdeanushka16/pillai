import React from 'react';
import { useApp } from '../../context/AppContext';
import { Play, RotateCcw, Cpu, FileText } from 'lucide-react';

export const TopBar: React.FC = () => {
  const {
    simulationState,
    simulatedTime,
    simulateDemandSurge,
    resetSimulation,
    setShowEngineModal,
    setShowSitrepModal,
  } = useApp();

  return (
    <header className="h-16 border-b border-border bg-white px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Event Details */}
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold tracking-tight text-primary">
              Mumbai Mega Concert
            </h1>
            <span className="hidden sm:inline-block text-secondary font-mono text-xs">
              /
            </span>
            <span className="hidden sm:inline-block text-secondary font-mono text-xs">
              03 SEP 2026
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-wider uppercase text-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-safe animate-pulse" />
              LIVE · SIMULATION
            </span>
            <span className="text-[10px] font-mono text-primary font-bold">
              • {simulatedTime} IST
            </span>
          </div>
        </div>
      </div>

      {/* Right: Simulation Key Trigger & Actions */}
      <div className="flex items-center gap-2.5">
        {/* Situation Report export trigger */}
        <button
          onClick={() => setShowSitrepModal(true)}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 border border-border rounded text-xs font-mono text-secondary hover:text-primary hover:bg-surface-subtle transition-colors"
          title="Export incident briefing and situation report"
        >
          <FileText className="w-3.5 h-3.5 text-secondary" />
          <span>SITREP BRIEF</span>
        </button>

        {/* Explainable Decision Engine trigger */}
        <button
          onClick={() => setShowEngineModal(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-border rounded text-xs font-mono text-secondary hover:text-primary hover:bg-surface-subtle transition-colors"
        >
          <Cpu className="w-3.5 h-3.5 text-orbit" />
          <span>DECISION LOGIC</span>
        </button>

        {/* Primary Demo Button: SIMULATE DEMAND SURGE / RESET */}
        {simulationState === 'normal' ? (
          <button
            onClick={simulateDemandSurge}
            className="flex items-center gap-2 px-4 py-2 bg-orbit hover:bg-orbit-hover text-white rounded text-xs font-mono font-medium tracking-wide transition-all shadow-sm active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>SIMULATE DEMAND SURGE</span>
          </button>
        ) : (
          <button
            onClick={resetSimulation}
            className="flex items-center gap-2 px-4 py-2 bg-surface border border-border-strong hover:bg-surface-subtle text-primary rounded text-xs font-mono font-medium tracking-wide transition-all active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5 text-secondary" />
            <span>RESET SIMULATION</span>
          </button>
        )}
      </div>
    </header>
  );
};
