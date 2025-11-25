'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button } from '../../lib';
import { useAuth } from '../contexts/AuthContext';
import { useTrackingStats } from '../contexts/TrackingContext';
import ProtectedRoute from '../components/ProtectedRoute';
import ConditionalTrackingProvider from '../components/ConditionalTrackingProvider';
import TrackingDemo from '../components/TrackingDemo';

function DashboardContent() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { realTimeStats, isLoading, error, refreshStats, exportData, stats } =
    useTrackingStats();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              {user && (
                <p className="text-sm text-gray-600 mt-1">
                  Bienvenido, {user.name || user.email}
                </p>
              )}
            </div>
            <Button variant="secondary" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 my-6">
            <Card variant="elevated" padding="lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Bienvenido
              </h3>
              <p className="text-gray-600 mb-4">
                Has iniciado sesión exitosamente. Esta es una página protegida
                que solo pueden ver los usuarios autenticados.
              </p>
            </Card>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card variant="elevated" padding="lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Acciones Rápidas
              </h3>
              <div className="space-y-3">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={() => router.push('/components-demo')}
                >
                  Ver guia de estilos de componentes
                </Button>
              </div>
            </Card>

            <Card variant="elevated" padding="lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  📊 Estadísticas de Tracking
                </h3>
              </div>
              <div className="text-xs text-gray-500 mb-3">
                💡 Las estadísticas se actualizan manualmente para evitar
                sobrecarga del servidor
              </div>
              {error ? (
                <div className="text-red-600 text-sm">{error}</div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Interacciones hoy:</span>
                    <span className="font-semibold text-blue-600">
                      {realTimeStats?.totalInteractionsToday || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Usuarios activos:</span>
                    <span className="font-semibold text-green-600">
                      {realTimeStats?.activeUsers || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Componente más usado:</span>
                    <span className="font-semibold text-blue-300">
                      {stats?.topComponents?.[0]?._id || 'N/A'}
                    </span>
                  </div>
                </div>
              )}
              <div className="flex justify-center mt-4">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={refreshStats}
                  disabled={isLoading}
                >
                  🔄 Actualizar Estadísticas
                </Button>
              </div>
            </Card>

            <Card variant="elevated" padding="lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📊 Exportar Datos
              </h3>
              <div className="space-y-4">
                <p className="text-gray-600 text-sm">
                  Exporta las estadísticas de interacciones en diferentes
                  formatos
                </p>
                <div className="space-y-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => exportData('csv')}
                    disabled={isLoading}
                  >
                    📄 Exportar CSV
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => exportData('json')}
                    disabled={isLoading}
                  >
                    📋 Exportar JSON
                  </Button>
                </div>
                <div className="pt-2 border-t text-xs text-gray-500">
                  Última exportación: Nunca
                </div>
              </div>
            </Card>
          </div>

          {/* Sistema de Tracking */}
          <div className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card variant="elevated" padding="lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🎯 Sistema de Tracking
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Estado:</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Activo
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Interacciones hoy:</span>
                    <span className="font-semibold text-blue-600">
                      {realTimeStats?.totalInteractionsToday || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Componentes trackeados:
                    </span>
                    <span className="font-semibold text-green-600">4</span>
                  </div>
                </div>
              </Card>

              <Card variant="elevated" padding="lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Componentes trackeados:
                </h3>
                {stats?.basicStats.map(stat => (
                  <div
                    className="flex justify-between"
                    key={stat.componentName}
                  >
                    <span className="text-gray-600">{stat.componentName}:</span>
                    <span className="text-gray-600">
                      {stat.variants
                        .map(
                          variant =>
                            variant.variant + ' (' + variant.interactions + ')'
                        )
                        .join(', ')}
                    </span>
                    <span className="font-semibold text-green-600">
                      {stat.totalInteractions}
                    </span>
                  </div>
                ))}
              </Card>
            </div>
          </div>

          {/* Demo del Sistema de Tracking */}
          <div className="mt-8">
            <TrackingDemo />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <ConditionalTrackingProvider>
        <DashboardContent />
      </ConditionalTrackingProvider>
    </ProtectedRoute>
  );
}
