export type SimulationState = 'normal' | 'surge' | 'optimized';

export interface StateMetrics {
  visitors: number;
  crowdDensity: number;
  hotelOccupancy: number;
  transportLoad: number;
  venueCapacity: number;
}

export interface ZoneData {
  id: string;
  name: string;
  district: string;
  crowdDensity: number;
  status: 'NORMAL' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  currentVisitors: number;
  capacityLimit: number;
}

export interface HotelData {
  zone: string;
  hotelsCount: number;
  availableRooms: number;
  totalRooms: number;
  occupancy: number;
  status: 'AVAILABLE' | 'MODERATE' | 'HIGH' | 'CRITICAL';
}

export interface RouteData {
  id: string;
  name: string;
  load: number;
  travelTimeMin: number;
  status: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  active: boolean;
  type: 'highway' | 'express' | 'shuttle' | 'rail';
}

export interface TimelineEvent {
  time: string;
  label: string;
  description: string;
  isPeak?: boolean;
}

export interface ActionItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  detail: string;
  expectedImpact: string;
  buttonText: string;
  activeText: string;
  applied: boolean;
}

export const STATE_METRICS: Record<SimulationState, StateMetrics> = {
  normal: {
    visitors: 48200,
    crowdDensity: 52,
    hotelOccupancy: 62,
    transportLoad: 54,
    venueCapacity: 58,
  },
  surge: {
    visitors: 92500,
    crowdDensity: 90,
    hotelOccupancy: 91,
    transportLoad: 88,
    venueCapacity: 94,
  },
  optimized: {
    visitors: 92500,
    crowdDensity: 67,
    hotelOccupancy: 72,
    transportLoad: 55,
    venueCapacity: 76,
  },
};

export const INITIAL_ZONES: Record<SimulationState, ZoneData[]> = {
  normal: [
    { id: 'zone-a', name: 'Zone A', district: 'Venue District', crowdDensity: 58, status: 'MODERATE', currentVisitors: 28000, capacityLimit: 48000 },
    { id: 'zone-b', name: 'Zone B', district: 'Hospitality District', crowdDensity: 50, status: 'NORMAL', currentVisitors: 12000, capacityLimit: 24000 },
    { id: 'zone-c', name: 'Zone C', district: 'Transit District', crowdDensity: 44, status: 'NORMAL', currentVisitors: 6200, capacityLimit: 14000 },
    { id: 'zone-d', name: 'Zone D', district: 'Overflow District', crowdDensity: 20, status: 'NORMAL', currentVisitors: 2000, capacityLimit: 10000 },
  ],
  surge: [
    { id: 'zone-a', name: 'Zone A', district: 'Venue District', crowdDensity: 90, status: 'CRITICAL', currentVisitors: 45100, capacityLimit: 48000 },
    { id: 'zone-b', name: 'Zone B', district: 'Hospitality District', crowdDensity: 58, status: 'MODERATE', currentVisitors: 23500, capacityLimit: 24000 },
    { id: 'zone-c', name: 'Zone C', district: 'Transit District', crowdDensity: 84, status: 'HIGH', currentVisitors: 16800, capacityLimit: 14000 },
    { id: 'zone-d', name: 'Zone D', district: 'Overflow District', crowdDensity: 31, status: 'NORMAL', currentVisitors: 7100, capacityLimit: 10000 },
  ],
  optimized: [
    { id: 'zone-a', name: 'Zone A', district: 'Venue District', crowdDensity: 74, status: 'HIGH', currentVisitors: 35500, capacityLimit: 48000 },
    { id: 'zone-b', name: 'Zone B', district: 'Hospitality District', crowdDensity: 64, status: 'MODERATE', currentVisitors: 21000, capacityLimit: 24000 },
    { id: 'zone-c', name: 'Zone C', district: 'Transit District', crowdDensity: 52, status: 'MODERATE', currentVisitors: 22000, capacityLimit: 14000 },
    { id: 'zone-d', name: 'Zone D', district: 'Overflow District', crowdDensity: 46, status: 'NORMAL', currentVisitors: 14000, capacityLimit: 10000 },
  ],
};

