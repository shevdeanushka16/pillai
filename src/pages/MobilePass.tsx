import React, { useState, useEffect } from 'react';
import {
  Bus,
  Sparkles,
  MapPin,
  QrCode,
  AlertTriangle,
} from 'lucide-react';
import type { SyncPayload } from '../utils/syncService';
import { subscribeToSync } from '../utils/syncService';

export const MobilePass: React.FC = () => {
  const [syncData, setSyncData] = useState<SyncPayload>({
    type: 'ORBIT_SYNC_UPDATE',
    simulationState: 'normal',
    simulatedTime: '6:42 PM',
    divertActive: false,
    shuttleActive: false,
    staysActive: false,
    flattenActive: false,
    pressureScore: 55,
    riskLevel: 'MODERATE',
    attendeeGate: 'Gate A',
    attendeeRoute: 'Route 1 (Highway Corridor)',
    gateQueueMin: 6,
    fastTrackVoucher: false,
    timestamp: 0,
  });

  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'reconnecting' | 'offline'>('connected');
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToSync(
      (newPayload) => {
        setSyncData((prev) => {
          // Detect transition to surge or diversion
          if (
            (!prev.divertActive && newPayload.divertActive) ||
            (prev.simulationState === 'normal' && newPayload.simulationState === 'surge')
          ) {
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 6000);

            // Trigger mobile device vibration if supported
            if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
              try {
                navigator.vibrate([200, 100, 200, 100, 300]);
              } catch {
                // Ignore vibration fail
              }
            }
          }
          return newPayload;
        });
      },
      (status) => setConnectionStatus(status)
    );

    return () => unsubscribe();
  }, []);

  const isDiverted = syncData.divertActive || syncData.simulationState === 'optimized';
  const isSurging = syncData.simulationState === 'surge' && !isDiverted;
  const isShuttleActive = syncData.shuttleActive || syncData.simulationState === 'optimized';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-4 sm:p-6 antialiased selection:bg-orbit selection:text-white">
      {/* Real-time Floating Notification Banner */}
      {showNotification && (
        <div className="fixed top-4 left-4 right-4 max-w-md mx-auto z-50 animate-bounce">
          <div
            className={`p-4 rounded-xl shadow-2xl border backdrop-blur-md flex items-start gap-3 ${
              isDiverted
                ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-100'
                : 'bg-rose-950/90 border-rose-500/50 text-rose-100'
            }`}
          >
            {isDiverted ? (
              <Sparkles className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 text-xs sm:text-sm">
              <strong className="block font-semibold">
                {isDiverted ? '⚡ AUTOMATIC DIVERSION ACTIVATED' : '⚠️ HIGH CONGESTION ALERT'}
              </strong>
              <span>
                {isDiverted
                  ? 'Your entry is upgraded to Gate C Fast-Track. Shuttle Route 3 transit pass unlocked!'
                  : 'Gate A queue is 94% saturated. Standby for real-time corridor re-routing.'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Header Container */}
      <header className="w-full max-w-md flex items-center justify-between py-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-orbit flex items-center justify-center font-bold text-white text-xs font-mono">
            OB
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-white">ORBIT PASS</h1>
            <p className="text-[10px] text-slate-400 font-mono">Smart Attendee Companion</p>
          </div>
        </div>

        {/* Real-time Sync Status Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-full text-[11px] font-mono">
          <span
            className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected'
                ? 'bg-emerald-500 animate-pulse'
                : connectionStatus === 'reconnecting'
                ? 'bg-amber-500 animate-ping'
                : 'bg-slate-500'
            }`}
          />
          <span className="text-slate-300">
            {connectionStatus === 'connected' ? 'LIVE SYNC' : 'CONNECTING'}
          </span>
        </div>
      </header>

      {/* Digital Pass Card */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
        {/* Pass Top Banner */}
        <div
          className={`p-5 text-white transition-colors duration-500 ${
            isDiverted
              ? 'bg-gradient-to-r from-emerald-600 to-teal-700'
              : isSurging
              ? 'bg-gradient-to-r from-rose-600 to-amber-700'
              : 'bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider opacity-85">
            <span>{syncData.eventTitle || 'ORBIT ARENA PASS'} • {syncData.city || 'MUMBAI'}</span>
            <span>{syncData.simulatedTime} IST</span>
          </div>

          <div className="mt-3 flex items-end justify-between">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-slate-200 uppercase block">
                TICKET HOLDER • {syncData.venueName || 'MAIN ARENA'}
              </span>
              <h2 className="text-xl font-bold tracking-tight">Alex Rivera</h2>
              <span className="text-xs text-slate-200/90 font-mono">GA TIER 1 • PASS #92,501</span>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono tracking-wider opacity-80 block">ZONE STATUS</span>
              <span
                className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold font-mono uppercase ${
                  isDiverted
                    ? 'bg-emerald-950/60 text-emerald-200 border border-emerald-400/40'
                    : isSurging
                    ? 'bg-rose-950/60 text-rose-200 border border-rose-400/40'
                    : 'bg-slate-950/60 text-slate-300 border border-slate-700'
                }`}
              >
                {isDiverted ? 'OPTIMIZED' : isSurging ? 'CRITICAL SURGE' : 'NORMAL FLOW'}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Gate & Navigation Section */}
        <div className="p-5 space-y-4">
          {/* Main Gate Allocation */}
          <div
            className={`p-4 rounded-xl border transition-all duration-500 ${
              isDiverted
                ? 'bg-emerald-950/30 border-emerald-500/40 shadow-lg shadow-emerald-950/30'
                : isSurging
                ? 'bg-rose-950/30 border-rose-500/40 shadow-lg shadow-rose-950/30'
                : 'bg-slate-950/60 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">CURRENT ASSIGNMENT</span>
              <span
                className={`font-semibold ${
                  isDiverted ? 'text-emerald-400' : isSurging ? 'text-rose-400' : 'text-slate-300'
                }`}
              >
                {isDiverted ? '✓ FAST-TRACK CLEARED' : isSurging ? '⚠️ CONGESTION DELAY' : 'NORMAL INGRESS'}
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-mono block">ASSIGNED ENTRY</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
                    {syncData.attendeeGate || (isDiverted ? 'GATE C' : 'GATE A')}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {isDiverted ? '(Transit Plaza)' : '(Main Concourse)'}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 font-mono block">ESTIMATED WAIT</span>
                <span
                  className={`text-2xl font-bold font-mono ${
                    isDiverted ? 'text-emerald-400' : isSurging ? 'text-rose-400' : 'text-slate-200'
                  }`}
                >
                  {isDiverted ? '2 MIN' : isSurging ? '42 MIN' : `${syncData.gateQueueMin || 6} MIN`}
                </span>
              </div>
            </div>

            {/* Ingress Directive Message */}
            <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-orbit shrink-0 mt-0.5" />
              <span>
                {isDiverted ? (
                  <>
                    <strong className="text-emerald-400">Re-routed via {syncData.attendeeRoute || 'Route 3 Shuttle'}:</strong> Proceed directly to {syncData.attendeeGate || 'Gate C'} fast-track turnstiles.
                  </>
                ) : isSurging ? (
                  <>
                    <strong className="text-rose-400">Severe bottleneck at {syncData.primaryGate || 'Gate A'}:</strong> Over 12,000 attendees queued. Awaiting automated diversion dispatch.
                  </>
                ) : (
                  <>
                    <strong className="text-slate-200">Recommended Corridor:</strong> Proceed via {syncData.attendeeRoute || 'Highway Corridor'} towards {syncData.attendeeGate || 'Gate A'} turnstiles.
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Electric Shuttle Voucher (Dynamic Unlock) */}
          <div
            className={`p-3.5 rounded-xl border transition-all duration-300 flex items-center justify-between ${
              isShuttleActive
                ? 'bg-orbit/10 border-orbit/40 text-orbit-text'
                : 'bg-slate-950/40 border-slate-800 text-slate-500'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  isShuttleActive ? 'bg-orbit text-white shadow-md' : 'bg-slate-800 text-slate-500'
                }`}
              >
                <Bus className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white flex items-center gap-1.5 font-mono">
                  <span>{syncData.attendeeRoute || 'TRANSIT EXPRESS SHUTTLE'}</span>
                  {isShuttleActive && (
                    <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 text-[10px] rounded border border-emerald-500/30">
                      ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  {isShuttleActive ? 'Free transit pass • Next bus: 3 mins' : 'Standby fleet • Inactive'}
                </p>
              </div>
            </div>

            <span className="text-xs font-mono font-medium text-slate-400">
              {isShuttleActive ? 'PASS VALID ✓' : 'STANDBY'}
            </span>
          </div>

          {/* Digital Turnstile Barcode Section */}
          <div className="pt-2 pb-1 text-center bg-slate-950 rounded-xl p-4 border border-slate-800/80">
            <div className="flex items-center justify-center gap-2 mb-2 text-xs font-mono text-slate-400">
              <QrCode className="w-3.5 h-3.5 text-orbit" />
              <span>DIGITAL TURNSTILE PASS</span>
            </div>

            {/* Simulated Vector Barcode */}
            <div className="h-16 w-full flex items-center justify-center gap-[3px] bg-white rounded p-2 overflow-hidden">
              {[4, 2, 6, 1, 3, 5, 2, 7, 2, 4, 1, 5, 3, 6, 2, 4, 1, 6, 3, 2, 5, 4, 2, 7, 1, 3, 5, 2, 6].map(
                (w, i) => (
                  <div
                    key={i}
                    className={`h-full ${i % 2 === 0 ? 'bg-black' : 'bg-transparent'}`}
                    style={{ width: `${w * 1.8}px` }}
                  />
                )
              )}
            </div>

            <p className="mt-2 text-[10px] font-mono tracking-widest text-slate-400 uppercase">
              SCAN AT TURNSTILE {syncData.attendeeGate || (isDiverted ? 'GATE C' : 'GATE A')} PORT 1-12
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="px-5 py-3 bg-slate-950/80 border-t border-slate-800 text-[11px] font-mono text-slate-500 flex items-center justify-between">
          <span>ORBIT SENSE-PREDICT v2.4</span>
          <span>SESSION SYNC: ACTIVE</span>
        </div>
      </div>

      {/* Navigation / Demo Helpers */}
      <div className="w-full max-w-md mt-4 flex items-center justify-between text-xs font-mono text-slate-400">
        <a
          href="/"
          className="hover:text-white flex items-center gap-1 transition-colors underline underline-offset-4"
        >
          <span>← Open Command Center</span>
        </a>

        <span className="text-[11px] text-slate-500">
          Tip: Toggle actions on laptop to see instant sync
        </span>
      </div>
    </div>
  );
};
