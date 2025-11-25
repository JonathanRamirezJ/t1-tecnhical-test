import React, { useCallback, useEffect, useRef } from 'react';
import { trackingAPI } from '../services/tracking.api';
import { TrackingEvent } from '../services/tracking.types';

interface UseTrackingOptions {
  componentName: string;
  variant?: string;
  autoTrack?: boolean; // Auto-track mount/unmount
  trackClicks?: boolean; // Auto-track clicks
  trackHovers?: boolean; // Auto-track hovers
  trackFocus?: boolean; // Auto-track focus events
  debounceMs?: number; // Debounce time for rapid events
}

interface TrackingMethods {
  track: (action: string, metadata?: any) => Promise<void>;
  trackClick: (metadata?: any) => Promise<void>;
  trackHover: (metadata?: any) => Promise<void>;
  trackFocusEvent: (metadata?: any) => Promise<void>;
  trackCustom: (action: string, metadata?: any) => Promise<void>;
}

export const useTracking = (options: UseTrackingOptions): TrackingMethods => {
  const {
    componentName,
    variant,
    autoTrack = true,
    trackClicks = false,
    trackHovers = false,
    trackFocus = false,
    debounceMs = 300,
  } = options;

  const debounceRef = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const mountTimeRef = useRef<number>(Date.now());

  // Generic tracking function
  const track = useCallback(
    async (action: string, metadata: any = {}) => {
      try {
        const performanceData = {
          renderTime: Date.now() - mountTimeRef.current,
          interactionTime: Date.now(),
        };

        const trackingEvent: Omit<TrackingEvent, 'sessionId'> = {
          componentName,
          variant,
          action,
          metadata: {
            ...metadata,
            elementId:
              metadata.elementId || `${componentName}-${variant || 'default'}`,
          },
          performance: performanceData,
        };

        await trackingAPI.trackComponent(trackingEvent);
      } catch (error) {
        // Fail silently to not break the user experience
        console.warn('Tracking failed:', error);
      }
    },
    [componentName, variant]
  );

  // Debounced tracking function
  const debouncedTrack = useCallback(
    (action: string, metadata: any = {}) => {
      const key = `${action}-${JSON.stringify(metadata)}`;

      if (debounceRef.current[key]) {
        clearTimeout(debounceRef.current[key]);
      }

      debounceRef.current[key] = setTimeout(() => {
        track(action, metadata);
        delete debounceRef.current[key];
      }, debounceMs);
    },
    [track, debounceMs]
  );

  // Specific tracking methods
  const trackClick = useCallback(
    async (metadata: any = {}) => {
      await track('click', { ...metadata, eventType: 'click' });
    },
    [track]
  );

  const trackHover = useCallback(
    async (metadata: any = {}) => {
      debouncedTrack('hover', { ...metadata, eventType: 'hover' });
    },
    [debouncedTrack]
  );

  const trackFocusEvent = useCallback(
    async (metadata: any = {}) => {
      await track('focus', { ...metadata, eventType: 'focus' });
    },
    [track]
  );

  const trackCustom = useCallback(
    async (action: string, metadata: any = {}) => {
      await track(action, { ...metadata, eventType: 'custom' });
    },
    [track]
  );

  // Auto-track component lifecycle (desactivado por defecto)
  useEffect(() => {
    if (autoTrack) {
      // Solo trackear mount si está explícitamente habilitado
      track('mount', { lifecycle: 'mount' });

      return () => {
        track('unmount', {
          lifecycle: 'unmount',
          sessionDuration: Date.now() - mountTimeRef.current,
        });
      };
    }
  }, [autoTrack, track]);

  // Cleanup debounce timers
  useEffect(() => {
    return () => {
      Object.values(debounceRef.current).forEach(clearTimeout);
    };
  }, []);

  return {
    track,
    trackClick,
    trackHover,
    trackFocusEvent,
    trackCustom,
  };
};

// HOC for automatic tracking (opcional - puedes eliminarlo si no lo usas)
// export const withTracking = ...

export default useTracking;