export const ACCOMMODATION_DATA: Record<SimulationState, HotelData[]> = {
  normal: [
    { zone: 'Zone A', hotelsCount: 24, availableRooms: 680, totalRooms: 2000, occupancy: 66, status: 'MODERATE' },
    { zone: 'Zone B', hotelsCount: 31, availableRooms: 950, totalRooms: 2000, occupancy: 52, status: 'AVAILABLE' },
    { zone: 'Zone C', hotelsCount: 18, availableRooms: 1200, totalRooms: 1800, occupancy: 33, status: 'AVAILABLE' },
    { zone: 'Zone D', hotelsCount: 12, availableRooms: 650, totalRooms: 1000, occupancy: 35, status: 'AVAILABLE' },
  ],
  surge: [
    { zone: 'Zone A', hotelsCount: 24, availableRooms: 120, totalRooms: 2000, occupancy: 94, status: 'CRITICAL' },
    { zone: 'Zone B', hotelsCount: 31, availableRooms: 580, totalRooms: 2000, occupancy: 71, status: 'HIGH' },
    { zone: 'Zone C', hotelsCount: 18, availableRooms: 940, totalRooms: 1800, occupancy: 48, status: 'AVAILABLE' },
    { zone: 'Zone D', hotelsCount: 12, availableRooms: 420, totalRooms: 1000, occupancy: 58, status: 'AVAILABLE' },
  ],
  optimized: [
    { zone: 'Zone A', hotelsCount: 24, availableRooms: 440, totalRooms: 2000, occupancy: 78, status: 'HIGH' },
    { zone: 'Zone B', hotelsCount: 31, availableRooms: 620, totalRooms: 2000, occupancy: 69, status: 'MODERATE' },
    { zone: 'Zone C', hotelsCount: 18, availableRooms: 480, totalRooms: 1800, occupancy: 73, status: 'MODERATE' },
    { zone: 'Zone D', hotelsCount: 12, availableRooms: 380, totalRooms: 1000, occupancy: 62, status: 'MODERATE' },
  ],
};

export const TRANSPORT_ROUTES: Record<SimulationState, RouteData[]> = {
  normal: [
    { id: 'route-1', name: 'ROUTE 1 (Highway Corridor)', load: 58, travelTimeMin: 14, status: 'MODERATE', active: true, type: 'highway' },
    { id: 'route-2', name: 'ROUTE 2 (Western Express)', load: 48, travelTimeMin: 19, status: 'LOW', active: true, type: 'express' },
    { id: 'route-3', name: 'ROUTE 3 (Dedicated Shuttle)', load: 24, travelTimeMin: 20, status: 'LOW', active: false, type: 'shuttle' },
    { id: 'route-4', name: 'ROUTE 4 (Suburban Link)', load: 52, travelTimeMin: 22, status: 'MODERATE', active: true, type: 'rail' },
  ],
  surge: [
    { id: 'route-1', name: 'ROUTE 1 (Highway Corridor)', load: 92, travelTimeMin: 18, status: 'CRITICAL', active: true, type: 'highway' },
    { id: 'route-2', name: 'ROUTE 2 (Western Express)', load: 61, travelTimeMin: 24, status: 'MODERATE', active: true, type: 'express' },
    { id: 'route-3', name: 'ROUTE 3 (Dedicated Shuttle)', load: 38, travelTimeMin: 21, status: 'LOW', active: false, type: 'shuttle' },
    { id: 'route-4', name: 'ROUTE 4 (Suburban Link)', load: 77, travelTimeMin: 29, status: 'HIGH', active: true, type: 'rail' },
  ],
  optimized: [
    { id: 'route-1', name: 'ROUTE 1 (Highway Corridor)', load: 64, travelTimeMin: 15, status: 'MODERATE', active: true, type: 'highway' },
    { id: 'route-2', name: 'ROUTE 2 (Western Express)', load: 54, travelTimeMin: 21, status: 'MODERATE', active: true, type: 'express' },
    { id: 'route-3', name: 'ROUTE 3 (Dedicated Shuttle)', load: 58, travelTimeMin: 17, status: 'MODERATE', active: true, type: 'shuttle' },
    { id: 'route-4', name: 'ROUTE 4 (Suburban Link)', load: 56, travelTimeMin: 23, status: 'MODERATE', active: true, type: 'rail' },
  ],
};

export const PREDICTION_TIMELINES: Record<SimulationState, { label: string; load: number; projectedVisitors: number }[]> = {
  normal: [
    { label: 'NOW', load: 48, projectedVisitors: 48200 },
    { label: '+10 MIN', load: 50, projectedVisitors: 50100 },
    { label: '+20 MIN', load: 52, projectedVisitors: 52300 },
    { label: '+30 MIN', load: 54, projectedVisitors: 54500 },
  ],
  surge: [
    { label: 'NOW', load: 82, projectedVisitors: 82500 },
    { label: '+10 MIN', load: 87, projectedVisitors: 87800 },
    { label: '+20 MIN', load: 92, projectedVisitors: 92100 },
    { label: '+30 MIN', load: 96, projectedVisitors: 96000 },
  ],
  optimized: [
    { label: 'NOW', load: 82, projectedVisitors: 82500 },
    { label: '+10 MIN', load: 78, projectedVisitors: 78200 },
    { label: '+20 MIN', load: 71, projectedVisitors: 71000 },
    { label: '+30 MIN', load: 67, projectedVisitors: 67300 },
  ],
};

