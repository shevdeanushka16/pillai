import React from 'react';
import { useApp } from '../../context/AppContext';
import { MetricPill } from './MetricPill';
import { Info } from 'lucide-react';
import { useAnimatedNumber } from '../../utils/useAnimatedNumber';

export const PressureGauge: React.FC = () => {
  const { pressureScore, riskEvaluation, setShowEngineModal } = useApp();
  const animatedScore = useAnimatedNumber(pressureScore, 650);

  // SVG Gauge calculations (Semi-circle or clean 220-degree arc)
  const radius = 64;
  const strokeWidth = 8;
  const normalizedScore = Math.min(100, Math.max(0, pressureScore));
  
  // Circumference of 220 degree arc
  const arcLength = (220 / 360) * 2 * Math.PI * radius;
  const strokeDashoffset = arcLength - (normalizedScore / 100) * arcLength;

  return (
    <div className="bg-surface border border-border rounded-md p-5 flex flex-col justify-between relative">
      <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
        <div>
          <span className="text-[11px] font-mono tracking-wider uppercase text-secondary block">
            Core Metric
          </span>
          <h2 className="text-sm font-semibold tracking-tight text-primary">
            EVENT PRESSURE
          </h2>
        </div>
        <button
          onClick={() => setShowEngineModal(true)}
          className="flex items-center gap-1 text-xs text-secondary hover:text-orbit transition-colors font-mono"
          title="Inspect calculation model"
        >
          <Info className="w-3.5 h-3.5" />
          <span>FORMULA</span>
        </button>
      </div>

      <div className="flex items-center gap-6">
        {/* Calibrated Arc Gauge */}
        <div className="relative flex items-center justify-center shrink-0 w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-110" viewBox="0 0 160 160">
            {/* Background Track */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="#E4E4E0"
              strokeWidth={strokeWidth}
              strokeDasharray={`${arcLength} 999`}
              strokeLinecap="round"
            />
            {/* Active Pressure Arc */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={riskEvaluation.colorHex}
              strokeWidth={strokeWidth}
              strokeDasharray={`${arcLength} 999`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Centered Score */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pt-2">
            <span className="text-4xl font-bold tracking-tight text-primary font-mono transition-all duration-300">
              {animatedScore}
            </span>
            <span className="text-[10px] font-mono text-secondary uppercase -mt-0.5">
              / 100
            </span>
          </div>
        </div>

        {/* Status Context & Description */}
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <MetricPill status={riskEvaluation.level} />
            <span className="text-xs text-secondary font-mono">
              Score: {pressureScore}%
            </span>
          </div>
          <p className="text-sm text-primary font-medium leading-snug">
            {riskEvaluation.description}
          </p>
          
          {/* Threshold markers */}
          <div className="pt-2 border-t border-border/60">
            <div className="flex items-center justify-between text-[10px] font-mono text-secondary mb-1">
              <span>0 (CALM)</span>
              <span>40</span>
              <span>60</span>
              <span>80 (CRITICAL)</span>
            </div>
            <div className="w-full bg-[#EBEBE6] h-1.5 rounded-full overflow-hidden flex">
              <div className="w-[40%] bg-safe/60 h-full border-r border-white/50" />
              <div className="w-[20%] bg-warning/60 h-full border-r border-white/50" />
              <div className="w-[20%] bg-high/60 h-full border-r border-white/50" />
              <div className="w-[20%] bg-critical/60 h-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
