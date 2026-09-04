import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  X,
  Sparkles,
  Volume2,
  VolumeX,
  Minimize2,
  Maximize2,
  Mic,
  ShieldCheck,
  AlertTriangle,
  Radio,
  Smartphone,
  Layers,
  FileText,
} from 'lucide-react';

interface DemoStep {
  step: number;
  badge: string;
  title: string;
  icon: React.ReactNode;
  duration: number; // in seconds
  actionSummary: string;
  pitchScript: string;
  judgeTakeaway: string;
  applyStep: (app: ReturnType<typeof useApp>) => void;
}

export const AutoPilotDemoDirector: React.FC = () => {
  const app = useApp();
  const {
    isAutoPilotRunning,
    setIsAutoPilotRunning,
    addToast,
  } = app;

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(14);
  const [minimized, setMinimized] = useState<boolean>(false);
  const [audioVoiceEnabled, setAudioVoiceEnabled] = useState<boolean>(true);
  const hasSpokenAudioRef = useRef<boolean>(false);

  const steps: DemoStep[] = [
    {
      step: 1,
      badge: 'PHASE 01/07 • BASELINE TELEMETRY',
      title: 'Command Center & Normal Baseline Telemetry',
      icon: <ShieldCheck className="w-4 h-4 text-safe" />,
      duration: 14,
      actionSummary: 'Resetting to normal state • BKC Arena Concert • 82,500 attendees • Pressure Score: 48/100 (Safe)',
      pitchScript:
        '"Judges, welcome to ORBIT. In major urban events, city agencies operate in isolated silos, causing fatal blindspots. Here is our live Command Overview for an 82,000-person concert at BKC Arena. Every gate turnstile, metro corridor, and hotel cluster streams real-time telemetry into our Sense-Predict engine with a stable pressure score of 48/100."',
      judgeTakeaway: 'Notice how the vector schematic map visualizes the arterial highway, metro line, and turnstile gates.',
      applyStep: (a) => {
        a.setActivePage('command');
        a.switchEvent('bkc-concert');
        a.resetSimulation();
        a.setShowCopilotDrawer(false);
        a.setShowMobilePassModal(false);
        a.setShowActuationModal(false);
        a.setShowSitrepModal(false);
        a.setSelectedMapNode('arena');
        setTimeout(() => a.setSelectedMapNode(null), 3500);
      },
    },
    {
      step: 2,
      badge: 'PHASE 02/07 • INGRESS CRISIS TRIGGERED',
      title: 'Ingress Bottleneck & Gate Saturation',
      icon: <AlertTriangle className="w-4 h-4 text-critical animate-pulse" />,
      duration: 14,
      actionSummary: 'Simulating 12,000 fan arrival rush • Gate A saturation 92% • Wait time: 28 min • Pressure: 88 (CRITICAL)',
      pitchScript:
        '"Now watch what happens when an unexpected rush arrives: 12,000 attendees flood Highway Route 1. Notice how Gate A turnstiles instantly turn crimson red — queue wait times explode to 28 minutes, and our overall pressure score spikes to 88 (CRITICAL). In uncoordinated venues, this is the exact moment crowd crushes and stampedes begin."',
      judgeTakeaway: 'The AI immediately classifies this as CRITICAL STRAIN and computes a multi-gate friction imbalance.',
      applyStep: (a) => {
        a.setActivePage('command');
        a.setShowCopilotDrawer(false);
        a.setShowMobilePassModal(false);
        a.setShowActuationModal(false);
        a.setShowSitrepModal(false);
        a.simulateDemandSurge();
        a.setSelectedMapNode('gate-a');
      },
    },
    {
      step: 3,
      badge: 'PHASE 03/07 • AI COPILOT REASONING',
      title: 'AI Incident Commander & Agentic Action Dispatch',
      icon: <Sparkles className="w-4 h-4 text-purple-600 animate-spin" />,
      duration: 15,
      actionSummary: 'Opening AI Copilot Drawer • AI calculates queue dissipation • Proposes Gate A to Gate C shuttle diversion',
      pitchScript:
        '"Instead of confusion and slow radio calls, ORBIT\'s AI Incident Commander immediately analyzes the situation. It detects that North Gate C currently has 14 empty turnstiles with zero wait time. The AI formulates an agentic mitigation plan: divert arrivals to Gate C and dispatch Route 3 electric shuttles."',
      judgeTakeaway: 'The AI is agentic: it does not just output text advice, it generates clickable, executable operational buttons.',
      applyStep: (a) => {
        a.setSelectedMapNode(null);
        a.setShowMobilePassModal(false);
        a.setShowActuationModal(false);
        a.setShowSitrepModal(false);
        a.setShowCopilotDrawer(true);
      },
    },
    {
      step: 4,
      badge: 'PHASE 04/07 • REAL-TIME MOBILE QR SYNC',
      title: 'Attendee Experience & Live Mobile Pass Sync',
      icon: <Smartphone className="w-4 h-4 text-orbit animate-bounce" />,
      duration: 15,
      actionSummary: 'Opening Mobile Ticket Emulator • Action 01 Applied • Pass receives 50ms SSE push & switches to Gate C',
      pitchScript:
        '"How do visitors know where to go? Look at the attendee\'s smartphone ticket. The split-second the commander triggers the diversion, the attendee\'s pass vibrates with haptic feedback, turns green, and routes them to Gate C with a fast-track scanning barcode. No app download needed — it works instantly over web QR with sub-50ms sync!"',
      judgeTakeaway: 'The pass is synchronized via Server-Sent Events (SSE) and LocalStorage across devices in real-time.',
      applyStep: (a) => {
        a.setShowCopilotDrawer(false);
        a.setShowActuationModal(false);
        a.setShowSitrepModal(false);
        a.setShowMobilePassModal(true);
        // Apply diversion action
        const divertAction = a.actions.find((item) => item.id === 'divert-arrivals');
        if (divertAction && !divertAction.applied) {
          a.toggleAction('divert-arrivals');
        }
      },
    },
    {
      step: 5,
      badge: 'PHASE 05/07 • MULTI-CHANNEL CIVIC ACTUATION',
      title: 'Highway VMS Billboards, Push Alerts & Audio PA',
      icon: <Radio className="w-4 h-4 text-safe animate-pulse" />,
      duration: 16,
      actionSummary: 'Launching Civic Actuation Deck • Amber LED Gantry active • Multilingual cell broadcast • PA Voice speaking',
      pitchScript:
        '"Judges often ask: \'What about the 50,000 fans who aren\'t looking at their phone?\' ORBIT actuates the physical city: highway LED billboards alert drivers 5 km before the bottleneck, geofenced cell broadcasts notify local cell towers in English and Hindi, and the venue\'s PA system speaks crowd instructions aloud!"',
      judgeTakeaway: 'Listen to the audio announcement synthesized live through your laptop speakers.',
      applyStep: (a) => {
        a.setShowMobilePassModal(false);
        a.setShowCopilotDrawer(false);
        a.setShowSitrepModal(false);
        a.setShowActuationModal(true);

        // Optionally play spoken audio
        if (audioVoiceEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window && !hasSpokenAudioRef.current) {
          hasSpokenAudioRef.current = true;
          window.speechSynthesis.cancel();
          const msg = new SpeechSynthesisUtterance(
            'Attention all attendees arriving at BKC Arena. Gate A turnstiles are heavily congested. Please divert to Gate C via complimentary Route 3 shuttles.'
          );
          msg.rate = 0.95;
          window.speechSynthesis.speak(msg);
        }
      },
    },
    {
      step: 6,
      badge: 'PHASE 06/07 • DYNAMIC MULTI-ARENA SCALABILITY',
      title: 'Instant Multi-Venue Adaptability (Wankhede Derby)',
      icon: <Layers className="w-4 h-4 text-orbit" />,
      duration: 15,
      actionSummary: 'Morphing system from BKC Arena to Wankhede Cricket Derby • Gates adapt to Vinoo Mankad & Garware Stand',
      pitchScript:
        '"ORBIT is completely venue-agnostic. With a single click, we switch from a 82,000-person music festival to a 33,000-capacity cricket derby at Wankhede Stadium. Notice how the map outline, the gate turnstiles (Vinoo Mankad vs Garware Stand), the transit origins, and the police dispatch protocols instantly morph to fit the new arena."',
      judgeTakeaway: 'Proves to the jury that the software is a plug-and-play platform ready for any stadium, expo, or custom ground.',
      applyStep: (a) => {
        a.setShowActuationModal(false);
        a.setShowMobilePassModal(false);
        a.setShowCopilotDrawer(false);
        a.setShowSitrepModal(false);
        a.switchEvent('wankhede-derby');
        a.setActivePage('visitor');
      },
    },
    {
      step: 7,
      badge: 'PHASE 07/07 • EQUILIBRIUM RESTORED & SITREP',
      title: 'Peak Curve Flattened & Command SITREP Signoff',
      icon: <FileText className="w-4 h-4 text-safe" />,
      duration: 16,
      actionSummary: 'Applying all mitigation actions • Pressure score drops to 64 • Ingress curve flattened • SITREP briefing generated',
      pitchScript:
        '"In under 90 seconds, the ingress curve is flattened, turnstile queues drop by 68%, and the event commander exports an official Situation Report for Mumbai Police and transit authorities. That is how ORBIT transforms catastrophic crowd emergencies into synchronized urban equilibrium."',
      judgeTakeaway: 'The SITREP report is one-click exportable for municipal emergency commanders and field commissioners.',
      applyStep: (a) => {
        a.setActivePage('command');
        a.applyAllActions();
        a.setShowCopilotDrawer(false);
        a.setShowMobilePassModal(false);
        a.setShowActuationModal(false);
        setTimeout(() => {
          a.setShowSitrepModal(true);
        }, 800);
      },
    },
  ];

  // Execute step on change
  useEffect(() => {
    if (!isAutoPilotRunning) return;
    const current = steps[currentStep];
    if (current) {
      current.applyStep(app);
      setSecondsLeft(current.duration);
    }
  }, [currentStep, isAutoPilotRunning]);

  // Countdown timer loop
  useEffect(() => {
    if (!isAutoPilotRunning || isPaused) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Advance to next step or loop/finish
          if (currentStep < steps.length - 1) {
            setCurrentStep((s) => s + 1);
            return steps[currentStep + 1].duration;
          } else {
            // End of demo
            addToast('🎉 Auto-Pilot Presentation Complete! Great job presenting ORBIT.', 'success');
            setIsPaused(true);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAutoPilotRunning, isPaused, currentStep]);

  if (!isAutoPilotRunning) return null;

  const active = steps[currentStep];
  const timeProgressPercent = Math.max(
    0,
    Math.min(100, ((active.duration - secondsLeft) / active.duration) * 100)
  );

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setCurrentStep(0);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setIsPaused(false);
    hasSpokenAudioRef.current = false;
  };

  const handleStop = () => {
    setIsAutoPilotRunning(false);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    app.setShowSitrepModal(false);
    app.setShowMobilePassModal(false);
    app.setShowActuationModal(false);
    app.setShowCopilotDrawer(false);
  };

  return (
    <aside aria-label="Auto-Pilot Demo Controller" className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-neutral-900 border-2 border-amber-500/80 rounded-xl text-white overflow-hidden backdrop-blur-md">
        {/* Top Segmented Progress Bar */}
        <div className="flex w-full h-1.5 bg-neutral-800">
          {steps.map((s, idx) => (
            <div
              key={s.step}
              className={`flex-1 transition-all border-r border-neutral-900 ${
                idx < currentStep
                  ? 'bg-safe'
                  : idx === currentStep
                  ? 'bg-amber-400'
                  : 'bg-neutral-800'
              }`}
            />
          ))}
        </div>

        {/* Header Bar */}
        <div className="px-4 py-2.5 bg-neutral-950/90 border-b border-neutral-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-mono text-xs font-bold border border-amber-500/40">
              {currentStep + 1}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                {active.badge}
              </span>
              <span className="hidden sm:inline-block text-neutral-600">•</span>
              <span className="hidden sm:inline-block text-xs font-mono text-neutral-300 font-semibold truncate max-w-md">
                {active.title}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Timer Badge */}
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-neutral-800 text-[11px] font-mono text-neutral-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>{isPaused ? 'PAUSED' : `${secondsLeft}s`}</span>
            </div>

            {/* Audio Voice Announce Toggle */}
            <button
              onClick={() => setAudioVoiceEnabled(!audioVoiceEnabled)}
              title={audioVoiceEnabled ? 'Speech voice enabled' : 'Speech voice muted'}
              className={`p-1.5 rounded text-xs transition-colors ${
                audioVoiceEnabled ? 'text-safe hover:bg-neutral-800' : 'text-neutral-500 hover:bg-neutral-800'
              }`}
            >
              {audioVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Minimize / Maximize */}
            <button
              onClick={() => setMinimized(!minimized)}
              title={minimized ? 'Expand pitch script' : 'Minimize to compact dock'}
              className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              {minimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>

            {/* Exit Demo */}
            <button
              onClick={handleStop}
              title="Exit Auto-Pilot Demo Mode"
              className="p-1.5 rounded text-rose-400 hover:bg-rose-950/50 hover:text-rose-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Collapsible Content Area */}
        {!minimized && (
          <div className="p-4 space-y-3 bg-neutral-900/95">
            {/* Live Automated Action Performed */}
            <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded bg-neutral-800/80 border border-neutral-700/60 text-amber-200">
              <span className="shrink-0">{active.icon}</span>
              <span className="text-[11px] font-bold uppercase text-amber-400">SYSTEM ACTION:</span>
              <span className="truncate">{active.actionSummary}</span>
            </div>

            {/* Script Box for the Presenter */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3.5 relative overflow-hidden group">
              <div className="flex items-center justify-between text-[11px] font-mono mb-1.5 text-neutral-400">
                <span className="font-bold flex items-center gap-1.5 text-amber-400 uppercase">
                  <Mic className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>WHAT TO SAY TO JUDGES (PITCH SCRIPT):</span>
                </span>
                <span className="text-[10px] text-neutral-500">
                  Read aloud or paraphrase
                </span>
              </div>
              <p className="text-sm sm:text-base text-neutral-100 font-serif leading-relaxed italic select-text">
                {active.pitchScript}
              </p>
              <div className="mt-2 pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                <span className="text-safe flex items-center gap-1">
                  <span>★ JUDGE KEY FOCUS:</span>
                  <span className="text-neutral-300 not-italic">{active.judgeTakeaway}</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Step-Specific Timer Micro-Progress */}
        <div className="w-full h-1 bg-neutral-800">
          <div
            className="h-full bg-amber-500 transition-all duration-1000 ease-linear"
            style={{ width: `${timeProgressPercent}%` }}
          />
        </div>

        {/* Bottom Control Bar */}
        <div className="px-4 py-2 bg-neutral-950 flex items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed text-neutral-200 transition-colors"
            >
              <SkipBack className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PREV</span>
            </button>

            <button
              onClick={() => setIsPaused(!isPaused)}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold transition-all shadow-sm"
            >
              {isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>RESUME</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>PAUSE</span>
                </>
              )}
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
            >
              <span className="hidden sm:inline">NEXT</span>
              <SkipForward className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleRestart}
              title="Restart Demo from Step 1"
              className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors ml-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-neutral-400">
              Phase <span className="text-amber-400 font-bold">{currentStep + 1}</span> of {steps.length}
            </span>
            <button
              onClick={handleStop}
              className="text-neutral-400 hover:text-rose-400 underline transition-colors text-[11px]"
            >
              Exit Auto-Pilot
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
