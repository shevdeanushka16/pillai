import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Sparkles,
  Send,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  RotateCcw,
  Clock,
  Flame,
  ArrowRight,
  MapPin,
  Filter,
} from 'lucide-react';

export type IncidentSeverity = 'NORMAL' | 'MODERATE' | 'CRITICAL';
export type IncidentStatus = 'pending' | 'dispatched' | 'dismissed';

export interface IncidentMetric {
  label: string;
  value: string;
  isAlert?: boolean;
}

export interface IncidentActionCardData {
  id: string;
  title: string;
  severity: IncidentSeverity;
  timestamp: string;
  metrics: IncidentMetric[];
  impactSummary: string;
  recommendedAction: string;
  actionId?: string;
  actionLabel: string;
  status: IncidentStatus;
  nodeEntityId?: string; // e.g. 'gate-a', 'gate-c', 'corridor-highway', 'corridor-shuttle', 'arena'
  entityMention?: string; // readable chip, e.g. 'Gate A', 'Gate C', 'Highway Corridor 1'
}

interface ChatMessage {
  id: string;
  sender: 'copilot' | 'user';
  text?: string;
  card?: IncidentActionCardData;
  timestamp: string;
}

export const OrbitCopilotDrawer: React.FC = () => {
  const {
    showCopilotDrawer,
    setShowCopilotDrawer,
    currentEvent,
    metrics,
    pressureScore,
    riskEvaluation,
    toggleAction,
    applyAllActions,
    setShowActuationModal,
    addToast,
    selectedMapNode,
    setSelectedMapNode,
    focusedIncidentCardId,
    setFocusedIncidentCardId,
  } = useApp();

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'CRITICAL' | 'MODERATE' | 'NORMAL'>('ALL');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'init-briefing',
      sender: 'copilot',
      timestamp: '18:42:00 IST',
      card: {
        id: 'card-brief-01',
        title: 'TACTICAL INGRESS STATUS BRIEFING',
        severity: (pressureScore >= 80 ? 'CRITICAL' : pressureScore >= 60 ? 'MODERATE' : 'NORMAL') as IncidentSeverity,
        timestamp: 'Just now',
        metrics: [
          { label: 'Venue Pressure', value: `${pressureScore}/100`, isAlert: pressureScore >= 60 },
          { label: 'Gate Turnstiles', value: `${metrics.venueCapacity}% Load`, isAlert: metrics.venueCapacity >= 75 },
          { label: 'Inbound Flow', value: `${metrics.visitors.toLocaleString()} pax` },
        ],
        impactSummary: `Operational monitoring is active across ${currentEvent.venueName} and ${currentEvent.highwayCorridor}. Flow rate monitoring detects uneven arrival distribution ahead of peak showtime.`,
        recommendedAction: `Inspect live sector telemetry below or trigger pre-emptive turnstile load rebalancing to prevent choke points.`,
        actionId: 'divert-arrivals',
        actionLabel: `Approve & Dispatch: Prepare ${currentEvent.alternateGate} Buffer`,
        status: 'pending',
        nodeEntityId: 'arena',
        entityMention: currentEvent.venueName,
      },
    },
  ]);

  const quickPrompts = [
    'Analyze current bottleneck risks',
    'What happens if Highway 1 is flooded?',
    'Draft Gate A diversion notice (English & Hindi)',
    'Recommend optimal shuttle headway',
  ];

  // Auto-scroll when focusedIncidentCardId changes (triggered by clicking map node)
  useEffect(() => {
    if (focusedIncidentCardId && cardRefs.current[focusedIncidentCardId]) {
      cardRefs.current[focusedIncidentCardId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [focusedIncidentCardId]);

  useEffect(() => {
    if (!focusedIncidentCardId) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, focusedIncidentCardId]);

  if (!showCopilotDrawer) return null;

  const handleEntityFocus = (nodeEntityId?: string, cardId?: string) => {
    if (!nodeEntityId) return;
    setSelectedMapNode(nodeEntityId);
    if (cardId) {
      setFocusedIncidentCardId(cardId);
    }
    addToast(`Map visual synchronized: Centering & pulsing ${nodeEntityId.toUpperCase()}`, 'info');
  };

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: 'user-msg-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: 'Now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      generateIncidentCardResponse(query);
      setIsTyping(false);
    }, 550);
  };

  const generateIncidentCardResponse = (query: string) => {
    const q = query.toLowerCase();
    let card: IncidentActionCardData;

    if (q.includes('bottleneck') || q.includes('analyze') || q.includes('risk')) {
      card = {
        id: 'card-bottleneck-' + Date.now(),
        title: `INCIDENT #204: ${currentEvent.primaryGate.toUpperCase()} TURNSTILE QUEUE OVERLOAD`,
        severity: 'CRITICAL',
        timestamp: '18:42:15 IST',
        metrics: [
          { label: `${currentEvent.primaryGate} Queue`, value: '28 min wait', isAlert: true },
          { label: 'Corridor Friction', value: `${metrics.transportLoad}% Load`, isAlert: true },
          { label: `${currentEvent.alternateGate} Buffer`, value: '14 Idle Gates' },
        ],
        impactSummary: `Arriving surge of 12,000 attendees via ${currentEvent.highwayCorridor} has created severe pedestrian friction at ${currentEvent.primaryGate} turnstiles, pushing perimeter wait times past safe crowd thresholds.`,
        recommendedAction: `Execute immediate turnstile diversion: reroute arrivals to North ${currentEvent.alternateGate} and dispatch ${currentEvent.shuttleRoute} electric shuttle fleet.`,
        actionId: 'divert-arrivals',
        actionLabel: `Approve & Dispatch: Divert ${currentEvent.primaryGate} → ${currentEvent.alternateGate}`,
        status: 'pending',
        nodeEntityId: 'gate-a',
        entityMention: currentEvent.primaryGate,
      };
    } else if (q.includes('flood') || q.includes('rain') || q.includes('weather') || q.includes('blocked')) {
      card = {
        id: 'card-weather-' + Date.now(),
        title: `INCIDENT #205: MONSOON INUNDATION ON ${currentEvent.highwayCorridor.toUpperCase()}`,
        severity: 'CRITICAL',
        timestamp: '18:42:30 IST',
        metrics: [
          { label: 'Corridor Velocity', value: '11 km/h (-78%)', isAlert: true },
          { label: 'Predicted Delay', value: '+42 min delay', isAlert: true },
          { label: 'Fleet Relief', value: '18 Shuttles' },
        ],
        impactSummary: `Flash stormwater accumulation on ${currentEvent.highwayCorridor} approaches is causing vehicle speeds to collapse, generating an estimated 42-minute arrival delay for 18,000 motorists.`,
        recommendedAction: `Deploy 18 ${currentEvent.shuttleRoute} coaches on elevated transit lanes and broadcast variable message alerts directing motorists to metro connections.`,
        actionId: 'activate-shuttle',
        actionLabel: `Approve & Dispatch: Deploy 18 Shuttle Coaches`,
        status: 'pending',
        nodeEntityId: 'corridor-highway',
        entityMention: currentEvent.highwayCorridor,
      };
    } else if (q.includes('draft') || q.includes('hindi') || q.includes('notice') || q.includes('announcement') || q.includes('language')) {
      card = {
        id: 'card-broadcast-' + Date.now(),
        title: 'COMMUNICATION DISPATCH #108: MULTILINGUAL GEOFENCED ADVISORY',
        severity: 'MODERATE',
        timestamp: '18:42:45 IST',
        metrics: [
          { label: 'Target Audience', value: '84,000 SIMs' },
          { label: 'Geofence Radius', value: '5.0 km Cell Mesh' },
          { label: 'Languages', value: 'EN / HI / MR' },
        ],
        impactSummary: `Attendees within a 5 km perimeter require localized civic instructions in English, Hindi, and Marathi to prevent further density buildup at congested gates.`,
        recommendedAction: `Actuate municipal VMS highway LED gantries, push cellular emergency broadcast alerts, and trigger automated public address (PA) voice announcements.`,
        actionId: 'actuation-modal',
        actionLabel: 'Approve & Dispatch: Actuate Multi-Channel Matrix',
        status: 'pending',
        nodeEntityId: 'corridor-highway',
        entityMention: 'VMS Highway Mesh',
      };
    } else if (q.includes('shuttle') || q.includes('headway') || q.includes('bus') || q.includes('fleet')) {
      card = {
        id: 'card-headway-' + Date.now(),
        title: `FLEET DIRECTIVE #302: ${currentEvent.shuttleRoute.toUpperCase()} HEADWAY COMPRESSION`,
        severity: 'MODERATE',
        timestamp: '18:43:00 IST',
        metrics: [
          { label: 'Terminal Demand', value: '18,400 pax/hr', isAlert: true },
          { label: 'Target Headway', value: '2.5 min loop' },
          { label: 'Arterial Relief', value: '-21% Congestion' },
        ],
        impactSummary: `Suburban transit egress exceeds standard bus loop throughput, threatening platform crowding unless fleet headway is compressed immediately.`,
        recommendedAction: `Compress dispatch intervals to 2.5 minutes using 18 staggered 60-passenger electric shuttles along dedicated transit lanes to ${currentEvent.alternateGate}.`,
        actionId: 'activate-shuttle',
        actionLabel: `Approve & Dispatch: Enforce 2.5 min Headway`,
        status: 'pending',
        nodeEntityId: 'corridor-shuttle',
        entityMention: currentEvent.shuttleRoute,
      };
    } else {
      card = {
        id: 'card-custom-' + Date.now(),
        title: `OPERATIONAL DIRECTIVE: CUSTOM CAPACITY REBALANCING`,
        severity: 'MODERATE',
        timestamp: '18:43:10 IST',
        metrics: [
          { label: 'Pressure Score', value: `${pressureScore}/100`, isAlert: pressureScore >= 70 },
          { label: 'Active Gates', value: `${currentEvent.gatesCount || 14} Turnstiles` },
          { label: 'Sync Status', value: 'Mesh Online' },
        ],
        impactSummary: `Evaluation of query "${query}" indicates elevated regional density across transit and hospitality buffer zones.`,
        recommendedAction: `Deploy coordinated multi-agency mitigation to rebalance perimeter gates and flatten arrival pressure before peak performance.`,
        actionId: 'apply-all',
        actionLabel: 'Approve & Dispatch: Execute Coordinated Protocol',
        status: 'pending',
        nodeEntityId: 'gate-c',
        entityMention: currentEvent.alternateGate,
      };
    }

    setMessages((prev) => [
      ...prev,
      {
        id: 'copilot-msg-' + Date.now(),
        sender: 'copilot',
        card,
        timestamp: 'Just now',
      },
    ]);
  };

  const handleApproveAndDispatch = (cardId: string, actionId?: string) => {
    if (actionId === 'actuation-modal') {
      setShowActuationModal(true);
    } else if (actionId === 'apply-all') {
      applyAllActions();
    } else if (actionId) {
      toggleAction(actionId);
    }

    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.card && msg.card.id === cardId) {
          return {
            ...msg,
            card: {
              ...msg.card,
              status: 'dispatched',
            },
          };
        }
        return msg;
      })
    );

    addToast('Countermeasure Approved & Dispatched to Field Units', 'success');
  };

  const handleDismiss = (cardId: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.card && msg.card.id === cardId) {
          return {
            ...msg,
            card: {
              ...msg.card,
              status: 'dismissed',
            },
          };
        }
        return msg;
      })
    );
    addToast('Incident card archived.', 'info');
  };

  const handleUndoDismiss = (cardId: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.card && msg.card.id === cardId) {
          return {
            ...msg,
            card: {
              ...msg.card,
              status: 'pending',
            },
          };
        }
        return msg;
      })
    );
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden bg-black/50 backdrop-blur-xs animate-in fade-in duration-200 flex justify-end">
      <div className="w-full max-w-xl bg-white border-l border-border h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-border bg-surface-subtle flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orbit to-purple-600 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold font-mono tracking-tight text-primary">
                  ORBIT INCIDENT COPILOT
                </h2>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-mono bg-safe/10 text-safe border border-safe/30 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-safe animate-pulse" />
                  REASONING ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-secondary font-mono truncate max-w-xs">
                Context: {currentEvent.title} • {pressureScore}/100 ({riskEvaluation.label} RISK)
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowCopilotDrawer(false)}
            className="p-1.5 rounded-md text-secondary hover:text-primary hover:bg-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Prompts & Filter Controls */}
        <div className="bg-surface border-b border-border divide-y divide-border/60 shrink-0">
          <div className="p-2.5 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2 text-[11px] font-mono">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="px-2.5 py-1 bg-white border border-border hover:border-orbit hover:text-orbit rounded-full text-secondary transition-colors shrink-0 flex items-center gap-1"
              >
                <span>{prompt}</span>
                <ArrowRight className="w-2.5 h-2.5 opacity-50" />
              </button>
            ))}
          </div>

          {/* Incident Filter & Node Focus Bar */}
          <div className="px-3.5 py-2 bg-white flex items-center justify-between gap-2 text-[11px] font-mono">
            <div className="flex items-center gap-1.5 text-secondary">
              <Filter className="w-3 h-3 text-orbit" />
              <span className="font-bold text-primary">FILTER:</span>
              {(['ALL', 'CRITICAL', 'MODERATE', 'NORMAL'] as const).map((sev) => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                    filterSeverity === sev
                      ? sev === 'CRITICAL'
                        ? 'bg-rose-500 text-white'
                        : sev === 'MODERATE'
                        ? 'bg-amber-500 text-white'
                        : sev === 'NORMAL'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-primary text-white'
                      : 'bg-surface hover:bg-surface-subtle text-secondary'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>

            {selectedMapNode && (
              <button
                onClick={() => {
                  setSelectedMapNode(null);
                  setFocusedIncidentCardId(null);
                }}
                className="text-[10px] text-rose-600 hover:underline flex items-center gap-1 shrink-0 font-bold"
              >
                <span>Reset Map Node ({selectedMapNode.toUpperCase()})</span>
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Incident Action Cards Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans bg-[#FBFBFA]">
          {messages.map((msg) => {
            // Render user message bubble
            if (msg.sender === 'user') {
              return (
                <div key={msg.id} className="flex justify-end">
                  <div className="max-w-[85%] rounded-xl px-4 py-2.5 bg-primary text-white font-mono text-xs shadow-xs rounded-br-none">
                    <p>{msg.text}</p>
                    <div className="text-[9px] text-slate-400 text-right mt-1 font-mono">
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            }

            // Render Incident Action Card
            if (msg.card) {
              const card = msg.card;

              // Filter check
              if (filterSeverity !== 'ALL' && card.severity !== filterSeverity) {
                return null;
              }

              const isCritical = card.severity === 'CRITICAL';
              const isModerate = card.severity === 'MODERATE';
              const isDispatched = card.status === 'dispatched';
              const isDismissed = card.status === 'dismissed';
              const isCardFocused = focusedIncidentCardId === card.id || (selectedMapNode && card.nodeEntityId === selectedMapNode);

              return (
                <div
                  key={msg.id}
                  ref={(el) => {
                    cardRefs.current[card.id] = el;
                  }}
                  onMouseEnter={() => {
                    if (card.nodeEntityId) {
                      setSelectedMapNode(card.nodeEntityId);
                    }
                  }}
                  onClick={() => {
                    if (card.nodeEntityId) {
                      handleEntityFocus(card.nodeEntityId, card.id);
                    }
                  }}
                  className={`bg-white border rounded-xl shadow-xs transition-all duration-300 overflow-hidden cursor-pointer ${
                    isCardFocused
                      ? isCritical
                        ? 'ring-2 ring-rose-500 ring-offset-2 border-rose-500 bg-rose-50/20 shadow-lg scale-[1.01]'
                        : isModerate
                        ? 'ring-2 ring-amber-500 ring-offset-2 border-amber-500 bg-amber-50/20 shadow-lg scale-[1.01]'
                        : 'ring-2 ring-emerald-500 ring-offset-2 border-emerald-500 bg-emerald-50/20 shadow-lg scale-[1.01]'
                      : isDismissed
                      ? 'opacity-60 border-neutral-300'
                      : isDispatched
                      ? 'border-safe/60 border-l-4 border-l-safe shadow-sm'
                      : isCritical
                      ? 'border-rose-200 border-l-4 border-l-rose-500 hover:border-rose-400 shadow-sm'
                      : isModerate
                      ? 'border-amber-200 border-l-4 border-l-amber-500 hover:border-amber-400 shadow-sm'
                      : 'border-emerald-200 border-l-4 border-l-emerald-500 hover:border-emerald-400'
                  }`}
                >
                  {/* Card Header: Title, Severity Badge & Timestamp */}
                  <div className="p-3.5 border-b border-border/70 flex items-start justify-between gap-3 bg-white">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Severity Badge */}
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                            isCritical
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : isModerate
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {isCritical && <Flame className="w-3 h-3 text-rose-600 animate-pulse" />}
                          {isModerate && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                          {!isCritical && !isModerate && <ShieldCheck className="w-3 h-3 text-emerald-600" />}
                          <span>{card.severity}</span>
                        </span>

                        {/* Interactive Entity Mention Chip */}
                        {card.nodeEntityId && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEntityFocus(card.nodeEntityId, card.id);
                            }}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold transition-all border ${
                              isCardFocused
                                ? 'bg-orbit text-white border-orbit shadow-xs'
                                : 'bg-surface hover:bg-orbit-subtle text-primary border-border hover:border-orbit/50'
                            }`}
                            title="Click to zoom & pulse this entity on map"
                          >
                            <MapPin className="w-2.5 h-2.5 text-orbit" />
                            <span>{card.entityMention || card.nodeEntityId.toUpperCase()}</span>
                          </span>
                        )}

                        {isDispatched && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-safe/10 text-safe border border-safe/30">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>ACTIVE DISPATCH</span>
                          </span>
                        )}

                        {isDismissed && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-neutral-100 text-neutral-500">
                            DISMISSED
                          </span>
                        )}
                      </div>

                      <h3 className="text-xs font-bold font-mono text-primary uppercase tracking-tight">
                        {card.title}
                      </h3>
                    </div>

                    <div className="text-[10px] font-mono text-secondary shrink-0 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      <span>{card.timestamp}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-3.5 space-y-3">
                    {/* Metrics Row: Key impacts at a glance */}
                    <div className="grid grid-cols-3 gap-2">
                      {card.metrics.map((metric, idx) => (
                        <div
                          key={idx}
                          className={`p-2 rounded-lg border text-center font-mono ${
                            metric.isAlert
                              ? 'bg-rose-50/70 border-rose-200/80 text-rose-800'
                              : 'bg-surface border-border/80 text-primary'
                          }`}
                        >
                          <span className="text-[9px] uppercase font-semibold block truncate text-secondary">
                            {metric.label}
                          </span>
                          <span className={`text-xs font-bold block mt-0.5 truncate ${metric.isAlert ? 'text-rose-700 font-extrabold' : 'text-primary'}`}>
                            {metric.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Operational Impact Summary: 1-2 concise sentences */}
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-secondary font-bold block">
                        OPERATIONAL ROOT CAUSE & IMPACT
                      </span>
                      <p className="text-xs text-primary leading-relaxed bg-surface-subtle/50 p-2 rounded-md border border-border/40 font-medium">
                        {card.impactSummary}
                      </p>
                    </div>

                    {/* Recommended Action: Clear suggested operational countermeasure */}
                    <div className="p-2.5 rounded-lg bg-orbit-subtle/40 border border-orbit/25 space-y-1">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-orbit font-bold flex items-center gap-1">
                        <Zap className="w-3 h-3 fill-current" />
                        <span>RECOMMENDED OPERATIONAL COUNTERMEASURE</span>
                      </span>
                      <p className="text-xs text-primary font-medium leading-snug">
                        {card.recommendedAction}
                      </p>
                    </div>
                  </div>

                  {/* Action Footer: Primary 'Approve & Dispatch' CTA and Secondary 'Dismiss' */}
                  <div className="p-3 bg-surface-subtle/60 border-t border-border/80 flex items-center justify-between gap-2.5">
                    {isDismissed ? (
                      <div className="w-full flex items-center justify-between text-xs font-mono">
                        <span className="text-neutral-500 italic">Card archived by operator</span>
                        <button
                          onClick={() => handleUndoDismiss(card.id)}
                          className="flex items-center gap-1 text-orbit hover:underline text-xs font-bold"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Undo Dismiss</span>
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* Secondary Dismiss Button */}
                        <button
                          onClick={() => handleDismiss(card.id)}
                          disabled={isDispatched}
                          className="px-3.5 py-2 border border-border rounded-lg text-xs font-mono text-secondary hover:text-primary hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                          title="Dismiss this recommendation"
                        >
                          Dismiss
                        </button>

                        {/* Primary High-Contrast 'Approve & Dispatch' CTA */}
                        <button
                          onClick={() => handleApproveAndDispatch(card.id, card.actionId)}
                          disabled={isDispatched}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all shadow-sm ${
                            isDispatched
                              ? 'bg-safe/15 text-safe border border-safe/40 cursor-default font-bold'
                              : 'bg-primary hover:bg-neutral-800 text-white shadow-md active:scale-98'
                          }`}
                        >
                          {isDispatched ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-safe" />
                              <span>✓ DISPATCHED & ACTIVE</span>
                            </>
                          ) : (
                            <>
                              <Zap className="w-4 h-4 fill-current text-amber-400" />
                              <span>{card.actionLabel}</span>
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            }

            return null;
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="p-3 bg-white border border-border rounded-xl w-48 shadow-xs flex items-center gap-2.5 text-xs font-mono text-secondary">
              <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-spin" />
              <span>AI formulating action card...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-border bg-white shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Copilot (e.g. 'Simulate Gate A queue relief')..."
              className="flex-1 px-3.5 py-2.5 bg-surface border border-border rounded-lg text-xs font-mono text-primary placeholder:text-secondary focus:outline-none focus:border-orbit focus:ring-1 focus:ring-orbit/30"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-2.5 bg-primary hover:bg-neutral-800 disabled:opacity-40 text-white rounded-lg transition-colors shadow-xs"
              title="Send to Copilot"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between mt-2 text-[10px] font-mono text-secondary">
            <span>Powered by ORBIT Deterministic Incident Commander</span>
            <span className="text-orbit">Enter query or pick quick prompt</span>
          </div>
        </div>
      </div>
    </div>
  );
};
