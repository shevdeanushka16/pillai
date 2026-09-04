import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users2,
  Building2,
  Bus,
  Compass,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activePage, setActivePage, simulationState } = useApp();

  const navItems = [
    { id: 'command', label: 'COMMAND CENTER', icon: LayoutDashboard },
    { id: 'crowd', label: 'CROWD ANALYTICS', icon: Users2 },
    { id: 'accommodation', label: 'ACCOMMODATION', icon: Building2 },
    { id: 'transportation', label: 'TRANSPORTATION', icon: Bus },
    { id: 'visitor', label: 'VISITOR GUIDANCE', icon: Compass },
  ];

  return (
    <aside className="w-64 border-r border-border bg-[#FAFAF8] flex flex-col justify-between shrink-0 select-none min-h-screen">
      <div>
        {/* Logo and Brand */}
        <div className="h-16 px-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-primary text-white flex items-center justify-center font-mono font-black text-sm tracking-tighter">
              O
            </div>
            <div>
              <span className="font-bold tracking-tight text-base text-primary font-mono block leading-none">
                ORBIT
              </span>
              <span className="text-[10px] font-mono text-secondary tracking-wider uppercase">
                Predict. Coordinate. Move.
              </span>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-2 text-[10px] font-mono text-secondary tracking-wider uppercase">
            Platform Modules
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs font-mono font-medium transition-all text-left ${
                  isActive
                    ? 'bg-white text-primary border border-border shadow-xs'
                    : 'text-secondary hover:text-primary hover:bg-[#F2F2EE]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-orbit' : 'text-secondary'
                  }`}
                />
                <span className="tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-border space-y-3">
        {/* Simulation State Tag */}
        <div className="p-2.5 bg-surface border border-border rounded font-mono text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase text-secondary">ACTIVE STATE</span>
            <span
              className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                simulationState === 'surge'
                  ? 'bg-critical-subtle text-critical'
                  : simulationState === 'optimized'
                  ? 'bg-safe-subtle text-safe'
                  : 'bg-[#F2F2EE] text-secondary'
              }`}
            >
              {simulationState}
            </span>
          </div>
          <div className="text-[11px] text-secondary">
            {simulationState === 'surge'
              ? 'Surge load active (+92.5k visitors)'
              : simulationState === 'optimized'
              ? 'Coordinated relief applied'
              : 'Standard baseline event operations'}
          </div>
        </div>

        {/* System Online Status */}
        <div className="flex items-center justify-between text-[11px] font-mono text-secondary pt-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-safe animate-pulse" />
            SYSTEM ONLINE
          </span>
          <span className="text-[10px] bg-[#EBEBE6] px-1.5 py-0.5 rounded text-secondary uppercase">
            SIMULATION MODE
          </span>
        </div>
      </div>
    </aside>
  );
};
