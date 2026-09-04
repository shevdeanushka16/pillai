import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Smartphone,
  Copy,
  Check,
  ExternalLink,
  Radio,
} from 'lucide-react';
import { generateQrDataUrl } from '../../utils/qrcode';
import { MobilePass } from '../../pages/MobilePass';

export const MobilePassModal: React.FC = () => {
  const { showMobilePassModal, setShowMobilePassModal } = useApp();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'qr' | 'emulator'>('qr');

  // Determine optimal URL for mobile access
  const mobileUrl = typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.hostname === 'localhost' ? '192.168.31.163' : window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/?mode=pass`
    : '';

  useEffect(() => {
    if (mobileUrl) {
      generateQrDataUrl(mobileUrl).then((dataUrl) => {
        setQrDataUrl(dataUrl);
      });
    }
  }, [mobileUrl]);

  if (!showMobilePassModal) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(mobileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-border rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-orbit/10 text-orbit flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-primary tracking-tight font-mono">
                  LIVE ATTENDEE PASS SYNC
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-safe/10 text-safe border border-safe/30 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-safe animate-pulse" />
                  REAL-TIME SYNC
                </span>
              </div>
              <p className="text-xs text-secondary mt-0.5">
                Scan with any smartphone or inspect the live mobile emulator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View switcher tabs */}
            <div className="flex border border-border rounded-lg p-0.5 bg-white text-xs font-mono">
              <button
                onClick={() => setActiveTab('qr')}
                className={`px-3 py-1 rounded transition-colors ${
                  activeTab === 'qr' ? 'bg-primary text-white font-medium' : 'text-secondary hover:text-primary'
                }`}
              >
                QR Code
              </button>
              <button
                onClick={() => setActiveTab('emulator')}
                className={`px-3 py-1 rounded transition-colors ${
                  activeTab === 'emulator' ? 'bg-primary text-white font-medium' : 'text-secondary hover:text-primary'
                }`}
              >
                Phone Emulator
              </button>
            </div>

            <button
              onClick={() => setShowMobilePassModal(false)}
              className="p-1.5 rounded-md text-secondary hover:text-primary hover:bg-surface transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'qr' ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* QR Code Presentation */}
              <div className="md:col-span-5 flex flex-col items-center text-center p-6 bg-surface-subtle border border-border rounded-xl">
                <div className="bg-white p-3 rounded-lg border border-border shadow-md">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="Scan to open Mobile Attendee Pass"
                      className="w-56 h-56 object-contain"
                    />
                  ) : (
                    <div className="w-56 h-56 flex items-center justify-center text-secondary font-mono text-xs">
                      Generating QR...
                    </div>
                  )}
                </div>

                <span className="mt-3 text-[11px] font-mono uppercase tracking-wider text-secondary">
                  CAMERA SCAN TO CONNECT
                </span>

                <div className="mt-2 text-xs text-primary font-mono font-medium">
                  {mobileUrl}
                </div>
              </div>

              {/* Instructions & Interactive Controls */}
              <div className="md:col-span-7 space-y-5">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-primary">
                    How the Live Cross-Device Actuation Works:
                  </h3>
                  <p className="text-xs text-secondary leading-relaxed">
                    Judges and evaluators can experience ORBIT's closed-loop actuation on their own mobile devices.
                    When the Command Center executes an intervention, the attendee pass dynamically updates without a page refresh.
                  </p>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex items-start gap-3 p-3 bg-surface rounded-lg border border-border">
                    <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                      1
                    </span>
                    <div>
                      <strong className="text-primary block font-sans">Open on Smartphone</strong>
                      <span className="text-secondary text-[11px]">
                        Scan the QR code with an iPhone or Android camera, or open in a second browser window.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-surface rounded-lg border border-border">
                    <span className="w-5 h-5 rounded-full bg-orbit text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                      2
                    </span>
                    <div>
                      <strong className="text-primary block font-sans">Trigger Surge on Laptop</strong>
                      <span className="text-secondary text-[11px]">
                        Click "SIMULATE DEMAND SURGE" on this dashboard. The phone screen alerts the attendee of high congestion at Gate A.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-surface rounded-lg border border-border">
                    <span className="w-5 h-5 rounded-full bg-safe text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                      3
                    </span>
                    <div>
                      <strong className="text-primary block font-sans">Witness Instant Re-routing</strong>
                      <span className="text-secondary text-[11px]">
                        Click "APPLY ALL ACTIONS" (or toggle Gate Diversion). The attendee's pass instantly vibrates, upgrades to Gate C, and issues a Shuttle Route 3 voucher.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct Link Action Bar */}
                <div className="pt-2 flex flex-wrap gap-2.5">
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 px-4 py-2 border border-border rounded-lg text-xs font-mono text-primary hover:bg-surface-subtle transition-colors font-medium"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-safe" /> : <Copy className="w-3.5 h-3.5 text-secondary" />}
                    <span>{copied ? 'COPIED TO CLIPBOARD' : 'COPY PASS URL'}</span>
                  </button>

                  <a
                    href="/?mode=pass"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 bg-orbit hover:bg-orbit-hover text-white rounded-lg text-xs font-mono transition-colors font-medium"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>OPEN PASS IN NEW TAB →</span>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            /* Live Phone Mockup Emulator */
            <div className="flex flex-col items-center justify-center py-2">
              <div className="w-[360px] h-[640px] border-4 border-slate-800 rounded-[36px] overflow-hidden shadow-2xl relative bg-slate-950 flex flex-col">
                {/* Phone Notch */}
                <div className="w-28 h-4 bg-slate-800 rounded-b-xl self-center z-10" />

                {/* Screen content */}
                <div className="flex-1 overflow-y-auto">
                  <MobilePass />
                </div>
              </div>
              <p className="mt-3 text-xs font-mono text-secondary">
                Live Interactive Emulator · Synchronized with Command Center in real time
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border bg-surface-subtle flex items-center justify-between text-xs font-mono text-secondary">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-safe animate-pulse" />
            <span>BROADCAST FREQUENCY: CONTINUOUS PUSH</span>
          </div>

          <button
            onClick={() => setShowMobilePassModal(false)}
            className="px-4 py-1.5 bg-primary text-white rounded text-xs font-mono hover:bg-primary/90 transition-colors"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
};
