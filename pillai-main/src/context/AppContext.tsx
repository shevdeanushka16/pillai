import React, { createContext, useContext, useState, useMemo } from 'react';
import type {
  SimulationState,
  StateMetrics,
  ZoneData,
  HotelData,
  RouteData,
  ActionItem,
} from '../data/mockData';
import {
  STATE_METRICS,
  INITIAL_ZONES,
  ACCOMMODATION_DATA,
  TRANSPORT_ROUTES,
  INITIAL_ACTIONS,
} from '../data/mockData';
import type { RiskEvaluation, EngineRule } from '../utils/intelligence';
import {
  calculatePressureScore,
  getRiskLevel,
  evaluateEngineRules,
} from '../utils/intelligence';

export interface ToastItem {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'alert';
}

export type EventTimePoint = '3:00 PM' | '4:00 PM' | '5:00 PM' | '6:42 PM' | '7:00 PM' | '9:30 PM';

interface AppContextType {
  activePage: string;
  setActivePage: (page: string) => void;
  simulationState: SimulationState;
  simulatedTime: EventTimePoint;
  setSimulatedTime: (time: EventTimePoint) => void;
  metrics: StateMetrics;
  pressureScore: number;
  riskEvaluation: RiskEvaluation;
  rules: EngineRule[];
  actions: ActionItem[];
  zones: ZoneData[];
  hotels: HotelData[];
  routes: RouteData[];
  toasts: ToastItem[];
  showBeforeAfterModal: boolean;
  setShowBeforeAfterModal: (show: boolean) => void;
  showEngineModal: boolean;
  setShowEngineModal: (show: boolean) => void;
  showSitrepModal: boolean;
  setShowSitrepModal: (show: boolean) => void;
  selectedMapNode: string | null;
  setSelectedMapNode: (node: string | null) => void;
  selectedOrigin: string;
  setSelectedOrigin: (origin: string) => void;
  // Simulation actions
  simulateDemandSurge: () => void;
  resetSimulation: () => void;
  applyAllActions: () => void;
  toggleAction: (actionId: string) => void;
  activateRoute3: () => void;
  addToast: (message: string, type?: ToastItem['type']) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<string>('command');
  const [simulationState, setSimulationState] = useState<SimulationState>('normal');
  const [simulatedTime, setSimulatedTimeState] = useState<EventTimePoint>('6:42 PM');
  const [actions, setActions] = useState<ActionItem[]>(INITIAL_ACTIONS);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [showBeforeAfterModal, setShowBeforeAfterModal] = useState<boolean>(false);
  const [showEngineModal, setShowEngineModal] = useState<boolean>(false);
  const [showSitrepModal, setShowSitrepModal] = useState<boolean>(false);
  const [selectedMapNode, setSelectedMapNode] = useState<string | null>(null);
  const [selectedOrigin, setSelectedOrigin] = useState<string>('Andheri Metro');

