import { ApiResponse } from './api.types';
import {
  TrackingEvent,
  TrackingStats,
  RealTimeStats,
  BackendRealTimeStats,
  ExportOptions,
  TrackingResponse,
} from './tracking.types';

// API configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// Helper function for HTTP requests
async function trackingApiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add authorization token if exists
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  } else {
    console.warn(
      '⚠️ No hay token disponible para tracking - usuario no autenticado'
    );
  }

  const config: RequestInit = {
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || `HTTP error! status: ${response.status}`,
      };
    }

    if (data.status === 'success') {
      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } else {
      return {
        success: false,
        error: data.message || 'Error desconocido',
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// Generate session ID
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Get or create session ID
function getSessionId(): string {
  if (typeof window === 'undefined') return generateSessionId();

  let sessionId = sessionStorage.getItem('tracking_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('tracking_session_id', sessionId);
  }
  return sessionId;
}

// Tracking API
export const trackingAPI = {
  // Track component interaction
  async trackComponent(
    event: Omit<TrackingEvent, 'sessionId'>
  ): Promise<ApiResponse<TrackingResponse>> {
    // Limpiar y validar datos antes de enviar
    const cleanMetadata: Record<string, unknown> = {
      ...event.metadata,
      // Solo incluir campos seguros en metadata
      timestamp: new Date().toISOString(),
      // No incluir URL ni userAgent para evitar errores de validación
    };

    // Remover campos undefined o null
    Object.keys(cleanMetadata).forEach(key => {
      if (cleanMetadata[key] === undefined || cleanMetadata[key] === null) {
        delete cleanMetadata[key];
      }
    });

    const trackingEvent: TrackingEvent = {
      componentName: event.componentName,
      variant: event.variant || 'default',
      action: event.action,
      sessionId: getSessionId(),
      metadata: cleanMetadata,
      location: {
        pathname: typeof window !== 'undefined' ? window.location.pathname : '',
        search: typeof window !== 'undefined' ? window.location.search : '',
        hash: typeof window !== 'undefined' ? window.location.hash : '',
      },
    };

    return trackingApiRequest<TrackingResponse>('/components/track', {
      method: 'POST',
      body: JSON.stringify(trackingEvent),
    });
  },

  // Get statistics
  async getStats(params?: {
    startDate?: string;
    endDate?: string;
    componentName?: string;
    variant?: string;
    action?: string;
    limit?: number;
    page?: number;
  }): Promise<ApiResponse<TrackingStats>> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/components/stats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return trackingApiRequest<TrackingStats>(endpoint);
  },

  // Get real-time statistics
  async getRealTimeStats(): Promise<ApiResponse<BackendRealTimeStats>> {
    return trackingApiRequest<BackendRealTimeStats>(
      '/components/stats/realtime'
    );
  },

  // Export data
  async exportData(
    options: ExportOptions
  ): Promise<ApiResponse<{ downloadUrl: string }>> {
    const queryParams = new URLSearchParams();

    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const endpoint = `/components/export?${queryParams.toString()}`;
    return trackingApiRequest<{ downloadUrl: string }>(endpoint);
  },

  // Get component details
  async getComponentDetails(componentName: string): Promise<ApiResponse<any>> {
    return trackingApiRequest<any>(`/components/${componentName}/details`);
  },
};

export default trackingAPI;
