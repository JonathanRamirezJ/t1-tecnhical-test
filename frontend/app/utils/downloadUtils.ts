import {
  TrackingStats,
  RealTimeStats,
  BackendComponentStats,
} from '../services/tracking.types';

/**
 * Utilidades para descargar archivos en el frontend
 */

// Tipos específicos para exportación
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
 * Convierte datos a formato CSV y los descarga
 */
export const downloadCSV = (
  data: CSVExportRow[],
  filename: string = 'export.csv'
): void => {
  if (!data || data.length === 0) {
    console.warn('No hay datos para exportar');
    return;
  }

  // Definir el orden de las columnas
  const headers: (keyof CSVExportRow)[] = [
    'Componente',
    'Variante',
    'Interacciones',
    'Total Componente',
    'Fecha Exportación',
    'Hora Exportación',
  ];

  // Crear contenido CSV
  const csvContent = [
    // Headers
    headers.join(','),
    // Datos
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

  // Crear blob y descargar
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, filename);
};

/**
 * Convierte datos a formato JSON y los descarga
 */
export const downloadJSON = (
  data: JSONExportData,
  filename: string = 'export.json'
): void => {
  if (!data) {
    console.warn('No hay datos para exportar');
    return;
  }

  // Convertir a JSON con formato bonito
  const jsonContent = JSON.stringify(data, null, 2);

  // Crear blob y descargar
  const blob = new Blob([jsonContent], {
    type: 'application/json;charset=utf-8;',
  });
  downloadBlob(blob, filename);
};

/**
 * Descarga un blob como archivo
 */
const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  // Agregar al DOM, hacer clic y remover
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Limpiar URL
  URL.revokeObjectURL(url);
};

/**
 * Formatea los datos de tracking para exportación CSV
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
 * Formatea los datos de tracking para exportación JSON
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
