import { ApiResponse } from './api.types';
import {
  TrackingEvent,
  TrackingStats,
  BackendRealTimeStats,
  ExportOptions,
  TrackingResponse,
} from './tracking.types';

// API configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// Helper function for HTTP requests (with authentication)
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

  return makeRequest<T>(url, config);
}

// Helper function for public HTTP requests (no authentication required)
async function publicTrackingApiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    ...options,
  };

  return makeRequest<T>(url, config);
}

// Common request logic
async function makeRequest<T>(
  url: string,
  config: RequestInit
): Promise<ApiResponse<T>> {
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
    // Clean and validate data before sending
    const cleanMetadata: Record<string, string | number | boolean | undefined> =
      {
        ...event.metadata,
        // Only include safe fields in metadata
        timestamp: new Date().toISOString(),
        // Don't include URL or userAgent to avoid validation errors
      };

    // Remove undefined or null fields
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

    return publicTrackingApiRequest<TrackingResponse>('/components/track', {
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
    return publicTrackingApiRequest<TrackingStats>(endpoint);
  },

  // Get real-time statistics
  async getRealTimeStats(): Promise<ApiResponse<BackendRealTimeStats>> {
    return publicTrackingApiRequest<BackendRealTimeStats>(
      '/components/stats/realtime'
    );
  },

  // Export data - download file from backend
  async exportData(
    options: ExportOptions
  ): Promise<{ success: boolean; error?: string }> {
    const queryParams = new URLSearchParams();

    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const url = `${API_BASE_URL}/components/export?${queryParams.toString()}`;

    try {
      // Add authorization token
      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('auth_token')
          : null;
      const headers: Record<string, string> = {};

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: 'Error desconocido' }));
        return {
          success: false,
          error:
            errorData.message ||
            `Error ${response.status}: ${response.statusText}`,
        };
      }

      // Get filename from headers
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `tracking-data-${new Date().toISOString().split('T')[0]}.${options.format}`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Convert response to blob and download
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);

      // Create download element
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      link.style.display = 'none';

      // Add to DOM, click and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean URL
      URL.revokeObjectURL(downloadUrl);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error de red',
      };
    }
  },

  // Get component details
  async getComponentDetails(componentName: string): Promise<ApiResponse<any>> {
    return trackingApiRequest<any>(`/components/${componentName}/details`);
  },
};

export default trackingAPI;
