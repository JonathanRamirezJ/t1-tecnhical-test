'use client';

import React from 'react';
import { Card } from '../../../lib';
import { BeakerIcon } from '@heroicons/react/24/outline';
import { TrackingDemo } from '../';

const DemoSection: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card variant="elevated" padding="lg">
        <div className="text-center">
          <BeakerIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Sistema de Tracking
          </h2>
          <p className="text-gray-600">
            Interactúa con los componentes para ver el sistema de tracking en
            acción
          </p>
        </div>
      </Card>

      {/* Instrucciones */}
      <Card variant="elevated" padding="lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📋 Instrucciones
        </h3>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
              1
            </span>
            <p>
              <strong>Interactúa con los componentes</strong> - Haz clic en los
              botones y tarjetas para generar eventos de tracking
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium">
              2
            </span>
            <p>
              <strong>Observa las estadísticas</strong> - Ve cómo se actualizan
              los contadores en tiempo real
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-medium">
              3
            </span>
            <p>
              <strong>Revisa los gráficos</strong> - Navega a la sección de
              análisis para ver los datos visualizados
            </p>
          </div>
        </div>
      </Card>

      {/* Demo Component */}
      <TrackingDemo />

      {/* Información técnica */}
      <Card variant="elevated" padding="lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🔧 Información Técnica
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              ¿Cómo funciona el tracking?
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Eventos capturados en tiempo real</li>
              <li>• Almacenamiento en base de datos</li>
              <li>• Agregación de estadísticas</li>
              <li>• Visualización en gráficos</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              Datos recopilados
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Tipo de componente</li>
              <li>• Variante utilizada</li>
              <li>• Timestamp del evento</li>
              <li>• Sesión del usuario</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DemoSection;
