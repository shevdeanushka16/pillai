/**
 * ORBIT Real-Time Sync Service
 * Coordinates seamless state synchronization between the Command Center (laptop)
 * and Attendee Digital Passes (smartphones or secondary windows).
 */

export interface SyncPayload {
  type: 'ORBIT_SYNC_UPDATE';
  simulationState: 'normal' | 'surge' | 'optimized';
  simulatedTime: string;
  divertActive: boolean;
  shuttleActive: boolean;
  staysActive: boolean;
  flattenActive: boolean;
  pressureScore: number;
  riskLevel: 'NORMAL' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  attendeeGate: string;
  attendeeRoute: string;
  gateQueueMin: number;
  fastTrackVoucher: boolean;
  timestamp: number;
  eventTitle?: string;
  venueName?: string;
  city?: string;
  primaryGate?: string;
  alternateGate?: string;
}

const STORAGE_KEY = 'orbit_sync_state';
const CHANNEL_NAME = 'orbit_sync_channel';

// Singleton broadcast channel
let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
  }
} catch {
  // Graceful fallback for older environments
}

/**
 * Broadcasts an updated state payload to all listening devices/tabs
 */
export async function broadcastSyncState(payload: SyncPayload): Promise<void> {
  // 1. BroadcastChannel (fast local cross-tab)
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage(payload);
    } catch {
      // Ignore error
    }
  }

  // 2. LocalStorage (offline storage event fallback)
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore error
    }
  }

  // 3. Network SSE/POST (cross-device over Wi-Fi / local network)
  try {
    await fetch('/api/sync/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // Silent fail if backend middleware not reachable
  }
}

/**
 * Subscribes to real-time sync updates from the Command Center
 */
export function subscribeToSync(
  onUpdate: (payload: SyncPayload) => void,
  onStatusChange?: (status: 'connected' | 'reconnecting' | 'offline') => void
): () => void {
  // Load initial cached state if present
  try {
    const cached = window.localStorage.getItem(STORAGE_KEY);
    if (cached) {
      onUpdate(JSON.parse(cached));
    }
  } catch {
    // Ignore cache load error
  }

  // 1. Listen via BroadcastChannel
  const handleChannelMsg = (event: MessageEvent<SyncPayload>) => {
    if (event.data && event.data.type === 'ORBIT_SYNC_UPDATE') {
      onUpdate(event.data);
    }
  };

  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleChannelMsg);
  }

  // 2. Listen via storage event (same-origin tabs fallback)
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue);
        if (parsed?.type === 'ORBIT_SYNC_UPDATE') {
          onUpdate(parsed);
        }
      } catch {
        // Ignore parse error
      }
    }
  };
  window.addEventListener('storage', handleStorage);

  // 3. Listen via SSE for true cross-device Wi-Fi sync
  let eventSource: EventSource | null = null;
  let sseActive = true;

  const connectSSE = () => {
    if (!sseActive || typeof window === 'undefined' || !('EventSource' in window)) return;

    try {
      eventSource = new EventSource('/api/sync/stream');

      eventSource.onopen = () => {
        onStatusChange?.('connected');
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data && data.type === 'ORBIT_SYNC_UPDATE') {
            onUpdate(data);
          }
        } catch {
          // Ignore
        }
      };

      eventSource.onerror = () => {
        onStatusChange?.('reconnecting');
        eventSource?.close();
        if (sseActive) {
          setTimeout(connectSSE, 3000);
        }
      };
    } catch {
      onStatusChange?.('offline');
    }
  };

  connectSSE();

  // Cleanup subscription
  return () => {
    sseActive = false;
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleChannelMsg);
    }
    window.removeEventListener('storage', handleStorage);
    if (eventSource) {
      eventSource.close();
    }
  };
}
