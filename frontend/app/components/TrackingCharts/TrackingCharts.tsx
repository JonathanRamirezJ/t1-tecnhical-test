'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  TooltipItem,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Card } from '../../../lib';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface Variant {
  variant: string;
  interactions: number;
}

interface ComponentStat {
  componentName: string;
  variants: Variant[];
  totalInteractions: number;
}

interface TrackingChartsProps {
  stats?: {
    basicStats: ComponentStat[];
  };
  realTimeStats?: {
    totalInteractionsToday: number;
    activeUsers: number;
  };
}

const TrackingCharts: React.FC<TrackingChartsProps> = ({
  stats,
  realTimeStats,
}) => {
  if (!stats?.basicStats || stats.basicStats.length === 0) {
    return (
      <div className="mt-8">
        <Card variant="elevated" padding="lg">
          <div className="text-center py-8">
            <div className="text-gray-400 text-lg mb-2">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay datos de tracking disponibles
            </h3>
            <p className="text-gray-600">
              Los gráficos aparecerán cuando haya interacciones registradas.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // Colors for charts
  const colors = [
    '#3B82F6', // blue-500
    '#10B981', // green-500
    '#F59E0B', // yellow-500
    '#EF4444', // red-500
    '#8B5CF6', // purple-500
    '#06B6D4', // cyan-500
    '#F97316', // orange-500
    '#84CC16', // lime-500
  ];

  // Data for general components chart
  const overviewData = {
    labels: stats.basicStats.map(stat => stat.componentName),
    datasets: [
      {
        label: 'Total de Interacciones',
        data: stats.basicStats.map(stat => stat.totalInteractions),
        backgroundColor: colors.slice(0, stats.basicStats.length),
        borderColor: colors.slice(0, stats.basicStats.length),
        borderWidth: 1,
      },
    ],
  };

  const overviewOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Interacciones por Componente',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  // Function to create doughnut chart data for each component
  const createDoughnutData = (
    componentStat: ComponentStat,
    colorIndex: number
  ) => {
    const baseColor = colors[colorIndex % colors.length];
    const variantColors = componentStat.variants.map((_, index) => {
      // Generar variaciones del color base
      const opacity = 0.8 - index * 0.2;
      return `${baseColor}${Math.round(opacity * 255)
        .toString(16)
        .padStart(2, '0')}`;
    });

    return {
      labels: componentStat.variants.map(v => v.variant),
      datasets: [
        {
          data: componentStat.variants.map(v => v.interactions),
          backgroundColor: variantColors,
          borderColor: baseColor,
          borderWidth: 2,
        },
      ],
    };
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<'doughnut'>) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="mt-8 space-y-8">
      {/* General summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card variant="elevated" padding="lg">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {realTimeStats?.totalInteractionsToday || 0}
            </div>
            <div className="text-gray-600">Interacciones Hoy</div>
          </div>
        </Card>

        <Card variant="elevated" padding="lg">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats.basicStats.length}
            </div>
            <div className="text-gray-600">Componentes Activos</div>
          </div>
        </Card>

        <Card variant="elevated" padding="lg">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {stats.basicStats.reduce(
                (total, stat) => total + stat.totalInteractions,
                0
              )}
            </div>
            <div className="text-gray-600">Total Interacciones</div>
          </div>
        </Card>
      </div>

      {/* General bar chart */}
      <Card variant="elevated" padding="lg">
        <div className="h-80">
          <Bar data={overviewData} options={overviewOptions} />
        </div>
      </Card>

      {/* Individual charts */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900">
          📊 Análisis Detallado por Componente
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.basicStats.map((componentStat, index) => (
            <Card
              key={componentStat.componentName}
              variant="elevated"
              padding="lg"
            >
              <div className="space-y-4">
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    {componentStat.componentName}
                  </h4>
                  <div className="text-sm text-gray-600">
                    {componentStat.totalInteractions} interacciones totales
                  </div>
                </div>

                <div className="h-64">
                  <Doughnut
                    data={createDoughnutData(componentStat, index)}
                    options={doughnutOptions}
                  />
                </div>

                {/* Variant details */}
                <div className="space-y-2 pt-4 border-t">
                  {componentStat.variants.map((variant, variantIndex) => (
                    <div
                      key={variant.variant}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor:
                              colors[index % colors.length] +
                              Math.round((0.8 - variantIndex * 0.2) * 255)
                                .toString(16)
                                .padStart(2, '0'),
                          }}
                        />
                        <span className="text-sm text-gray-600">
                          {variant.variant}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {variant.interactions}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrackingCharts;