export const TIMELINE_SCHEDULE: TimelineEvent[] = [
  { time: '3:00 PM', label: 'Gates Open', description: 'Early attendee access and venue perimeter security clearance' },
  { time: '4:00 PM', label: 'Opening Event', description: 'Cultural warmup performances & vendor zones open' },
  { time: '5:00 PM', label: 'Main Performance', description: 'Primary stage acts begin, surge in metro corridor' },
  { time: '7:00 PM', label: 'Headliner', description: 'Predicted peak concentration across all gates and arterial links', isPeak: true },
  { time: '9:30 PM', label: 'Event Exit', description: 'Coordinated phased egress and bus express staging' },
];

export const INITIAL_ACTIONS: ActionItem[] = [
  {
    id: 'divert-arrivals',
    number: '01',
    title: 'DIVERT ARRIVALS',
    subtitle: 'Gate A → Gate C',
    detail: '12,000 visitors queued',
    expectedImpact: '−18% venue pressure',
    buttonText: 'APPLY →',
    activeText: 'APPLIED ✓',
    applied: false,
  },
  {
    id: 'activate-shuttle',
    number: '02',
    title: 'ACTIVATE SHUTTLE',
    subtitle: 'Route 3 Express',
    detail: 'Deploy 18 fleet buses via dedicated corridor',
    expectedImpact: '−21% transport load',
    buttonText: 'ACTIVATE →',
    activeText: 'ACTIVE ✓',
    applied: false,
  },
  {
    id: 'shift-stays',
    number: '03',
    title: 'SHIFT STAYS',
    subtitle: 'Zone A → Zone C',
    detail: '820 rooms available in northern hospitality cluster',
    expectedImpact: 'Rebalance accommodation saturation',
    buttonText: 'VIEW & SHIFT →',
    activeText: 'SHIFTED ✓',
    applied: false,
  },
  {
    id: 'flatten-arrivals',
    number: '04',
    title: 'FLATTEN ARRIVALS',
    subtitle: 'Dynamic Ingress Incentive',
    detail: 'Encourage arrivals between 4:30–5:30 PM',
    expectedImpact: 'Reduce peak concentration at 7:00 PM',
    buttonText: 'APPLY →',
    activeText: 'ACTIVE ✓',
    applied: false,
  },
];

export interface EventConfig {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  city: string;
  venueName: string;
  type: 'concert' | 'sports' | 'expo' | 'festival';
  capacity: number;
  expectedAttendance: number;
  gatesCount: number;
  primaryGate: string;
  alternateGate: string;
  shuttleRoute: string;
  highwayCorridor: string;
  statusBadge: string;
}

export const PRESET_EVENTS: EventConfig[] = [
  {
    id: 'bkc-concert',
    title: 'Mumbai Mega Concert',
    subtitle: 'Global Stadium Tour 2026',
    date: '03 SEP 2026',
    city: 'Mumbai',
    venueName: 'BKC Arena',
    type: 'concert',
    capacity: 65000,
    expectedAttendance: 92500,
    gatesCount: 3,
    primaryGate: 'Gate A',
    alternateGate: 'Gate C',
    shuttleRoute: 'Route 3 (Dedicated Shuttle)',
    highwayCorridor: 'Route 1 (Highway Corridor)',
    statusBadge: 'ENTERTAINMENT / LIVE MUSIC',
  },
  {
    id: 'wankhede-derby',
    title: 'Wankhede Cricket Derby',
    subtitle: 'T20 Championship Grand Final',
    date: '18 OCT 2026',
    city: 'Mumbai',
    venueName: 'Wankhede Stadium',
    type: 'sports',
    capacity: 33500,
    expectedAttendance: 45000,
    gatesCount: 4,
    primaryGate: 'Gate 1 (North Stand)',
    alternateGate: 'Gate 4 (Marine Drive Link)',
    shuttleRoute: 'Marine Drive Express Bus',
    highwayCorridor: 'Coastal Road Corridor',
    statusBadge: 'SPORTS / CHAMPIONSHIP',
  },
  {
    id: 'bharat-expo',
    title: 'Bharat Mandapam World Expo',
    subtitle: 'Global Tech & Trade Summit',
    date: '12 NOV 2026',
    city: 'New Delhi',
    venueName: 'Bharat Mandapam (Pragati Maidan)',
    type: 'expo',
    capacity: 75000,
    expectedAttendance: 110000,
    gatesCount: 5,
    primaryGate: 'Gate 4 (Mathura Road)',
    alternateGate: 'Gate 10 (Metro Concourse)',
    shuttleRoute: 'Pragati Maidan Ring Shuttle',
    highwayCorridor: 'Ring Road Expressway',
    statusBadge: 'SUMMIT / TRADE EXPO',
  },
];
