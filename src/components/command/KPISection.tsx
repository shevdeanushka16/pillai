import React from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Bus, Building, ArrowUpRight } from 'lucide-react';
import { useAnimatedNumber } from '../../utils/useAnimatedNumber';

export const KPISection: React.FC = () => {
  const { metrics, simulationState, currentEvent } = useApp();

  const isSurge = simulationState === 'surge';
  const isOptimized = simulationState === 'optimized';

  const animatedVisitors = useAnimatedNumber(metrics.visitors, 650);
  const animatedTransport = useAnimatedNumber(metrics.transportLoad, 600);
  const animatedHotels = useAnimatedNumber(metrics.hotelOccupancy, 600);
  const animatedVenue = useAnimatedNumber(metrics.venueCapacity, 600);

  return (
    <div className="border-y border-border py-4 my-2">
      <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-border">
        {/* Visitors */}
        <div className="px-5 py-2">
          <div className="flex items-center justify-between text-secondary mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider">
              TOTAL VISITORS
            </span>
            <Users className="w-4 h-4 text-secondary/70" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight text-primary">
              {animatedVisitors.toLocaleString()}
            </span>
            {isSurge && (
              <span className="text-xs font-mono text-critical flex items-center font-semibold">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +92%
              </span>
            )}
            {isOptimized && (
              <span className="text-xs font-mono text-safe flex items-center font-semibold">
                STABILIZED
              </span>
            )}
          </div>
          <span className="text-[11px] text-secondary mt-0.5 block">
            Aggregated venue & transit turnstiles
          </span>
        </div>

        {/* Transport Load */}
        <div className="px-5 py-2">
          <div className="flex items-center justify-between text-secondary mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider">
              TRANSPORT LOAD
            </span>
            <Bus className="w-4 h-4 text-secondary/70" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight text-primary">
              {animatedTransport}%
            </span>
            <span
              className={`text-xs font-mono font-bold uppercase ${metrics.transportLoad >= 80
                  ? 'text-critical'
                  : metrics.transportLoad >= 60
                    ? 'text-warning'
                    : 'text-safe'
                }`}
            >
              {metrics.transportLoad >= 80 ? 'CRITICAL' : metrics.transportLoad >= 60 ? 'HIGH' : 'OPTIMAL'}
            </span>
          </div>
          <div className="w-full bg-[#EBEBE6] h-1.5 rounded-full overflow-hidden mt-1.5">
            <div
              className={`h-full transition-all duration-500 ${metrics.transportLoad >= 80
                  ? 'bg-critical'
                  : metrics.transportLoad >= 60
                    ? 'bg-high'
                    : 'bg-safe'
                }`}
              style={{ width: `${animatedTransport}%` }}
            />
          </div>
        </div>

        {/* Accommodation */}
        <div className="px-5 py-2">
          <div className="flex items-center justify-between text-secondary mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider">
              ACCOMMODATION
            </span>
            <Building className="w-4 h-4 text-secondary/70" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight text-primary">
              {animatedHotels}%
            </span>
            <span
              className={`text-xs font-mono font-bold uppercase ${metrics.hotelOccupancy >= 85
                  ? 'text-critical'
                  : metrics.hotelOccupancy >= 70
                    ? 'text-high'
                    : 'text-safe'
                }`}
            >
              {metrics.hotelOccupancy >= 85 ? 'SATURATED' : 'AVAILABLE'}
            </span>
          </div>
          <div className="w-full bg-[#EBEBE6] h-1.5 rounded-full overflow-hidden mt-1.5">
            <div
              className={`h-full transition-all duration-500 ${metrics.hotelOccupancy >= 85
                  ? 'bg-critical'
                  : metrics.hotelOccupancy >= 70
                    ? 'bg-high'
                    : 'bg-safe'
                }`}
              style={{ width: `${animatedHotels}%` }}
            />
          </div>
        </div>

        {/* Venue Capacity */}
        <div className="px-5 py-2">
          <div className="flex items-center justify-between text-secondary mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider">
              VENUE CAPACITY
            </span>
            <span className="text-[10px] font-mono text-secondary">{Math.round(currentEvent.capacity / 1000)}k SEATS</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight text-primary">
              {animatedVenue}%
            </span>
            <span
              className={`text-xs font-mono font-bold uppercase ${metrics.venueCapacity >= 90
                  ? 'text-critical'
                  : metrics.venueCapacity >= 75
                    ? 'text-high'
                    : 'text-safe'
                }`}
            >
              {metrics.venueCapacity >= 90 ? 'GATE BOTTLENECK' : 'BALANCED'}
            </span>
          </div>
          <div className="w-full bg-[#EBEBE6] h-1.5 rounded-full overflow-hidden mt-1.5">
            <div
              className={`h-full transition-all duration-500 ${metrics.venueCapacity >= 90
                  ? 'bg-critical'
                  : metrics.venueCapacity >= 75
                    ? 'bg-high'
                    : 'bg-safe'
                }`}
              style={{ width: `${animatedVenue}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
