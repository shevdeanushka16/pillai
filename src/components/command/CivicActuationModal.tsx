import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Volume2,
  Radio,
  Smartphone,
  AlertTriangle,
  Play,
  Square,
  ShieldCheck,
} from 'lucide-react';

export const CivicActuationModal: React.FC = () => {
  const {
    showActuationModal,
    setShowActuationModal,
    currentEvent,
    simulationState,
    actions,
  } = useApp();

  const [selectedLang, setSelectedLang] = useState<'en' | 'hi' | 'mr'>('en');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!showActuationModal) return null;

  const divertActive =
    simulationState === 'optimized' || actions.find((a) => a.id === 'divert-arrivals')?.applied;
  const isSurge = simulationState === 'surge' && !divertActive;

  // Multilingual notification copy
  const getCellBroadcastText = () => {
    if (divertActive) {
      if (selectedLang === 'hi') {
        return `[नागरिक सुरक्षा चेतावनी]: ${currentEvent.venueName} के ${currentEvent.primaryGate} पर भीड़ है। कृपया त्वरित प्रवेश हेतु ${currentEvent.shuttleRoute} लेकर ${currentEvent.alternateGate} पर जाएं।`;
      }
      if (selectedLang === 'mr') {
        return `[नागरी सुरक्षा इशारा]: ${currentEvent.venueName} च्या ${currentEvent.primaryGate} वर मोठी गर्दी आहे. जलद प्रवेशासाठी कृपया ${currentEvent.shuttleRoute} ने ${currentEvent.alternateGate} कडे जावे.`;
      }
      return `[CIVIC TRANSIT ALERT]: ${currentEvent.primaryGate} at ${currentEvent.venueName} is approaching capacity. Proceed to ${currentEvent.alternateGate} via ${currentEvent.shuttleRoute} for expedited fast-track entry. Shuttle passes are complimentary.`;
    }

    if (isSurge) {
      if (selectedLang === 'hi') {
        return `[यातायात चेतावनी]: ${currentEvent.highwayCorridor} पर 40 मिनट का विलंब। कृपया मेट्रो लाइन 1 का उपयोग करें।`;
      }
      if (selectedLang === 'mr') {
        return `[वाहतूक इशारा]: ${currentEvent.highwayCorridor} वर 40 मिनिटांचा विलंब आहे. कृपया मेट्रोचा वापर करावा.`;
      }
      return `[TRAFFIC CONGESTION ALERT]: Severe vehicular delays (40+ min) on ${currentEvent.highwayCorridor}. Event attendees are advised to use Metro and Standby Shuttles.`;
    }

    return `[CIVIC ADVISORY]: Welcome to ${currentEvent.title}. All gates and transit corridors are flowing normally. Follow designated perimeter marshals.`;
  };

  // Text-To-Speech Audio Announcement
  const handlePlayAudio = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const textToSpeak = divertActive
      ? `Attention all attendees arriving at ${currentEvent.venueName}. ${currentEvent.primaryGate} turnstiles are currently under heavy load. Please divert immediately to ${currentEvent.alternateGate} via the complimentary ${currentEvent.shuttleRoute} for zero queue wait.`
      : isSurge
      ? `Caution to all inbound motorists on ${currentEvent.highwayCorridor}. Heavy traffic congestion detected. Please switch to elevated metro transit.`
      : `Welcome to ${currentEvent.title}. All gates and transit corridors are operating normally. Please keep your digital pass ready for turnstile scanning.`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsPlayingAudio(false);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-border rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-orbit/10 text-orbit flex items-center justify-center">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-primary font-mono tracking-tight">
                  CIVIC ACTUATION & BROADCAST MATRIX
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orbit text-white flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  4 CHANNELS ACTIVE
                </span>
              </div>
              <p className="text-xs text-secondary mt-0.5 font-mono">
                Real-world multi-channel communications for 90,000+ venue attendees and highway motorists
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (isPlayingAudio && typeof window !== 'undefined') {
                window.speechSynthesis.cancel();
              }
              setShowActuationModal(false);
            }}
            className="p-1.5 rounded-md text-secondary hover:text-primary hover:bg-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channels Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Channel 1: Highway Variable Message Signs (VMS) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-secondary font-medium uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>CHANNEL 01 • HIGHWAY VARIABLE MESSAGE SIGNS (VMS)</span>
              </span>
              <span className="text-secondary text-[11px]">
                3 LED Gantries Active on {currentEvent.highwayCorridor}
              </span>
            </div>

            {/* Retro Amber LED Dot-Matrix Billboard Visual */}
            <div className="bg-neutral-950 border-4 border-neutral-800 rounded-lg p-5 shadow-inner">
              <div className="font-mono text-center tracking-widest uppercase space-y-1.5 text-amber-400 font-bold select-none text-xs sm:text-sm md:text-base drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]">
                {divertActive ? (
                  <>
                    <div className="text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.7)]">
                      [ {currentEvent.primaryGate.toUpperCase()} SATURATED • USE {currentEvent.alternateGate.toUpperCase()} ]
                    </div>
                    <div>{currentEvent.shuttleRoute.toUpperCase()} ACTIVE • FREE PARKING AT HUB</div>
                  </>
                ) : isSurge ? (
                  <>
                    <div className="text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.7)]">
                      [ {currentEvent.highwayCorridor.toUpperCase()} DELAY 42 MIN • AVOID ]
                    </div>
                    <div>TAKE METRO TRANSIT OR {currentEvent.shuttleRoute.toUpperCase()}</div>
                  </>
                ) : (
                  <>
                    <div>[ {currentEvent.venueName.toUpperCase()} • INGRESS NORMAL ]</div>
                    <div>FOLLOW SIGNS TO DESIGNATED PARKING BAYS</div>
                  </>
                )}
              </div>
            </div>
            <span className="text-[10px] font-mono text-secondary block">
              Auto-dispatched via Municipal Traffic Police ITS API • Refresh interval: 10s
            </span>
          </div>

          {/* Grid for Channels 2 & 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Channel 2: Geofenced Cell Broadcast */}
            <div className="bg-surface border border-border rounded-xl p-4 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-secondary font-medium uppercase flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-orbit" />
                    <span>CHANNEL 02 • GEOFENCED CELL BROADCAST</span>
                  </span>

                  {/* Language Selector */}
                  <div className="flex gap-1 text-[10px] font-mono">
                    <button
                      onClick={() => setSelectedLang('en')}
                      className={`px-1.5 py-0.5 rounded ${
                        selectedLang === 'en' ? 'bg-primary text-white font-bold' : 'text-secondary'
                      }`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => setSelectedLang('hi')}
                      className={`px-1.5 py-0.5 rounded ${
                        selectedLang === 'hi' ? 'bg-primary text-white font-bold' : 'text-secondary'
                      }`}
                    >
                      HI
                    </button>
                    <button
                      onClick={() => setSelectedLang('mr')}
                      className={`px-1.5 py-0.5 rounded ${
                        selectedLang === 'mr' ? 'bg-primary text-white font-bold' : 'text-secondary'
                      }`}
                    >
                      MR
                    </button>
                  </div>
                </div>

                {/* Smartphone Lockscreen Alert Mockup */}
                <div className="p-3.5 rounded-lg border border-border bg-white shadow-xs space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-secondary">
                    <span className="font-bold text-rose-600 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>EMERGENCY TRANSIT NOTICE</span>
                    </span>
                    <span>5.0 km Geofence</span>
                  </div>
                  <p className="text-xs text-primary leading-relaxed">
                    {getCellBroadcastText()}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-[10px] font-mono text-secondary">
                <span>REACH: ~84,000 ACTIVE SIMS</span>
                <span className="text-safe font-bold">STATUS: BROADCASTING</span>
              </div>
            </div>

            {/* Channel 3: Public Address (PA) Audio Broadcast with TTS */}
            <div className="bg-surface border border-border rounded-xl p-4 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-secondary font-medium uppercase flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-safe" />
                    <span>CHANNEL 03 • SYNTHESIZED PA ANNOUNCER</span>
                  </span>
                  <span className="text-[10px] font-mono text-safe font-bold">AUDIO READY</span>
                </div>

                <div className="p-3.5 rounded-lg border border-border bg-slate-950 text-slate-100 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>VENUE & TRANSIT CONCOURSE SPEAKERS</span>
                    <span className="flex items-center gap-1 text-orbit">
                      <span className="w-1.5 h-1.5 rounded-full bg-orbit animate-pulse" />
                      TTS ENGINE
                    </span>
                  </div>

                  {/* Animated Waveform Visualizer */}
                  <div className="h-8 flex items-center justify-center gap-1 py-1">
                    {[12, 24, 16, 32, 20, 28, 14, 30, 22, 16, 26, 18, 30, 14, 22, 16].map((h, i) => (
                      <div
                        key={i}
                        className={`w-1 rounded-full transition-all duration-200 ${
                          isPlayingAudio ? 'bg-safe animate-pulse' : 'bg-slate-700'
                        }`}
                        style={{ height: isPlayingAudio ? `${Math.max(6, (h * (i % 3 + 1)) % 32)}px` : '6px' }}
                      />
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-300 italic">
                    "{divertActive
                      ? 'Gate A is crowded. Proceed to Gate C via Route 3 Shuttle.'
                      : isSurge
                      ? 'Heavy highway congestion. Switch to Metro transit.'
                      : 'All gates operating normally. Keep passes ready.'}"
                  </p>
                </div>
              </div>

              {/* Audio Play Trigger Button */}
              <div className="pt-2 border-t border-border flex items-center justify-between">
                <button
                  onClick={handlePlayAudio}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-mono font-medium transition-all ${
                    isPlayingAudio
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-safe hover:bg-safe/90 text-white shadow-xs'
                  }`}
                >
                  {isPlayingAudio ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>STOP AUDIO</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>PLAY AUDIO BROADCAST</span>
                    </>
                  )}
                </button>

                <span className="text-[10px] font-mono text-secondary">
                  Browser SpeechSynthesis API
                </span>
              </div>
            </div>
          </div>

          {/* Channel 4: Digital Mobile Pass Channel Link */}
          <div className="p-3.5 bg-surface-subtle border border-border rounded-lg flex items-center justify-between text-xs font-mono text-secondary">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-safe animate-pulse" />
              <span>CHANNEL 04 • MOBILE ATTENDEE DIGITAL PASSES (QR WALLET)</span>
            </div>
            <span className="text-primary font-bold">SYNCHRONIZED (0.05s LATENCY)</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border bg-surface-subtle flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-secondary">
            <ShieldCheck className="w-4 h-4 text-safe" />
            <span>DISPATCH PROTOCOL: AUTOMATIC BROADCAST READY</span>
          </div>

          <button
            onClick={() => {
              if (isPlayingAudio && typeof window !== 'undefined') {
                window.speechSynthesis.cancel();
              }
              setShowActuationModal(false);
            }}
            className="px-5 py-1.5 bg-primary text-white rounded text-xs font-mono hover:bg-neutral-800 transition-colors"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
};
