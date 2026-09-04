import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Calendar,
  MapPin,
  Users,
  Check,
  PlusCircle,
  Trophy,
  Music,
  Building2,
  Sparkles,
} from 'lucide-react';
import type { EventConfig } from '../../data/mockData';

export const EventSwitcherModal: React.FC = () => {
  const {
    showEventModal,
    setShowEventModal,
    currentEvent,
    eventsList,
    switchEvent,
    createCustomEvent,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'presets' | 'create'>('presets');

  // Custom event form state
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    date: '15 OCT 2026',
    city: '',
    venueName: '',
    type: 'sports' as EventConfig['type'],
    capacity: 50000,
    expectedAttendance: 68000,
    gatesCount: 4,
    primaryGate: 'Gate A (Main Plaza)',
    alternateGate: 'Gate C (Transit Concourse)',
    shuttleRoute: 'Dedicated City Shuttle',
    highwayCorridor: 'Arterial Ring Highway',
  });

  if (!showEventModal) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.venueName.trim()) return;

    createCustomEvent({
      title: form.title,
      subtitle: form.subtitle || 'Custom Event Deployment',
      date: form.date,
      city: form.city || 'Regional Hub',
      venueName: form.venueName,
      type: form.type,
      capacity: Number(form.capacity),
      expectedAttendance: Number(form.expectedAttendance),
      gatesCount: Number(form.gatesCount),
      primaryGate: form.primaryGate,
      alternateGate: form.alternateGate,
      shuttleRoute: form.shuttleRoute,
      highwayCorridor: form.highwayCorridor,
      statusBadge: form.type.toUpperCase() + ' / CUSTOM',
    });
  };

  const getEventIcon = (type: EventConfig['type']) => {
    switch (type) {
      case 'sports':
        return <Trophy className="w-4 h-4 text-amber-500" />;
      case 'concert':
        return <Music className="w-4 h-4 text-orbit" />;
      case 'expo':
        return <Building2 className="w-4 h-4 text-emerald-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-purple-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-border rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-primary font-mono tracking-tight">
                EVENT VENUE ORCHESTRATOR
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-primary text-white">
                MULTI-VENUE
              </span>
            </div>
            <p className="text-xs text-secondary mt-0.5">
              Switch active operations between mega-event venues or deploy a custom stadium/festival profile
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex border border-border rounded-lg p-0.5 bg-white text-xs font-mono">
              <button
                onClick={() => setActiveTab('presets')}
                className={`px-3 py-1 rounded transition-colors ${
                  activeTab === 'presets'
                    ? 'bg-primary text-white font-medium'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                Event Presets ({eventsList.length})
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`px-3 py-1 rounded transition-colors flex items-center gap-1 ${
                  activeTab === 'create'
                    ? 'bg-primary text-white font-medium'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Create New</span>
              </button>
            </div>

            <button
              onClick={() => setShowEventModal(false)}
              className="p-1.5 rounded-md text-secondary hover:text-primary hover:bg-surface transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'presets' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {eventsList.map((event) => {
                  const isActive = currentEvent.id === event.id;
                  return (
                    <div
                      key={event.id}
                      className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
                        isActive
                          ? 'border-2 border-orbit bg-orbit/5 shadow-md shadow-orbit/10'
                          : 'border-border bg-surface hover:border-border-strong'
                      }`}
                    >
                      <div>
                        {/* Top Badge */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-secondary flex items-center gap-1.5">
                            {getEventIcon(event.type)}
                            <span>{event.statusBadge}</span>
                          </span>
                          {isActive && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orbit text-white flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              <span>ACTIVE</span>
                            </span>
                          )}
                        </div>

                        {/* Event Title */}
                        <h3 className="text-base font-bold text-primary font-mono mt-3 leading-snug">
                          {event.title}
                        </h3>
                        <p className="text-xs text-secondary font-mono mt-0.5">
                          {event.venueName} • {event.city}
                        </p>

                        {/* Key Specs */}
                        <div className="mt-4 pt-3 border-t border-border space-y-2 text-xs font-mono">
                          <div className="flex items-center justify-between text-secondary">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>DATE</span>
                            </span>
                            <strong className="text-primary">{event.date}</strong>
                          </div>

                          <div className="flex items-center justify-between text-secondary">
                            <span className="flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5" />
                              <span>CAPACITY</span>
                            </span>
                            <strong className="text-primary">{event.capacity.toLocaleString()} seats</strong>
                          </div>

                          <div className="flex items-center justify-between text-secondary">
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>PEAK CROWD</span>
                            </span>
                            <strong className="text-orbit font-bold">
                              {event.expectedAttendance.toLocaleString()} pax
                            </strong>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-5 pt-3 border-t border-border">
                        {isActive ? (
                          <div className="w-full py-2 text-center text-xs font-mono text-orbit font-bold">
                            CURRENTLY OPERATING
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              switchEvent(event.id);
                              setShowEventModal(false);
                            }}
                            className="w-full py-2 bg-primary hover:bg-neutral-800 text-white rounded text-xs font-mono font-medium transition-colors"
                          >
                            ACTIVATE VENUE →
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 bg-surface-subtle border border-border rounded-lg text-xs font-mono text-secondary flex items-center justify-between">
                <span>
                  All mathematical coefficients, gate ratios, and transit feeds automatically recalibrate to the selected venue.
                </span>
                <button
                  onClick={() => setActiveTab('create')}
                  className="text-orbit hover:underline font-semibold shrink-0 ml-4"
                >
                  + Deploy Custom Stadium / Arena
                </button>
              </div>
            </div>
          ) : (
            /* Create Custom Event Form */
            <form onSubmit={handleCreate} className="space-y-5 max-w-2xl mx-auto">
              <div className="text-center pb-2">
                <h3 className="text-base font-bold text-primary font-mono">
                  CONFIGURE NEW MEGA-EVENT PROFILE
                </h3>
                <p className="text-xs text-secondary mt-1">
                  Define venue specifications, expected attendance, and arterial corridors to generate a custom mission profile
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="block uppercase text-secondary font-medium mb-1">
                    EVENT NAME *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Paris Summer Championship"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded bg-white text-primary focus:outline-none focus:border-orbit focus:ring-1 focus:ring-orbit/30"
                  />
                </div>

                <div>
                  <label className="block uppercase text-secondary font-medium mb-1">
                    VENUE NAME *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Stade de France"
                    value={form.venueName}
                    onChange={(e) => setForm({ ...form, venueName: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded bg-white text-primary focus:outline-none focus:border-orbit focus:ring-1 focus:ring-orbit/30"
                  />
                </div>

                <div>
                  <label className="block uppercase text-secondary font-medium mb-1">
                    CITY & REGION
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Paris, France"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded bg-white text-primary focus:outline-none focus:border-orbit focus:ring-1 focus:ring-orbit/30"
                  />
                </div>

                <div>
                  <label className="block uppercase text-secondary font-medium mb-1">
                    EVENT TYPE
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as EventConfig['type'] })}
                    className="w-full px-3 py-2 border border-border rounded bg-white text-primary focus:outline-none focus:border-orbit focus:ring-1 focus:ring-orbit/30"
                  >
                    <option value="sports">Sports Championship</option>
                    <option value="concert">Concert / Live Music</option>
                    <option value="expo">World Expo / Convention</option>
                    <option value="festival">Cultural Festival</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase text-secondary font-medium mb-1">
                    SEATED VENUE CAPACITY
                  </label>
                  <input
                    type="number"
                    min="1000"
                    max="500000"
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-border rounded bg-white text-primary focus:outline-none focus:border-orbit focus:ring-1 focus:ring-orbit/30"
                  />
                </div>

                <div>
                  <label className="block uppercase text-secondary font-medium mb-1">
                    EXPECTED PEAK ATTENDANCE
                  </label>
                  <input
                    type="number"
                    min="1000"
                    max="500000"
                    value={form.expectedAttendance}
                    onChange={(e) => setForm({ ...form, expectedAttendance: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-border rounded bg-white text-primary focus:outline-none focus:border-orbit focus:ring-1 focus:ring-orbit/30"
                  />
                </div>

                <div>
                  <label className="block uppercase text-secondary font-medium mb-1">
                    PRIMARY INGRESS GATE
                  </label>
                  <input
                    type="text"
                    value={form.primaryGate}
                    onChange={(e) => setForm({ ...form, primaryGate: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded bg-white text-primary focus:outline-none focus:border-orbit"
                  />
                </div>

                <div>
                  <label className="block uppercase text-secondary font-medium mb-1">
                    FAST-TRACK DIVERSION GATE
                  </label>
                  <input
                    type="text"
                    value={form.alternateGate}
                    onChange={(e) => setForm({ ...form, alternateGate: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded bg-white text-primary focus:outline-none focus:border-orbit"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setActiveTab('presets')}
                  className="px-4 py-2 border border-border rounded text-xs font-mono text-secondary hover:text-primary"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orbit hover:bg-orbit-hover text-white rounded text-xs font-mono font-medium transition-colors shadow-sm"
                >
                  DEPLOY VENUE TO COMMAND CENTER →
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
