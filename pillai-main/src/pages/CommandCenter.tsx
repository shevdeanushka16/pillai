import React from 'react';
import { PressureGauge } from '../components/common/PressureGauge';
import { KPISection } from '../components/command/KPISection';
import { CityFlowMap } from '../components/command/CityFlowMap';
import { PredictionChart } from '../components/command/PredictionChart';
import { NextActions } from '../components/command/NextActions';
import { EventTimeline } from '../components/command/EventTimeline';

export const CommandCenter: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono tracking-wider uppercase text-secondary block">
            Central Operations
          </span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary font-mono">
            EVENT COMMAND CENTER
          </h1>
          <p className="text-sm text-secondary mt-1">
            "Predictive capacity intelligence for mega-events"
          </p>
        </div>

        <div className="text-left md:text-right">
          <span className="text-xs font-mono text-secondary">
            MODEL: <strong className="text-primary">ORBIT SENSE-PREDICT v2.4</strong>
          </span>
          <div className="text-[11px] font-mono text-secondary mt-0.5">
            SENSES → PREDICTS → RECOMMENDS → OPTIMIZES
          </div>
        </div>
      </div>

      {/* Primary Information Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5">
          <PressureGauge />
        </div>
        <div className="lg:col-span-7 flex flex-col justify-center">
          <KPISection />
        </div>
      </div>

      {/* Main Visual: City Flow Schematic */}
      <CityFlowMap />

      {/* Predictive & Action Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <PredictionChart />
        </div>
        <div className="lg:col-span-7">
          <NextActions />
        </div>
      </div>

      {/* Phasing Timeline */}
      <EventTimeline />
    </div>
  );
};
