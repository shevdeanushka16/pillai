import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import type {
  SimulationState,
  StateMetrics,
  ZoneData,
  HotelData,
  RouteData,
  ActionItem,
  EventConfig,
} from '../data/mockData';
import {
  STATE_METRICS,
  INITIAL_ZONES,
  ACCOMMODATION_DATA,
  TRANSPORT_ROUTES,
  INITIAL_ACTIONS,
  PRESET_EVENTS,
} from '../data/mockData';
import type { RiskEvaluation, EngineRule } from '../utils/intelligence';
import {
  calculatePressureScore,
  getRiskLevel,
  evaluateEngineRules,
} from '../utils/intelligence';
import { broadcastSyncState } from '../utils/syncService';

export interface ToastItem {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'alert';
}

export type EventTimePoint = '3:00 PM' | '4:00 PM' | '5:00 PM' | '6:42 PM' | '7:00 PM' | '9:30 PM';
export type CommandMode = 'live' | 'sandbox' | 'audit';

interface AppContextType {
  activePage: string;
  setActivePage: (page: string) => void;
  commandMode: CommandMode;
  setCommandMode: (mode: CommandMode) => void;
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
  showMobilePassModal: boolean;
  setShowMobilePassModal: (show: boolean) => void;
  showEventModal: boolean;
  setShowEventModal: (show: boolean) => void;
  showSlidersDrawer: boolean;
  setShowSlidersDrawer: (show: boolean) => void;
  showCopilotDrawer: boolean;
  setShowCopilotDrawer: (show: boolean) => void;
  showActuationModal: boolean;
  setShowActuationModal: (show: boolean) => void;
  isAutoPilotRunning: boolean;
  setIsAutoPilotRunning: (running: boolean) => void;
  currentEvent: EventConfig;
  eventsList: EventConfig[];
  switchEvent: (eventId: string) => void;
  createCustomEvent: (event: Omit<EventConfig, 'id'>) => void;
  telemetryOverrides: Partial<StateMetrics> | null;
  setTelemetryOverride: (key: keyof StateMetrics, value: number) => void;
  resetTelemetryOverrides: () => void;
  selectedMapNode: string | null;
  setSelectedMapNode: (node: string | null) => void;
  focusedIncidentCardId: string | null;
  setFocusedIncidentCardId: (id: string | null) => void;
  selectedOrigin: string;
  setSelectedOrigin: (origin: string) => void;
  // Simulation actions
  simulateDemandSurge: () => void;
  triggerWeatherDisruption: () => void;
  triggerHighwayBlockage: () => void;
  triggerEgressMode: () => void;
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
  const [commandMode, setCommandMode] = useState<CommandMode>('live');
  const [simulationState, setSimulationState] = useState<SimulationState>('normal');
  const [simulatedTime, setSimulatedTimeState] = useState<EventTimePoint>('6:42 PM');
  const [actions, setActions] = useState<ActionItem[]>(INITIAL_ACTIONS);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [showBeforeAfterModal, setShowBeforeAfterModal] = useState<boolean>(false);
  const [showEngineModal, setShowEngineModal] = useState<boolean>(false);
  const [showSitrepModal, setShowSitrepModal] = useState<boolean>(false);
  const [showMobilePassModal, setShowMobilePassModal] = useState<boolean>(false);
  const [showEventModal, setShowEventModal] = useState<boolean>(false);
  const [showSlidersDrawer, setShowSlidersDrawer] = useState<boolean>(false);
  const [showCopilotDrawer, setShowCopilotDrawer] = useState<boolean>(false);
  const [showActuationModal, setShowActuationModal] = useState<boolean>(false);
  const [isAutoPilotRunning, setIsAutoPilotRunning] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.location.search.includes('demo=true');
    }
    return false;
  });
  const [eventsList, setEventsList] = useState<EventConfig[]>(PRESET_EVENTS);
  const [currentEvent, setCurrentEvent] = useState<EventConfig>(PRESET_EVENTS[0]);
  const [telemetryOverrides, setTelemetryOverrides] = useState<Partial<StateMetrics> | null>(null);
  const [selectedMapNode, setSelectedMapNode] = useState<string | null>(null);
  const [focusedIncidentCardId, setFocusedIncidentCardId] = useState<string | null>(null);
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

  const switchEvent = (eventId: string) => {
    const target = eventsList.find((e) => e.id === eventId);
    if (target) {
      setCurrentEvent(target);
      resetSimulation();
      setTelemetryOverrides(null);
      addToast(`Switched active event to: ${target.title} (${target.venueName})`, 'info');
    }
  };

  const createCustomEvent = (newEvent: Omit<EventConfig, 'id'>) => {
    const id = 'custom-' + Date.now();
    const fullEvent: EventConfig = { ...newEvent, id };
    setEventsList((prev) => [fullEvent, ...prev]);
    setCurrentEvent(fullEvent);
    resetSimulation();
    setTelemetryOverrides(null);
    setShowEventModal(false);
    addToast(`New custom event deployed: ${fullEvent.title}`, 'success');
  };

  const setTelemetryOverride = (key: keyof StateMetrics, value: number) => {
    setTelemetryOverrides((prev) => ({
      ...(prev || {}),
      [key]: value,
    }));
  };

  const resetTelemetryOverrides = () => {
    setTelemetryOverrides(null);
    addToast('Telemetry overrides reset. Auto-syncing with live sensor baseline.', 'info');
  };

  // Derive metrics dynamically based on base state + applied actions + simulated time + event scaling + overrides
  const metrics = useMemo<StateMetrics>(() => {
    let base: StateMetrics;

    if (simulatedTime === '3:00 PM') {
      base = { visitors: Math.round(currentEvent.capacity * 0.44), crowdDensity: 32, hotelOccupancy: 50, transportLoad: 38, venueCapacity: 35 };
    } else if (simulatedTime === '4:00 PM') {
      base = { visitors: Math.round(currentEvent.capacity * 0.65), crowdDensity: 46, hotelOccupancy: 58, transportLoad: 48, venueCapacity: 50 };
    } else if (simulatedTime === '9:30 PM') {
      base = { visitors: Math.round(currentEvent.expectedAttendance * 0.95), crowdDensity: 65, hotelOccupancy: 88, transportLoad: 92, venueCapacity: 45 };
    } else if (simulationState === 'normal') {
      base = {
        ...STATE_METRICS.normal,
        visitors: Math.round(currentEvent.capacity * 0.74),
      };
    } else if (simulationState === 'optimized') {
      base = {
        ...STATE_METRICS.optimized,
        visitors: currentEvent.expectedAttendance,
      };
    } else {
      // In 'surge' state, factor in any individually applied actions
      const surgeBase = {
        ...STATE_METRICS.surge,
        visitors: currentEvent.expectedAttendance,
      };
      const divertApplied = actions.find((a) => a.id === 'divert-arrivals')?.applied;
      const shuttleApplied = actions.find((a) => a.id === 'activate-shuttle')?.applied;
      const staysApplied = actions.find((a) => a.id === 'shift-stays')?.applied;
      const flattenApplied = actions.find((a) => a.id === 'flatten-arrivals')?.applied;

      if (divertApplied) {
        surgeBase.venueCapacity = Math.max(76, surgeBase.venueCapacity - 12);
        surgeBase.crowdDensity = Math.max(70, surgeBase.crowdDensity - 8);
      }
      if (shuttleApplied) {
        surgeBase.transportLoad = Math.max(55, surgeBase.transportLoad - 21);
      }
      if (staysApplied) {
        surgeBase.hotelOccupancy = Math.max(72, surgeBase.hotelOccupancy - 12);
      }
      if (flattenApplied) {
        surgeBase.crowdDensity = Math.max(67, surgeBase.crowdDensity - 9);
        surgeBase.venueCapacity = Math.max(76, surgeBase.venueCapacity - 6);
      }
      base = surgeBase;
    }

    if (telemetryOverrides) {
      return {
        ...base,
        ...telemetryOverrides,
      };
    }

    return base;
  }, [simulationState, actions, simulatedTime, currentEvent, telemetryOverrides]);

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

  // Real-time synchronization broadcast to connected attendee passes / secondary screens
  useEffect(() => {
    const divertApplied = Boolean(actions.find((a) => a.id === 'divert-arrivals')?.applied || simulationState === 'optimized');
    const shuttleApplied = Boolean(actions.find((a) => a.id === 'activate-shuttle')?.applied || simulationState === 'optimized');
    const staysApplied = Boolean(actions.find((a) => a.id === 'shift-stays')?.applied || simulationState === 'optimized');
    const flattenApplied = Boolean(actions.find((a) => a.id === 'flatten-arrivals')?.applied || simulationState === 'optimized');

    broadcastSyncState({
      type: 'ORBIT_SYNC_UPDATE',
      simulationState,
      simulatedTime,
      divertActive: divertApplied,
      shuttleActive: shuttleApplied,
      staysActive: staysApplied,
      flattenActive: flattenApplied,
      pressureScore,
      riskLevel: riskEvaluation.level,
      attendeeGate: divertApplied ? currentEvent.alternateGate : currentEvent.primaryGate,
      attendeeRoute: divertApplied ? `Dedicated ${currentEvent.shuttleRoute}` : currentEvent.highwayCorridor,
      gateQueueMin: divertApplied ? 2 : simulationState === 'surge' ? 28 : 3,
      fastTrackVoucher: divertApplied,
      timestamp: Date.now(),
      eventTitle: currentEvent.title,
      venueName: currentEvent.venueName,
      city: currentEvent.city,
      primaryGate: currentEvent.primaryGate,
      alternateGate: currentEvent.alternateGate,
    });
  }, [simulationState, actions, simulatedTime, pressureScore, riskEvaluation, currentEvent]);

  // Triggers
  const simulateDemandSurge = () => {
    setSimulationState('surge');
    setSimulatedTimeState('6:42 PM');
    setActions(INITIAL_ACTIONS.map((a) => ({ ...a, applied: false })));
    setTelemetryOverrides({
      visitors: currentEvent.expectedAttendance,
      crowdDensity: 90,
      transportLoad: 92,
      venueCapacity: 92,
    });
    addToast(`Demand Surge Detected: ${currentEvent.expectedAttendance.toLocaleString()} inbound attendees. Zone A & Transit under severe load.`, 'warning');
  };

  const triggerWeatherDisruption = () => {
    setSimulationState('surge');
    setTelemetryOverrides({
      transportLoad: 94,
      crowdDensity: 86,
      venueCapacity: 88,
    });
    addToast('🌧️ INCIDENT TRIGGERED: Severe monsoon storm on arterial corridor. Transit flow dropped to critical.', 'alert');
  };

  const triggerHighwayBlockage = () => {
    setSimulationState('surge');
    setTelemetryOverrides({
      transportLoad: 98,
      crowdDensity: 82,
    });
    addToast('🚧 INCIDENT TRIGGERED: Major multi-vehicle arterial accident blocking Highway 1 corridor.', 'alert');
  };

  const triggerEgressMode = () => {
    setSimulatedTimeState('9:30 PM');
    setSimulationState('surge');
    setTelemetryOverrides({
      visitors: currentEvent.expectedAttendance,
      crowdDensity: 76,
      transportLoad: 96,
      venueCapacity: 32, // inside emptying out fast
    });
    addToast('🚨 EMERGENCY EGRESS / EVACUATION ACTIVATED: Reverse crowd flow priority enforced. Mass transit dispatch staged.', 'alert');
  };

  // Interactive timeline scrubber
  const setSimulatedTime = (time: EventTimePoint) => {
    setSimulatedTimeState(time);
    if (time === '3:00 PM') {
      // Gates open: calm, early arrivals
      setSimulationState('normal');
      setTelemetryOverrides({
        visitors: Math.round(currentEvent.expectedAttendance * 0.22),
        crowdDensity: 26,
        transportLoad: 32,
        venueCapacity: 28,
      });
      addToast('Phase Scrubbed: 3:00 PM (Gates Open) • Early arrival flow rates active', 'info');
    } else if (time === '4:00 PM') {
      // Opening warmup
      setSimulationState('normal');
      setTelemetryOverrides({
        visitors: Math.round(currentEvent.expectedAttendance * 0.45),
        crowdDensity: 44,
        transportLoad: 46,
        venueCapacity: 45,
      });
      addToast('Phase Scrubbed: 4:00 PM (Opening Event) • Inbound flow steady', 'info');
    } else if (time === '5:00 PM') {
      // Main performance begins
      setSimulationState('normal');
      setTelemetryOverrides({
        visitors: Math.round(currentEvent.expectedAttendance * 0.68),
        crowdDensity: 64,
        transportLoad: 68,
        venueCapacity: 66,
      });
      addToast('Phase Scrubbed: 5:00 PM (Main Event) • Approaching peak surge buffer', 'info');
    } else if (time === '6:42 PM' || time === '7:00 PM') {
      // Headliner / Peak crowd
      simulateDemandSurge();
    } else if (time === '9:30 PM') {
      // Event Exit
      triggerEgressMode();
    }
  };

  const resetSimulation = () => {
    setSimulationState('normal');
    setSimulatedTimeState('6:42 PM');
    setActions(INITIAL_ACTIONS.map((a) => ({ ...a, applied: false })));
    setTelemetryOverrides(null);
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
        commandMode,
        setCommandMode,
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
        showMobilePassModal,
        setShowMobilePassModal,
        showEventModal,
        setShowEventModal,
        showSlidersDrawer,
        setShowSlidersDrawer,
        showCopilotDrawer,
        setShowCopilotDrawer,
        showActuationModal,
        setShowActuationModal,
        isAutoPilotRunning,
        setIsAutoPilotRunning,
        currentEvent,
        eventsList,
        switchEvent,
        createCustomEvent,
        telemetryOverrides,
        setTelemetryOverride,
        resetTelemetryOverrides,
        selectedMapNode,
        setSelectedMapNode,
        focusedIncidentCardId,
        setFocusedIncidentCardId,
        selectedOrigin,
        setSelectedOrigin,
        simulateDemandSurge,
        triggerWeatherDisruption,
        triggerHighwayBlockage,
        triggerEgressMode,
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
