// Types for tracking system
export interface TrackingEvent {
  componentName: string;
  variant?: string;
  action: string;
  sessionId: string;
  metadata?: {
    url?: string;
    userAgent?: string;
    timestamp?: string;
    elementId?: string;
    elementText?: string;
    [key: string]: any;
  };
  performance?: {
    loadTime?: number;
    renderTime?: number;
    interactionTime?: number;
  };
  location?: {
    pathname?: string;
    search?: string;
    hash?: string;
  };
}

export interface TrackingStats {
  summary: {
    totalInteractions: number;
    totalPages: number;
    currentPage: number;
    resultsPerPage: number;
  };
  basicStats: BackendComponentStats[];
  dailyStats: DailyStats[];
  recentInteractions: RecentInteraction[];
  topComponents: TopComponent[];
  topActions: TopAction[];
}

export interface BackendComponentStats {
  totalInteractions: number;
  componentName: string;
  variants: Array<{
    variant: string;
    interactions: number;
    actions: Array<{
      action: string;
      count: number;
    }>;
    lastUsed: string;
    firstUsed: string;
  }>;
}

export interface ComponentStats {
  _id: string;
  count: number;
  avgPerformance?: number;
}

export interface DailyStats {
  _id: string;
  count: number;
  date: string;
}

export interface RecentInteraction {
  _id: string;
  componentName: string;
  variant?: string;
  action: string;
  timestamp: string;
  sessionId: string;
  metadata?: {
    url?: string;
  };
}

export interface TopComponent {
  _id: string;
  count: number;
  lastUsed: string;
}

export interface TopAction {
  _id: string;
  count: number;
}

// Estructura que devuelve el backend para estadísticas en tiempo real
export interface BackendRealTimeStats {
  realTime: {
    lastHour: {
      totalInteractions: number;
      uniqueComponents: number;
      uniqueSessions: number;
    };
    lastDay: {
      totalInteractions: number;
      uniqueComponents: number;
      uniqueSessions: number;
    };
    minutelyActivity: Array<{
      _id: {
        year: number;
        month: number;
        day: number;
        hour: number;
        minute: number;
      };
      count: number;
    }>;
  };
  timestamp: string;
}

// Estructura que usa el frontend (adaptada)
export interface RealTimeStats {
  totalInteractionsToday: number;
  activeUsers: number;
  topComponentsToday: TopComponent[];
  recentInteractions: RecentInteraction[];
  interactionsPerHour: Array<{
    hour: number;
    count: number;
  }>;
}

export interface ExportOptions {
  format: 'csv' | 'json';
  startDate?: string;
  endDate?: string;
  componentName?: string;
  variant?: string;
  action?: string;
}

export interface TrackingResponse {
  tracking: {
    id: string;
    componentName: string;
    variant: string;
    action: string;
    timestamp: string;
  };
}
