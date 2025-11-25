'use client';

import React from 'react';
import { Card } from '../../../lib';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import { TrackingCharts } from '../';

interface AnalyticsSectionProps {
  stats: any;
  realTimeStats: any;
}

const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
  stats,
  realTimeStats,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card variant="elevated" padding="lg">
        <div className="text-center">
          <ChartBarIcon className="h-12 w-12 text-purple-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Análisis Detallado por Componente
          </h2>
          <p className="text-gray-600">
            Visualización avanzada de las estadísticas de interacción con
            gráficos profesionales
          </p>
        </div>
      </Card>

      {/* Información sobre los gráficos */}
      <Card variant="elevated" padding="lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📊 Tipos de Visualización
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <div className="w-6 h-6 bg-blue-500 rounded"></div>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">
              Métricas Generales
            </h4>
            <p className="text-sm text-gray-600">
              Resumen ejecutivo con las estadísticas más importantes
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <div className="space-y-1">
                <div className="w-6 h-1 bg-green-500 rounded"></div>
                <div className="w-4 h-1 bg-green-400 rounded"></div>
                <div className="w-5 h-1 bg-green-300 rounded"></div>
              </div>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">
              Gráfico de Barras
            </h4>
            <p className="text-sm text-gray-600">
              Comparación de interacciones entre componentes
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <div className="w-6 h-6 border-4 border-purple-500 rounded-full border-t-transparent"></div>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Gráficos de Dona</h4>
            <p className="text-sm text-gray-600">
              Distribución de variantes por cada componente
            </p>
          </div>
        </div>
      </Card>

      {/* Gráficos */}
      <TrackingCharts stats={stats} realTimeStats={realTimeStats} />

      {/* Insights y recomendaciones */}
      <Card variant="elevated" padding="lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          💡 Insights y Recomendaciones
        </h3>
        <div className="space-y-4">
          {stats?.basicStats && stats.basicStats.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Componente más popular
                </h4>
                <p className="text-sm text-gray-600">
                  <strong className="text-blue-600">
                    {stats.basicStats[0]?.componentName}
                  </strong>{' '}
                  es el componente con más interacciones (
                  {stats.basicStats[0]?.totalInteractions} total)
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Variantes más utilizadas
                </h4>
                <p className="text-sm text-gray-600">
                  Las variantes primarias tienden a tener más interacciones que
                  las secundarias
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-lg mb-2">📈</div>
              <p className="text-gray-600">
                Los insights aparecerán cuando haya suficientes datos de
                interacción
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsSection;