  const addToast = (message: string, type: ToastItem['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setSimulatedTime = (time: EventTimePoint) => {
    setSimulatedTimeState(time);
    if (time === '7:00 PM' && simulationState === 'normal') {
      simulateDemandSurge();
    } else {
      addToast(`Timeline shifted to ${time}. Sensor telemetry synchronized.`, 'info');
    }
  };

  // Derive metrics dynamically based on base state + applied actions + simulated time
  const metrics = useMemo<StateMetrics>(() => {
    if (simulatedTime === '3:00 PM') {
      return { visitors: 28400, crowdDensity: 32, hotelOccupancy: 50, transportLoad: 38, venueCapacity: 35 };
    }
    if (simulatedTime === '4:00 PM') {
      return { visitors: 42000, crowdDensity: 46, hotelOccupancy: 58, transportLoad: 48, venueCapacity: 50 };
    }
    if (simulatedTime === '9:30 PM') {
      return { visitors: 88000, crowdDensity: 65, hotelOccupancy: 88, transportLoad: 92, venueCapacity: 45 };
    }

    if (simulationState === 'normal') {
      return STATE_METRICS.normal;
    }
    if (simulationState === 'optimized') {
      return STATE_METRICS.optimized;
    }

    // In 'surge' state, factor in any individually applied actions
    const base = { ...STATE_METRICS.surge };
    const divertApplied = actions.find((a) => a.id === 'divert-arrivals')?.applied;
    const shuttleApplied = actions.find((a) => a.id === 'activate-shuttle')?.applied;
    const staysApplied = actions.find((a) => a.id === 'shift-stays')?.applied;
    const flattenApplied = actions.find((a) => a.id === 'flatten-arrivals')?.applied;

    if (divertApplied) {
      base.venueCapacity = Math.max(76, base.venueCapacity - 12);
      base.crowdDensity = Math.max(70, base.crowdDensity - 8);
    }
    if (shuttleApplied) {
      base.transportLoad = Math.max(55, base.transportLoad - 21);
    }
    if (staysApplied) {
      base.hotelOccupancy = Math.max(72, base.hotelOccupancy - 12);
    }
    if (flattenApplied) {
      base.crowdDensity = Math.max(67, base.crowdDensity - 9);
      base.venueCapacity = Math.max(76, base.venueCapacity - 6);
    }

    return base;
  }, [simulationState, actions, simulatedTime]);

  const pressureScore = useMemo(() => calculatePressureScore(metrics), [metrics]);
  const riskEvaluation = useMemo(() => getRiskLevel(pressureScore), [pressureScore]);
  const rules = useMemo(() => evaluateEngineRules(metrics, pressureScore), [metrics, pressureScore]);

  // Dynamic Zones
  const zones = useMemo(() => {
    return INITIAL_ZONES[simulationState];
  }, [simulationState]);

  // Dynamic Accommodation
  const hotels = useMemo(() => {
    return ACCOMMODATION_DATA[simulationState];
  }, [simulationState]);

  // Dynamic Transport Routes (with Route 3 sync)
  const routes = useMemo(() => {
    const baseRoutes = [...TRANSPORT_ROUTES[simulationState]];
    const shuttleActionApplied = actions.find((a) => a.id === 'activate-shuttle')?.applied;
    return baseRoutes.map((r) => {
      if (r.id === 'route-3') {
        const isActive = simulationState === 'optimized' || Boolean(shuttleActionApplied);
        return {
          ...r,
          active: isActive,
          load: isActive ? 58 : r.load,
          status: isActive ? 'MODERATE' : r.status,
        };
      }
      return r;
    });
  }, [simulationState, actions]);

  // Triggers
  const simulateDemandSurge = () => {
    setSimulationState('surge');
    setSimulatedTimeState('6:42 PM');
    setActions(INITIAL_ACTIONS.map((a) => ({ ...a, applied: false })));
    addToast('Demand Surge Detected: 92,500 inbound attendees. Zone A & Transit corridor under severe load.', 'warning');
  };

  const resetSimulation = () => {
    setSimulationState('normal');
    setSimulatedTimeState('6:42 PM');
    setActions(INITIAL_ACTIONS.map((a) => ({ ...a, applied: false })));
    setShowBeforeAfterModal(false);
    setSelectedMapNode(null);
    addToast('Simulation reset to baseline operations. Calm flow rates restored.', 'info');
  };

  const applyAllActions = () => {
    setSimulationState('optimized');
    setActions((prev) => prev.map((a) => ({ ...a, applied: true })));
    setShowBeforeAfterModal(true);
    addToast('All 4 coordinated actions executed. Projected event pressure reduced from CRITICAL to MODERATE.', 'success');
  };

  const toggleAction = (actionId: string) => {
    setActions((prev) => {
      const next = prev.map((a) => (a.id === actionId ? { ...a, applied: !a.applied } : a));
      const target = next.find((a) => a.id === actionId);
      if (target) {
        if (target.applied) {
          addToast(`Action executed: ${target.title} (${target.expectedImpact})`, 'success');
        } else {
          addToast(`Action deactivated: ${target.title}`, 'info');
        }
      }

      // Check if all actions applied during surge
      const allApplied = next.every((a) => a.applied);
      if (allApplied && simulationState === 'surge') {
        setSimulationState('optimized');
        setShowBeforeAfterModal(true);
      }
      return next;
    });
  };

  const activateRoute3 = () => {
    const target = actions.find((a) => a.id === 'activate-shuttle');
    if (!target?.applied) {
      toggleAction('activate-shuttle');
    } else {
      addToast('Shuttle Route 3 is already active.', 'info');
    }
  };

  return (
    <AppContext.Provider
      value={{
        activePage,
        setActivePage,
        simulationState,
        simulatedTime,
        setSimulatedTime,
        metrics,
        pressureScore,
        riskEvaluation,
        rules,
        actions,
        zones,
        hotels,
        routes,
        toasts,
        showBeforeAfterModal,
        setShowBeforeAfterModal,
        showEngineModal,
        setShowEngineModal,
        showSitrepModal,
        setShowSitrepModal,
        selectedMapNode,
        setSelectedMapNode,
        selectedOrigin,
        setSelectedOrigin,
        simulateDemandSurge,
        resetSimulation,
        applyAllActions,
        toggleAction,
        activateRoute3,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
