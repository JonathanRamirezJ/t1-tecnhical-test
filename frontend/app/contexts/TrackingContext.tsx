'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { trackingAPI } from '../services/tracking.api';
import {
  RealTimeStats,
  TrackingStats,
  BackendRealTimeStats,
  BackendComponentStats,
} from '../services/tracking.types';

interface TrackingContextType {
  realTimeStats: RealTimeStats | null;
  stats: TrackingStats | null;
  isLoading: boolean;
  error: string | null;
  refreshStats: () => Promise<void>;
  exportData: (format: 'csv' | 'json') => Promise<void>;
  incrementInteraction: (componentName: string, action: string) => void;
  getLocalStats: () => LocalTrackingStats;
}

// Local store for real-time statistics
interface LocalTrackingStats {
  totalInteractionsToday: number;
  componentInteractions: Record<string, number>;
  actionInteractions: Record<string, number>;
  lastInteraction: string | null;
}

const TrackingContext = createContext<TrackingContextType | undefined>(
  undefined
);

export const useTrackingStats = () => {
  const context = useContext(TrackingContext);
  if (context === undefined) {
    throw new Error(
      'useTrackingStats debe ser usado dentro de un TrackingProvider'
    );
  }
  return context;
};

interface TrackingProviderProps {
  children: ReactNode;
}

export const TrackingProvider: React.FC<TrackingProviderProps> = ({
  children,
}) => {
  const [realTimeStats, setRealTimeStats] = useState<RealTimeStats | null>(
    null
  );
  const [stats, setStats] = useState<TrackingStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Local store for real-time statistics
  const [localStats, setLocalStats] = useState<LocalTrackingStats>(() => {
    // Load from localStorage if it exists
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tracking_local_stats');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // If there's an error parsing, use default values
        }
      }
    }
    return {
      totalInteractionsToday: 0,
      componentInteractions: {},
      actionInteractions: {},
      lastInteraction: null,
    };
  });

  // Adapter function removed - now we use local store

  // fetchRealTimeStats removed - now we use local store

  // Fetch general stats
  const fetchStats = async () => {
    try {
      const response = await trackingAPI.getStats();

      if (response.success && response.data) {
        setStats(response.data);

        // BUG FIX: Reset local statistics when loading from backend
        // to avoid double counting
        const resetLocalStats = {
          totalInteractionsToday: 0,
          componentInteractions: {},
          actionInteractions: {},
          lastInteraction: null,
        };
        setLocalStats(resetLocalStats);

        // Also clean localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            'tracking_local_stats',
            JSON.stringify(resetLocalStats)
          );
        }
      } else {
        console.error('❌ Error en /stats:', response.error);
        setError(response.error || 'Error al obtener estadísticas');
      }
    } catch (err) {
      console.error('❌ Error de conexión en /stats:', err);
      setError('Error de conexión al obtener estadísticas');
    }
  };

  // Refresh all stats
  const refreshStats = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Solo llamar a /stats, no a /realtime para evitar 429 errors
      await fetchStats();
    } catch (err) {
      setError('Error al actualizar estadísticas');
    } finally {
      setIsLoading(false);
    }
  };

  // Export data - descarga directa desde el backend
  const exportData = async (format: 'csv' | 'json') => {
    try {
      setIsLoading(true);
      setError(null);

      // Use backend export endpoint that generates and downloads the file directly
      const response = await trackingAPI.exportData({ format });

      if (response.success) {
        alert(`✅ Archivo ${format.toUpperCase()} descargado exitosamente`);
      } else {
        setError(
          response.error ||
            `Error al exportar datos en formato ${format.toUpperCase()}`
        );
        console.error('❌ Error en exportación:', response.error);
      }
    } catch (err) {
      const errorMessage = `Error al exportar datos en formato ${format.toUpperCase()}`;
      setError(errorMessage);
      console.error('❌ Error en exportData:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // functions for local store
  const incrementInteraction = (componentName: string, action: string) => {
    setLocalStats(prev => {
      const newStats = {
        ...prev,
        totalInteractionsToday: prev.totalInteractionsToday + 1,
        componentInteractions: {
          ...prev.componentInteractions,
          [componentName]: (prev.componentInteractions[componentName] || 0) + 1,
        },
        actionInteractions: {
          ...prev.actionInteractions,
          [action]: (prev.actionInteractions[action] || 0) + 1,
        },
        lastInteraction: new Date().toISOString(),
      };

      // save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('tracking_local_stats', JSON.stringify(newStats));
      }

      return newStats;
    });
  };

  const getLocalStats = (): LocalTrackingStats => {
    return localStats;
  };

  // combine stats from backend and local store
  const getCombinedStats = (): RealTimeStats => {
    // Calculate backend total using the correct structure
    let backendTotal = 0;

    // Option 1: Use summary.totalInteractions if it exists
    if (stats?.summary?.totalInteractions) {
      backendTotal = stats.summary.totalInteractions;
    }
    // Option 2: Sum totalInteractions from each component in basicStats
    else if (stats?.basicStats && Array.isArray(stats.basicStats)) {
      backendTotal = stats.basicStats.reduce(
        (total, component: BackendComponentStats) => {
          return total + (component.totalInteractions || 0);
        },
        0
      );
    }

    const localTotal = localStats.totalInteractionsToday;
    const finalTotal = backendTotal + localTotal;

    // combine topComponents from backend and local store
    const backendTopComponents = stats?.topComponents || [];
    const localTopComponents = Object.entries(
      localStats.componentInteractions
    ).map(([name, count]) => ({
      _id: name,
      count,
      lastUsed: localStats.lastInteraction || '',
    }));

    // Merge and sort top components
    const allTopComponents = [...backendTopComponents, ...localTopComponents];
    const mergedTopComponents = allTopComponents.reduce(
      (acc, component) => {
        const existing = acc.find(c => c._id === component._id);
        if (existing) {
          existing.count += component.count;
          // Use the most recent date
          if (component.lastUsed > existing.lastUsed) {
            existing.lastUsed = component.lastUsed;
          }
        } else {
          acc.push({ ...component });
        }
        return acc;
      },
      [] as typeof backendTopComponents
    );

    const combinedStats = {
      totalInteractionsToday: finalTotal,
      activeUsers: 1, // Usuario actual
      topComponentsToday: mergedTopComponents
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
      recentInteractions: stats?.recentInteractions || [],
      interactionsPerHour: [], // Se puede implementar si se necesita
    };

    return combinedStats;
  };

  // Load initial stats (only if user is authenticated) - NO auto-refresh to avoid 429 errors
  useEffect(() => {
    // Check if user is authenticated before making calls
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    if (!token) {
      console.log('🔒 No hay token - no se cargarán estadísticas de tracking');
      setIsLoading(false);
      return;
    }

    // Initial load only - no automatic refresh to prevent 429 errors
    refreshStats();
  }, []);

  // Actualizar realTimeStats cuando cambien los stats locales o del backend
  useEffect(() => {
    const combinedStats = getCombinedStats();
    setRealTimeStats(combinedStats);
  }, [localStats, stats]);

  const value: TrackingContextType = {
    realTimeStats,
    stats,
    isLoading,
    error,
    refreshStats,
    exportData,
    incrementInteraction,
    getLocalStats,
  };

  return (
    <TrackingContext.Provider value={value}>
      {children}
    </TrackingContext.Provider>
  );
};

export default TrackingProvider;
