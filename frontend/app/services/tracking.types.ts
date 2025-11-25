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
  totalInteractions: number;
  totalPages: number;
  currentPage: number;
  basicStats: ComponentStats[];
  dailyStats: DailyStats[];
  recentInteractions: RecentInteraction[];
  topComponents: TopComponent[];
  topActions: TopAction[];
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
