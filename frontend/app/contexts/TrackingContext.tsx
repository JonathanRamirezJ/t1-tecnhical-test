'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { trackingAPI } from '../services/tracking.api';
import { RealTimeStats, TrackingStats } from '../services/tracking.types';

interface TrackingContextType {
  realTimeStats: RealTimeStats | null;
  stats: TrackingStats | null;
  isLoading: boolean;
  error: string | null;
  refreshStats: () => Promise<void>;
  exportData: (format: 'csv' | 'json') => Promise<void>;
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

  // Fetch real-time stats
  const fetchRealTimeStats = async () => {
    try {
      console.log('📊 Obteniendo estadísticas en tiempo real...');
      const response = await trackingAPI.getRealTimeStats();
      console.log('📊 Respuesta de estadísticas:', response);

      if (response.success && response.data) {
        setRealTimeStats(response.data);
        console.log('✅ Estadísticas actualizadas:', response.data);
      } else {
        console.error('❌ Error en estadísticas:', response.error);
        setError(
          response.error || 'Error al obtener estadísticas en tiempo real'
        );
      }
    } catch (err) {
      console.error('❌ Error de conexión:', err);
      setError('Error de conexión al obtener estadísticas');
    }
  };

  // Fetch general stats
  const fetchStats = async () => {
    try {
      const response = await trackingAPI.getStats();
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError(response.error || 'Error al obtener estadísticas');
      }
    } catch (err) {
      setError('Error de conexión al obtener estadísticas');
    }
  };

  // Refresh all stats
  const refreshStats = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await Promise.all([fetchRealTimeStats(), fetchStats()]);
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

  // Auto-refresh real-time stats every 30 seconds (only if user is authenticated)
  useEffect(() => {
    // Check if user is authenticated before making calls
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    if (!token) {
      console.log('🔒 No hay token - no se cargarán estadísticas de tracking');
      setIsLoading(false);
      return;
    }

    console.log('🔑 Usuario autenticado - cargando estadísticas de tracking');

    // Initial load
    refreshStats();

    // Set up interval for real-time updates
    const interval = setInterval(() => {
      // Check token again before each update
      const currentToken =
        typeof window !== 'undefined'
          ? localStorage.getItem('auth_token')
          : null;
      if (currentToken) {
        fetchRealTimeStats();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  const value: TrackingContextType = {
    realTimeStats,
    stats,
    isLoading,
    error,
    refreshStats,
    exportData,
  };

  return (
    <TrackingContext.Provider value={value}>
      {children}
    </TrackingContext.Provider>
  );
};

export default TrackingProvider;
