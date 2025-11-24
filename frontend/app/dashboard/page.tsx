'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button } from '../../lib';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

function DashboardContent() {
  const router = useRouter();
  const { user, logout } = useAuth();

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card variant="elevated" padding="lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Bienvenido
              </h3>
              <p className="text-gray-600 mb-4">
                Has iniciado sesión exitosamente. Esta es una página protegida
                que solo pueden ver los usuarios autenticados.
              </p>
              <Button variant="primary" size="sm">
                Ver Perfil
              </Button>
            </Card>

            <Card variant="elevated" padding="lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Estadísticas
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Visitas:</span>
                  <span className="font-semibold">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Proyectos:</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tareas:</span>
                  <span className="font-semibold">45</span>
                </div>
              </div>
            </Card>

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
                  Ver Componentes
                </Button>
                <Button variant="secondary" size="sm" className="w-full">
                  Nuevo Proyecto
                </Button>
                <Button variant="secondary" size="sm" className="w-full">
                  Ver Reportes
                </Button>
                <Button variant="secondary" size="sm" className="w-full">
                  Configuración
                </Button>
              </div>
            </Card>
          </div>

          <div className="mt-8">
            <Card variant="outlined" padding="lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Actividad Reciente
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">
                    Proyecto "Website Redesign" completado
                  </span>
                  <span className="text-sm text-gray-500">hace 2 horas</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">
                    Nueva tarea asignada: "Revisar documentación"
                  </span>
                  <span className="text-sm text-gray-500">hace 4 horas</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-700">
                    Reunión programada para mañana
                  </span>
                  <span className="text-sm text-gray-500">hace 1 día</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
