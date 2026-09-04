import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { PREDICTION_TIMELINES } from '../../data/mockData';
import { TrendingUp, ShieldCheck } from 'lucide-react';

export const PredictionChart: React.FC = () => {
  const { simulationState, currentEvent } = useApp();

  // Scale projected visitors dynamically according to current arena's expected attendance
  const scale = currentEvent.expectedAttendance / 82500;
  const data = PREDICTION_TIMELINES[simulationState].map((item) => ({
    ...item,
    projectedVisitors: Math.round(item.projectedVisitors * scale),
  }));

  const isSurge = simulationState === 'surge';
  const isOptimized = simulationState === 'optimized';

  return (
    <div className="bg-surface border border-border rounded-md p-5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-border pb-3 mb-3">
        <div>
          <span className="text-[11px] font-mono tracking-wider uppercase text-secondary block">
            Time-Series Projection
          </span>
          <h3 className="text-sm font-semibold tracking-tight text-primary">
            NEXT 30 MINUTES
          </h3>
          <p className="text-xs text-secondary mt-0.5">
            Projected crowd concentration
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono uppercase tracking-wider text-secondary block">
            CONFIDENCE
          </span>
          <span className="text-sm font-mono font-bold text-primary">
            91%
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-44 my-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 12, right: 12, left: -22, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EAEAE5" vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={{ stroke: '#E4E4E0' }}
              tick={{ fill: '#6B6B67', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
            />
            <YAxis
              domain={[30, 100]}
              tickLine={false}
              axisLine={{ stroke: '#E4E4E0' }}
              tick={{ fill: '#6B6B67', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
              unit="%"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-surface border border-border p-2 rounded shadow-sm text-xs font-mono">
                      <div className="text-secondary uppercase">{item.label}</div>
                      <div className="text-primary font-bold">
                        {item.load}% Concentration
                      </div>
                      <div className="text-[11px] text-secondary">
                        ~{item.projectedVisitors.toLocaleString()} attendees
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine y={80} stroke="#C65D2E" strokeDasharray="3 3" strokeWidth={1} />
            <Line
              type="monotone"
              dataKey="load"
              stroke={isSurge ? '#B83232' : isOptimized ? '#247A52' : '#315CFF'}
              strokeWidth={2.5}
              dot={{
                r: 4,
                fill: '#FFFFFF',
                stroke: isSurge ? '#B83232' : isOptimized ? '#247A52' : '#315CFF',
                strokeWidth: 2,
              }}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Insight */}
      <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          {isSurge ? (
            <TrendingUp className="w-3.5 h-3.5 text-critical shrink-0" />
          ) : (
            <ShieldCheck className="w-3.5 h-3.5 text-safe shrink-0" />
          )}
          <span className="text-primary font-medium">
            {isOptimized
              ? 'Peak curve successfully flattened via distributed arrivals.'
              : 'Crowd concentration is expected to peak around 7:00 PM.'}
          </span>
        </div>
        <span className="text-secondary font-mono text-[11px] shrink-0">
          Peak: {isSurge ? '96%' : isOptimized ? '67%' : '54%'}
        </span>
      </div>
    </div>
  );
};
