'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button } from '../../lib';
import ProtectedRoute from '../components/ProtectedRoute';

interface ComponentInfo {
  name: string;
  description: string;
  path: string;
  icon: string;
  status: 'stable' | 'beta' | 'experimental';
}

const components: ComponentInfo[] = [
  {
    name: 'Button',
    description:
      'Botones interactivos con múltiples variantes, tamaños y estados.',
    path: '/components-demo/button',
    icon: '🔘',
    status: 'stable',
  },
  {
    name: 'Input',
    description:
      'Campos de entrada con validación, etiquetas y estados de error.',
    path: '/components-demo/input',
    icon: '📝',
    status: 'stable',
  },
  {
    name: 'Card',
    description: 'Contenedores flexibles para mostrar contenido agrupado.',
    path: '/components-demo/card',
    icon: '🃏',
    status: 'stable',
  },
  {
    name: 'Modal',
    description: 'Ventanas modales para mostrar contenido superpuesto.',
    path: '/components-demo/modal',
    icon: '🪟',
    status: 'stable',
  },
];

function ComponentsDemoContent() {
  const router = useRouter();

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  const getStatusColor = (status: ComponentInfo['status']) => {
    switch (status) {
      case 'stable':
        return 'bg-green-100 text-green-800';
      case 'beta':
        return 'bg-yellow-100 text-yellow-800';
      case 'experimental':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="mb-8">
          <Button variant="secondary" onClick={handleBackToDashboard}>
            ← Volver al Dashboard
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎨 Style Guide
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Documentación completa de componentes con ejemplos, código y
            especificaciones. Explora cada componente para ver sus variantes,
            props y casos de uso.
          </p>
        </div>

        {/* Components Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {components.map(component => (
            <Card
              key={component.name}
              variant="elevated"
              padding="lg"
              hoverable
              onClick={() => router.push(component.path)}
              className="cursor-pointer transition-all duration-200 hover:shadow-lg"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{component.icon}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {component.name}
                    </h3>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(component.status)}`}
                    >
                      {component.status}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{component.description}</p>

              <Button variant="primary" size="sm" className="w-full">
                Ver Documentación →
              </Button>
            </Card>
          ))}
        </div>

        {/* Footer Info */}
        <Card variant="outlined" padding="lg" className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            ¿Necesitas ayuda?
          </h3>
          <p className="text-gray-600 mb-4">
            Cada componente incluye ejemplos interactivos, código copiable y
            documentación completa de props.
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="secondary" size="sm">
              📚 Guía de Uso
            </Button>
            <Button variant="secondary" size="sm">
              🎯 Mejores Prácticas
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function ComponentsDemoPage() {
  return (
    <ProtectedRoute>
      <ComponentsDemoContent />
    </ProtectedRoute>
  );
}
