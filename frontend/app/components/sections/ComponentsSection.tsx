'use client';

import React from 'react';
import { Card, Button } from '../../../lib';
import { useRouter } from 'next/navigation';
import {
  SwatchIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';

const ComponentsSection: React.FC = () => {
  const router = useRouter();

  const componentCategories = [
    {
      id: 'button',
      name: 'Botones',
      description:
        'Botones interactivos con múltiples variantes, tamaños y estados.',
      count: 3,
      color: 'blue',
    },
    {
      id: 'card',
      name: 'Tarjetas',
      description: 'Contenedores flexibles para mostrar contenido agrupado.',
      count: 3,
      color: 'green',
    },
    {
      id: 'modal',
      name: 'Modal',
      description: 'Ventanas modales para mostrar contenido superpuesto.',
      count: 3,
      color: 'purple',
    },
    {
      id: 'input',
      name: 'inputs',
      description:
        'Campos de entrada con validación, etiquetas y estados de error.',
      count: 3,
      color: 'orange',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card variant="elevated" padding="lg">
        <div className="text-center">
          <SwatchIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Guía de Estilos de Componentes
          </h2>
          <p className="text-gray-600 mb-4">
            Explora todos los componentes disponibles en el sistema de diseño
          </p>
        </div>
      </Card>

      {/* Categorías de componentes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {componentCategories.map(category => (
          <Card key={category.name} variant="elevated" padding="lg">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    category.color === 'blue'
                      ? 'bg-blue-500'
                      : category.color === 'green'
                        ? 'bg-green-500'
                        : category.color === 'purple'
                          ? 'bg-purple-500'
                          : 'bg-orange-500'
                  }`}
                />
                <h3 className="text-lg font-semibold text-gray-900">
                  {category.name}
                </h3>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                  {category.count} componentes
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">
                  Estable
                </span>
              </div>
              <p className="text-gray-600 text-sm">{category.description}</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => router.push('/components-demo/' + category.id)}
                className="w-full"
              >
                Ver documentación →
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Información adicional */}
      <Card variant="elevated" padding="lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🎨 Sistema de Diseño
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Colores</h4>
            <div className="flex space-x-2">
              <div className="w-6 h-6 bg-blue-500 rounded"></div>
              <div className="w-6 h-6 bg-red-500 rounded"></div>
              <div className="w-6 h-6 bg-gray-300 rounded"></div>
              <div className="w-6 h-6 bg-gray-100 rounded"></div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Tipografía</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="font-bold">Bold - Títulos</div>
              <div className="font-medium">Medium - Subtítulos</div>
              <div className="font-normal">Normal - Texto</div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Espaciado</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div>Padding: sm, md, lg</div>
              <div>Margin: auto, responsive</div>
              <div>Gap: grid system</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ComponentsSection;
