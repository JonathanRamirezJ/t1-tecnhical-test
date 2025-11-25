import {
  TrackingStats,
  RealTimeStats,
  BackendComponentStats,
} from '../services/tracking.types';

/**
 * Utils for downloading files in the frontend
 */

// Specific types for export functionality
export interface CSVExportRow {
  Componente: string;
  Variante: string;
  Interacciones: number;
  'Total Componente': number;
  'Fecha Exportación': string;
  'Hora Exportación': string;
}

export interface JSONExportData {
  exportInfo: {
    timestamp: string;
    exportDate: string;
    exportTime: string;
    totalComponents: number;
    totalInteractions: number;
  };
  realTimeStats: {
    totalInteractionsToday: number;
    activeUsers: number;
    lastUpdated: string;
  };
  componentStats: BackendComponentStats[];
  topComponents: Array<{ _id: string; count: number; lastUsed?: string }>;
  metadata: {
    version: string;
    source: string;
    description: string;
  };
}

/**
 * Converts data to CSV format and downloads it
 */
export const downloadCSV = (
  data: CSVExportRow[],
  filename: string = 'export.csv'
): void => {
  if (!data || data.length === 0) {
    console.warn('No hay datos para exportar');
    return;
  }

  // Define the order of columns
  const headers: (keyof CSVExportRow)[] = [
    'Componente',
    'Variante',
    'Interacciones',
    'Total Componente',
    'Fecha Exportación',
    'Hora Exportación',
  ];

  // Create CSV content
  const csvContent = [
    // Headers
    headers.join(','),
    // Data
    ...data.map(row =>
      headers
        .map(header => {
          const value = row[header];
          // Escapar comillas y envolver en comillas si contiene comas
          if (
            typeof value === 'string' &&
            (value.includes(',') || value.includes('"'))
          ) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return String(value ?? '');
        })
        .join(',')
    ),
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, filename);
};

/**
 * Converts data to JSON format and downloads it
 */
export const downloadJSON = (
  data: JSONExportData,
  filename: string = 'export.json'
): void => {
  if (!data) {
    console.warn('No hay datos para exportar');
    return;
  }

  // Convert to JSON with pretty formatting
  const jsonContent = JSON.stringify(data, null, 2);

  // Create blob and download
  const blob = new Blob([jsonContent], {
    type: 'application/json;charset=utf-8;',
  });
  downloadBlob(blob, filename);
};

/**
 * Downloads a blob as a file
 */
const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  // Add to DOM, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up URL
  URL.revokeObjectURL(url);
};

/**
 * Formats tracking data for CSV export
 */
export const formatTrackingDataForCSV = (
  stats: TrackingStats
): CSVExportRow[] => {
  if (!stats?.basicStats) return [];

  const csvData: CSVExportRow[] = [];

  stats.basicStats.forEach((component: BackendComponentStats) => {
    component.variants.forEach(variant => {
      csvData.push({
        Componente: component.componentName,
        Variante: variant.variant,
        Interacciones: variant.interactions,
        'Total Componente': component.totalInteractions,
        'Fecha Exportación': new Date().toISOString().split('T')[0],
        'Hora Exportación': new Date().toLocaleTimeString(),
      });
    });
  });

  return csvData;
};

/**
 * Formats tracking data for JSON export
 */
export const formatTrackingDataForJSON = (
  stats: TrackingStats,
  realTimeStats: RealTimeStats | null
): JSONExportData => {
  return {
    exportInfo: {
      timestamp: new Date().toISOString(),
      exportDate: new Date().toLocaleDateString(),
      exportTime: new Date().toLocaleTimeString(),
      totalComponents: stats?.basicStats?.length || 0,
      totalInteractions:
        stats?.basicStats?.reduce(
          (total: number, stat: BackendComponentStats) =>
            total + stat.totalInteractions,
          0
        ) || 0,
    },
    realTimeStats: {
      totalInteractionsToday: realTimeStats?.totalInteractionsToday || 0,
      activeUsers: realTimeStats?.activeUsers || 0,
      lastUpdated: new Date().toISOString(),
    },
    componentStats: stats?.basicStats || [],
    topComponents: stats?.topComponents || [],
    metadata: {
      version: '1.0',
      source: 'T1 Technical Test - Tracking System',
      description: 'Estadísticas de interacción con componentes UI',
    },
  };
};
