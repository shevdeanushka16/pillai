import React from 'react';
import { useApp } from '../../context/AppContext';
import { Check, Zap, CheckCheck } from 'lucide-react';

export const NextActions: React.FC = () => {
  const { actions, toggleAction, applyAllActions, simulationState, setActivePage, currentEvent } = useApp();

  const allApplied = actions.every((a) => a.applied);

  const handleActionClick = (actionId: string) => {
    toggleAction(actionId);
  };

  const getDynamicSubtitle = (actionId: string, defaultSub: string) => {
    if (actionId === 'divert-arrivals') {
      return `${currentEvent.primaryGate} → ${currentEvent.alternateGate}`;
    }
    if (actionId === 'activate-shuttle') {
      return currentEvent.shuttleRoute;
    }
    return defaultSub;
  };

  return (
    <div className="bg-surface border border-border rounded-md p-5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-3 mb-3 gap-2">
        <div>
          <span className="text-[11px] font-mono tracking-wider uppercase text-secondary block">
            Orchestration Dispatch
          </span>
          <h3 className="text-sm font-semibold tracking-tight text-primary">
            NEXT ACTIONS
          </h3>
          <p className="text-xs text-secondary mt-0.5">
            Based on current capacity and projected movement.
          </p>
        </div>

        {/* Apply All Actions Button */}
        <div>
          <button
            onClick={applyAllActions}
            disabled={allApplied || simulationState === 'normal'}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-mono font-medium transition-all ${
              allApplied
                ? 'bg-[#EBF6F0] text-safe border border-safe/30 cursor-default'
                : simulationState === 'normal'
                ? 'bg-surface-subtle text-secondary border border-border cursor-not-allowed'
                : 'bg-orbit hover:bg-orbit-hover text-white shadow-sm'
            }`}
          >
            {allApplied ? (
              <>
                <CheckCheck className="w-3.5 h-3.5" />
                <span>ALL ACTIONS EXECUTED</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                <span>APPLY ALL ACTIONS</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Numbered Operational List */}
      <div className="space-y-2.5">
        {actions.map((action) => {
          return (
            <div
              key={action.id}
              className={`p-3 border rounded transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                action.applied
                  ? 'border-safe/40 bg-safe-subtle/30'
                  : 'border-border bg-white hover:border-border-strong'
              }`}
            >
              {/* Left Column: Number + Details */}
              <div className="flex items-start gap-3">
                <span className="font-mono text-xs font-bold text-secondary bg-[#F2F2EE] px-1.5 py-0.5 rounded shrink-0">
                  {action.number}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold tracking-tight text-primary font-mono uppercase">
                      {action.title}
                    </h4>
                    <span className="text-xs text-secondary font-mono">
                      {getDynamicSubtitle(action.id, action.subtitle)}
                    </span>
                  </div>
                  <div className="text-xs text-secondary mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5">
                    <span>{action.detail}</span>
                    <span className="text-orbit font-medium">
                      Expected impact: {action.expectedImpact}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Action Button */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {action.id === 'shift-stays' && (
                  <button
                    onClick={() => setActivePage('accommodation')}
                    className="text-[11px] font-mono text-secondary hover:text-primary px-2 py-1 underline"
                  >
                    Details
                  </button>
                )}
                <button
                  onClick={() => handleActionClick(action.id)}
                  className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-mono font-medium transition-all ${
                    action.applied
                      ? 'bg-safe text-white'
                      : 'bg-surface border border-border text-primary hover:border-primary hover:bg-[#F2F2EE]'
                  }`}
                >
                  {action.applied ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>{action.activeText}</span>
                    </>
                  ) : (
                    <>
                      <span>{action.buttonText}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
