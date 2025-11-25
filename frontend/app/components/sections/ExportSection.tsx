'use client';

import React from 'react';
import { Card, Button } from '../../../lib';
import {
  DocumentArrowDownIcon,
  TableCellsIcon,
  CodeBracketIcon,
} from '@heroicons/react/24/outline';

interface ExportSectionProps {
  exportData: (format: 'csv' | 'json') => void;
  isLoading: boolean;
}

const ExportSection: React.FC<ExportSectionProps> = ({
  exportData,
  isLoading,
}) => {
  const exportOptions = [
    {
      format: 'csv',
      title: 'Exportar CSV',
      description: 'Formato compatible con Excel y hojas de cálculo',
      icon: TableCellsIcon,
      color: 'green',
    },
    {
      format: 'json',
      title: 'Exportar JSON',
      description: 'Formato estructurado para desarrolladores',
      icon: CodeBracketIcon,
      color: 'blue',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card variant="elevated" padding="lg">
        <div className="text-center">
          <DocumentArrowDownIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Exportar Datos
          </h2>
          <p className="text-gray-600">
            Descarga las estadísticas de interacciones en diferentes formatos
          </p>
        </div>
      </Card>

      {/* Opciones de exportación */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exportOptions.map(option => {
          const Icon = option.icon;
          return (
            <Card key={option.format} variant="elevated" padding="lg">
              <div className="text-center space-y-4">
                <Icon
                  className={`h-10 w-10 mx-auto ${
                    option.color === 'green'
                      ? 'text-green-600'
                      : 'text-blue-600'
                  }`}
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {option.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {option.description}
                  </p>
                </div>
                <Button
                  variant={option.color === 'green' ? 'secondary' : 'primary'}
                  size="md"
                  className="w-full"
                  onClick={() => exportData(option.format as 'csv' | 'json')}
                  disabled={isLoading}
                >
                  {isLoading
                    ? '⏳ Procesando...'
                    : `📄 Descargar ${option.format.toUpperCase()}`}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Información adicional */}
      <Card variant="elevated" padding="lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          ℹ️ Información sobre la Exportación
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                ¿Qué datos se incluyen?
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Interacciones por componente</li>
                <li>• Variantes y sus estadísticas</li>
                <li>• Fechas y timestamps</li>
                <li>• Datos de usuarios (anónimos)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Formatos disponibles
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  • <strong>CSV:</strong> Para análisis en Excel
                </li>
                <li>
                  • <strong>JSON:</strong> Para integración técnica
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Última exportación:</span>
              <span>Nunca</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ExportSection;
