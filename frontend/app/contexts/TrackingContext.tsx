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
  // Funciones para el store local
  incrementInteraction: (componentName: string, action: string) => void;
  getLocalStats: () => LocalTrackingStats;
}

// Store local para estadísticas en tiempo real
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

  // Store local para estadísticas en tiempo real
  const [localStats, setLocalStats] = useState<LocalTrackingStats>(() => {
    // Cargar desde localStorage si existe
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tracking_local_stats');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // Si hay error al parsear, usar valores por defecto
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

  // Función adaptadora eliminada - ahora usamos store local

  // fetchRealTimeStats eliminado - ahora usamos store local

  // Fetch general stats
  const fetchStats = async () => {
    try {
      const response = await trackingAPI.getStats();

      if (response.success && response.data) {
        setStats(response.data);

        // SOLUCIÓN AL BUG: Resetear estadísticas locales cuando se cargan del backend
        // para evitar doble conteo
        const resetLocalStats = {
          totalInteractionsToday: 0,
          componentInteractions: {},
          actionInteractions: {},
          lastInteraction: null,
        };
        setLocalStats(resetLocalStats);

        // También limpiar localStorage
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

  // Export data
  const exportData = async (format: 'csv' | 'json') => {
    try {
      setIsLoading(true);
      const response = await trackingAPI.exportData({ format });

      if (response.success && response.data?.downloadUrl) {
        // Create a temporary link to download the file
        const link = document.createElement('a');
        link.href = response.data.downloadUrl;
        link.download = `tracking-data.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        setError(response.error || 'Error al exportar datos');
      }
    } catch (err) {
      setError('Error al exportar datos');
    } finally {
      setIsLoading(false);
    }
  };

  // Funciones del store local
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

      // Guardar en localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('tracking_local_stats', JSON.stringify(newStats));
      }

      return newStats;
    });
  };

  const getLocalStats = (): LocalTrackingStats => {
    return localStats;
  };

  // Combinar stats del backend con stats locales
  const getCombinedStats = (): RealTimeStats => {
    // Calcular total del backend usando la estructura correcta
    let backendTotal = 0;

    // Opción 1: Usar summary.totalInteractions si existe
    if (stats?.summary?.totalInteractions) {
      backendTotal = stats.summary.totalInteractions;
    }
    // Opción 2: Sumar totalInteractions de cada componente en basicStats
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

    // Combinar topComponents del backend con los locales
    const backendTopComponents = stats?.topComponents || [];
    const localTopComponents = Object.entries(
      localStats.componentInteractions
    ).map(([name, count]) => ({
      _id: name,
      count,
      lastUsed: localStats.lastInteraction || '',
    }));

    // Merge y ordenar top components
    const allTopComponents = [...backendTopComponents, ...localTopComponents];
    const mergedTopComponents = allTopComponents.reduce(
      (acc, component) => {
        const existing = acc.find(c => c._id === component._id);
        if (existing) {
          existing.count += component.count;
          // Usar la fecha más reciente
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

  // Función global removida - solo refresh manual para evitar 429 errors

  return (
    <TrackingContext.Provider value={value}>
      {children}
    </TrackingContext.Provider>
  );
};

export default TrackingProvider;
