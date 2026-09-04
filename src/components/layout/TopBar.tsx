import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Radio,
  FlaskConical,
  Cpu,
  ChevronDown,
  Sliders,
  Sparkles,
  Smartphone,
  Play,
  RotateCcw,
  CloudRain,
  AlertOctagon,
  FileText,
  ShieldCheck,
  Zap,
  LogOut,
} from 'lucide-react';

export const TopBar: React.FC = () => {
  const {
    commandMode,
    setCommandMode,
    simulationState,
    simulatedTime,
    simulateDemandSurge,
    triggerWeatherDisruption,
    triggerHighwayBlockage,
    triggerEgressMode,
    resetSimulation,
    pressureScore,
    riskEvaluation,
    setShowEngineModal,
    setShowSitrepModal,
    setShowMobilePassModal,
    setShowEventModal,
    setShowSlidersDrawer,
    setShowCopilotDrawer,
    setShowActuationModal,
    isAutoPilotRunning,
    setIsAutoPilotRunning,
    currentEvent,
    telemetryOverrides,
    resetTelemetryOverrides,
  } = useApp();

  const [showWeightsPopover, setShowWeightsPopover] = useState<boolean>(false);

  return (
    <div className="sticky top-0 z-30 flex flex-col bg-white border-b border-border shadow-xs">
      {/* Primary Navigation Row */}
      <header className="h-16 px-5 flex items-center justify-between gap-4">
        {/* Left: Dynamic Event Anchor & Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowEventModal(true)}
            className="flex items-center gap-2 group text-left hover:bg-surface-subtle px-2.5 py-1.5 -ml-2 rounded-lg border border-transparent hover:border-border transition-all"
            title="Click to switch between arenas or configure a custom stadium"
          >
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-bold tracking-tight text-primary font-mono group-hover:text-orbit transition-colors flex items-center gap-1">
                  <span>{currentEvent.title}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-secondary group-hover:text-orbit transition-colors" />
                </h1>
                <span className="hidden xl:inline-block text-secondary font-mono text-xs">/</span>
                <span className="hidden xl:inline-block text-secondary font-mono text-xs">
                  {currentEvent.date}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-wider uppercase text-secondary">
                  <span className="w-1.5 h-1.5 rounded-full bg-safe animate-pulse" />
                  {currentEvent.venueName} ({currentEvent.city})
                </span>
                <span className="text-[10px] font-mono text-primary font-bold">
                  • {simulatedTime} IST
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Center: Operator-First 3-Stage Switchboard */}
        <nav aria-label="Command Mode Switcher" className="hidden md:flex items-center bg-surface-subtle p-1 rounded-xl border border-border/80 shadow-inner">
          {/* Stage 1: Live Operations */}
          <button
            onClick={() => setCommandMode('live')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              commandMode === 'live'
                ? 'bg-white text-primary shadow-xs font-bold border border-border/60 text-emerald-800'
                : 'text-secondary hover:text-primary hover:bg-white/50'
            }`}
          >
            <span className="relative flex h-2 w-2">
              {commandMode === 'live' && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  commandMode === 'live' ? 'bg-emerald-500' : 'bg-neutral-400'
                }`}
              />
            </span>
            <div className="flex flex-col text-left leading-tight">
              <span className="tracking-tight">Live Operations</span>
              <span className="text-[9px] text-secondary font-normal">Command Center</span>
            </div>
          </button>

          {/* Stage 2: Scenario Sandbox (What-If) */}
          <button
            onClick={() => setCommandMode('sandbox')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              commandMode === 'sandbox'
                ? 'bg-white text-primary shadow-xs font-bold border border-border/60 text-amber-800'
                : 'text-secondary hover:text-primary hover:bg-white/50'
            }`}
          >
            <FlaskConical
              className={`w-3.5 h-3.5 ${
                commandMode === 'sandbox' ? 'text-amber-600' : 'text-secondary'
              }`}
            />
            <div className="flex flex-col text-left leading-tight">
              <span className="tracking-tight">Scenario Sandbox</span>
              <span className="text-[9px] text-secondary font-normal">What-If Testing</span>
            </div>
            {telemetryOverrides && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            )}
          </button>

          {/* Stage 3: Audit & System Logic */}
          <button
            onClick={() => setCommandMode('audit')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              commandMode === 'audit'
                ? 'bg-white text-primary shadow-xs font-bold border border-border/60 text-indigo-800'
                : 'text-secondary hover:text-primary hover:bg-white/50'
            }`}
          >
            <Cpu
              className={`w-3.5 h-3.5 ${
                commandMode === 'audit' ? 'text-indigo-600' : 'text-secondary'
              }`}
            />
            <div className="flex flex-col text-left leading-tight">
              <span className="tracking-tight">Audit & System Logic</span>
              <span className="text-[9px] text-secondary font-normal">Rules & Weights</span>
            </div>
          </button>
        </nav>

        {/* Right: Dynamic Contextual Action Cluster based on Mode */}
        <div className="flex items-center gap-2 shrink-0">
          {/* ==================================================== */}
          {/* MODE 1: LIVE OPERATIONS CLUSTER */}
          {/* ==================================================== */}
          {commandMode === 'live' && (
            <div className="flex items-center gap-2 animate-in fade-in duration-200">
              {/* Telemetry Status Pill */}
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface border border-border text-[11px] font-mono">
                <span className="text-secondary uppercase">Risk:</span>
                <span
                  className={`font-bold uppercase ${
                    riskEvaluation.level === 'CRITICAL'
                      ? 'text-critical'
                      : riskEvaluation.level === 'HIGH'
                      ? 'text-warning-text'
                      : 'text-safe'
                  }`}
                >
                  {riskEvaluation.level} ({pressureScore}/100)
                </span>
              </div>

              {/* Multi-Channel Civic Actuation Deck */}
              <button
                onClick={() => setShowActuationModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-border text-secondary hover:text-primary hover:bg-surface-subtle rounded text-xs font-mono transition-colors shadow-xs"
                title="View Highway VMS, Geofenced Cell Broadcast, and PA audio actuation"
              >
                <Radio className="w-3.5 h-3.5 text-safe" />
                <span className="hidden sm:inline">ACTUATION DECK</span>
              </button>

              {/* Attendee Mobile Pass QR */}
              <button
                onClick={() => setShowMobilePassModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-orbit/40 text-orbit hover:bg-orbit/10 rounded text-xs font-mono transition-colors shadow-xs font-semibold"
                title="Open Attendee Pass QR emulator for live mobile sync"
              >
                <Smartphone className="w-3.5 h-3.5 text-orbit" />
                <span className="hidden sm:inline">ATTENDEE PASS</span>
              </button>

              {/* AI Incident Copilot */}
              <button
                onClick={() => setShowCopilotDrawer(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 text-purple-700 hover:from-purple-100 hover:to-indigo-100 rounded text-xs font-mono transition-colors shadow-xs font-semibold"
                title="Consult the AI Incident Commander"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
                <span className="hidden sm:inline">AI COPILOT</span>
              </button>

              {/* Judge Auto-Pilot Demo Trigger */}
              <button
                onClick={() => setIsAutoPilotRunning(!isAutoPilotRunning)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-bold transition-all shadow-sm ${
                  isAutoPilotRunning
                    ? 'bg-amber-500 text-neutral-950 border border-amber-600 animate-pulse'
                    : 'bg-amber-50 border border-amber-300 text-amber-800 hover:bg-amber-100'
                }`}
                title="Toggle self-driving presentation walkthrough"
              >
                <Play className="w-3.5 h-3.5 fill-current text-amber-600" />
                <span>{isAutoPilotRunning ? 'DEMO ACTIVE' : 'AUTO-PILOT'}</span>
              </button>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODE 2: SCENARIO SANDBOX (WHAT-IF) CLUSTER */}
          {/* ==================================================== */}
          {commandMode === 'sandbox' && (
            <div className="flex items-center gap-2 animate-in fade-in duration-200">
              {/* Telemetry Sliders Trigger */}
              <button
                onClick={() => setShowSlidersDrawer(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 border rounded text-xs font-mono transition-colors shadow-xs ${
                  telemetryOverrides
                    ? 'bg-amber-50 border-amber-300 text-amber-800 font-bold'
                    : 'bg-surface border-border text-secondary hover:text-primary hover:bg-surface-subtle'
                }`}
                title="Open fine-grained sensor override sliders"
              >
                <Sliders className="w-3.5 h-3.5 text-orbit" />
                <span>PARAMETER SLIDERS</span>
              </button>

              {/* Weather Incident Trigger */}
              <button
                onClick={triggerWeatherDisruption}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 rounded text-xs font-mono transition-colors shadow-xs"
                title="Simulate severe monsoon flash flood on highway corridors"
              >
                <CloudRain className="w-3.5 h-3.5 text-blue-600" />
                <span>WEATHER FLOOD</span>
              </button>

              {/* Highway Blockage Trigger */}
              <button
                onClick={triggerHighwayBlockage}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 rounded text-xs font-mono transition-colors shadow-xs"
                title="Simulate multi-vehicle arterial accident blocking Highway 1"
              >
                <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                <span>HIGHWAY BLOCK</span>
              </button>

              {/* Emergency Egress Evacuation Trigger */}
              <button
                onClick={triggerEgressMode}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 rounded text-xs font-mono transition-colors shadow-xs"
                title="Simulate massive post-event attendee egress & crowd dispersal"
              >
                <LogOut className="w-3.5 h-3.5 text-purple-600" />
                <span>MASS EGRESS</span>
              </button>

              {/* Primary Surge vs Reset Toggle */}
              {simulationState === 'normal' ? (
                <button
                  onClick={simulateDemandSurge}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-orbit hover:bg-orbit-hover text-white rounded text-xs font-mono font-medium tracking-wide transition-all shadow-sm active:scale-95"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>SIMULATE SURGE</span>
                </button>
              ) : (
                <button
                  onClick={resetSimulation}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-surface border border-border-strong hover:bg-surface-subtle text-primary rounded text-xs font-mono font-medium tracking-wide transition-all active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-secondary" />
                  <span>RESET SANDBOX</span>
                </button>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* MODE 3: AUDIT & SYSTEM LOGIC CLUSTER */}
          {/* ==================================================== */}
          {commandMode === 'audit' && (
            <div className="flex items-center gap-2 animate-in fade-in duration-200">
              {/* Explainable Decision Rules */}
              <button
                onClick={() => setShowEngineModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-border rounded text-xs font-mono text-secondary hover:text-primary hover:bg-surface-subtle transition-colors shadow-xs"
                title="Open 10 deterministic capacity modeling rules"
              >
                <Cpu className="w-3.5 h-3.5 text-orbit" />
                <span>DECISION RULES</span>
              </button>

              {/* AI Confidence Weights Popover Trigger */}
              <div className="relative">
                <button
                  onClick={() => setShowWeightsPopover(!showWeightsPopover)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded text-xs font-mono transition-colors shadow-xs font-semibold"
                  title="View deterministic model formula weights"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>CONFIDENCE WEIGHTS</span>
                </button>

                {showWeightsPopover && (
                  <div className="absolute right-0 mt-2 w-72 p-3 bg-white border border-border rounded-lg shadow-xl z-50 text-xs font-mono space-y-2 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between border-b border-border pb-1.5 text-secondary font-bold">
                      <span>TELEMETRY WEIGHTS</span>
                      <span className="text-safe">91% CONFIDENCE</span>
                    </div>
                    <div className="space-y-1 text-primary">
                      <div className="flex justify-between">
                        <span>Crowd Density (Zone A):</span>
                        <span className="font-bold">40%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Transit Corridors:</span>
                        <span className="font-bold">25%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hotel Saturation:</span>
                        <span className="font-bold">20%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Venue Gate Ingress:</span>
                        <span className="font-bold">15%</span>
                      </div>
                    </div>
                    <div className="pt-1.5 border-t border-border text-[10px] text-secondary">
                      Formula: P = 0.40(C) + 0.25(T) + 0.20(H) + 0.15(V)
                    </div>
                  </div>
                )}
              </div>

              {/* Post-Event SITREP Log Briefing */}
              <button
                onClick={() => setShowSitrepModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-primary text-white hover:bg-neutral-800 rounded text-xs font-mono font-medium transition-colors shadow-xs"
                title="Export official Situation Report for municipal authorities"
              >
                <FileText className="w-3.5 h-3.5 text-white" />
                <span>SITREP LOGS</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Mode-Specific Context Ribbon / Sub-Bar */}
      {commandMode === 'sandbox' && (
        <div className="px-5 py-1.5 bg-amber-50/80 border-t border-amber-200/60 flex items-center justify-between text-xs font-mono text-amber-900 animate-in slide-in-from-top-1 duration-150">
          <div className="flex items-center gap-2">
            <span className="font-bold uppercase flex items-center gap-1">
              <FlaskConical className="w-3.5 h-3.5 text-amber-700" />
              <span>WHAT-IF SCENARIO TESTING ACTIVE:</span>
            </span>
            <span className="text-amber-800/90 hidden sm:inline">
              Simulate edge-case disruptions without impacting real-world municipal dispatch channels.
            </span>
          </div>

          <div className="flex items-center gap-3">
            {telemetryOverrides && (
              <span className="text-[11px] font-bold text-amber-700 underline cursor-pointer" onClick={resetTelemetryOverrides}>
                Reset Overrides
              </span>
            )}
            <span className="text-[11px] text-amber-700">
              Active Arena: <strong>{currentEvent.venueName}</strong>
            </span>
          </div>
        </div>
      )}

      {commandMode === 'audit' && (
        <div className="px-5 py-1.5 bg-indigo-50/80 border-t border-indigo-200/60 flex items-center justify-between text-xs font-mono text-indigo-950 animate-in slide-in-from-top-1 duration-150">
          <div className="flex items-center gap-2">
            <span className="font-bold uppercase flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-indigo-700" />
              <span>DETERMINISTIC COMPLIANCE AUDIT:</span>
            </span>
            <span className="text-indigo-800/90 hidden sm:inline">
              10 Explainable decision rules verified • Zero black-box hallucinations.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowEngineModal(true)}
              className="text-[11px] font-bold text-indigo-700 underline hover:text-indigo-900"
            >
              View Formula Logic →
            </button>
          </div>
        </div>
      )}

      {/* Mobile Stage Switcher for small screens */}
      <div className="md:hidden px-4 py-2 border-t border-border bg-surface-subtle flex items-center justify-around text-xs font-mono">
        <button
          onClick={() => setCommandMode('live')}
          className={`px-2.5 py-1 rounded ${
            commandMode === 'live' ? 'bg-white shadow-xs font-bold text-emerald-800' : 'text-secondary'
          }`}
        >
          Live Ops
        </button>
        <button
          onClick={() => setCommandMode('sandbox')}
          className={`px-2.5 py-1 rounded ${
            commandMode === 'sandbox' ? 'bg-white shadow-xs font-bold text-amber-800' : 'text-secondary'
          }`}
        >
          Sandbox
        </button>
        <button
          onClick={() => setCommandMode('audit')}
          className={`px-2.5 py-1 rounded ${
            commandMode === 'audit' ? 'bg-white shadow-xs font-bold text-indigo-800' : 'text-secondary'
          }`}
        >
          Audit
        </button>
      </div>
    </div>
  );
};
