import type { StateMetrics } from '../data/mockData';

export type RiskLevel = 'NORMAL' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface RiskEvaluation {
  level: RiskLevel;
  score: number;
  label: string;
  colorHex: string;
  bgHex: string;
  borderHex: string;
  badgeClass: string;
  description: string;
}

export interface EngineRule {
  id: string;
  condition: string;
  action: string;
  triggered: boolean;
  metric: string;
  value: number;
  threshold: number;
}

/**
 * ORBIT Explainable Decision Engine
 * Dynamic capacity pressure formula:
 * pressureScore = 0.40 * crowdDensity + 0.25 * transportLoad + 0.20 * hotelOccupancy + 0.15 * venueCapacity
 */
export function calculatePressureScore(metrics: StateMetrics): number {
  const score =
    0.40 * metrics.crowdDensity +
    0.25 * metrics.transportLoad +
    0.20 * metrics.hotelOccupancy +
    0.15 * metrics.venueCapacity;

  return Math.round(score);
}

/**
 * Risk tier mapping
 * 0–39: NORMAL
 * 40–59: MODERATE
 * 60–79: HIGH
 * 80–100: CRITICAL
 */
export function getRiskLevel(score: number): RiskEvaluation {
  if (score >= 80) {
    return {
      level: 'CRITICAL',
      score,
      label: 'CRITICAL',
      colorHex: '#B83232',
      bgHex: '#FCEDED',
      borderHex: '#F3B4B4',
      badgeClass: 'bg-critical-subtle text-critical-text border-critical/30',
      description: 'Severe strain detected across arterial transport corridors and venue gates. Immediate coordination advised.',
    };
  }
  if (score >= 60) {
    return {
      level: 'HIGH',
      score,
      label: 'HIGH',
      colorHex: '#C65D2E',
      bgHex: '#FDF1EB',
      borderHex: '#F7C6B0',
      badgeClass: 'bg-high-subtle text-high-text border-high/30',
      description: 'Pressure is building rapidly around the venue district. Pre-emptive redistribution recommended.',
    };
  }
  if (score >= 40) {
    return {
      level: 'MODERATE',
      score,
      label: 'MODERATE',
      colorHex: '#B7791F',
      bgHex: '#FEF8EE',
      borderHex: '#F8DCAD',
      badgeClass: 'bg-warning-subtle text-warning-text border-warning/30',
      description: 'Elevated activity within acceptable operating buffers. Standard flow controls maintained.',
    };
  }
  return {
    level: 'NORMAL',
    score,
    label: 'NORMAL',
    colorHex: '#247A52',
    bgHex: '#EBF6F0',
    borderHex: '#A9DFC3',
    badgeClass: 'bg-safe-subtle text-safe-text border-safe/30',
    description: 'System operating smoothly within planned capacity margins. Flow rates optimal.',
  };
}

/**
 * Transparent rule execution engine
 */
export function evaluateEngineRules(metrics: StateMetrics, score: number): EngineRule[] {
  return [
    {
      id: 'rule-crowd',
      condition: 'crowdDensity > 80%',
      action: 'Visitor redistribution across outer perimeter and auxiliary zones',
      triggered: metrics.crowdDensity > 80,
      metric: 'Crowd Density',
      value: metrics.crowdDensity,
      threshold: 80,
    },
    {
      id: 'rule-transport',
      condition: 'transportLoad > 80%',
      action: 'Activate dedicated alternate transport (Shuttle Route 3 & Metro express bypass)',
      triggered: metrics.transportLoad > 80,
      metric: 'Transport Load',
      value: metrics.transportLoad,
      threshold: 80,
    },
    {
      id: 'rule-hotel',
      condition: 'hotelOccupancy > 85%',
      action: 'Recommend alternative accommodation clusters (Zone C / Zone D transfer)',
      triggered: metrics.hotelOccupancy > 85,
      metric: 'Hotel Occupancy',
      value: metrics.hotelOccupancy,
      threshold: 85,
    },
    {
      id: 'rule-venue',
      condition: 'venueCapacity > 90%',
      action: 'Gate diversion protocol (Re-route Gate A ingress to Gate C)',
      triggered: metrics.venueCapacity > 90,
      metric: 'Venue Capacity',
      value: metrics.venueCapacity,
      threshold: 90,
    },
    {
      id: 'rule-pressure',
      condition: 'pressureScore > 80',
      action: 'Declare unified event critical alert and broadcast automated recommendations',
      triggered: score > 80,
      metric: 'Event Pressure Score',
      value: score,
      threshold: 80,
    },
  ];
}
