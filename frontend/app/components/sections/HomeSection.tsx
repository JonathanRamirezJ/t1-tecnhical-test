'use client';

import React from 'react';
import { Card, Button } from '../../../lib';
import { useRouter } from 'next/navigation';

interface HomeSectionProps {
  user: any;
  realTimeStats: any;
  stats: any;
  error: string | null;
  isLoading: boolean;
  refreshStats: () => void;
}

const HomeSection: React.FC<HomeSectionProps> = ({
  user,
  realTimeStats,
  stats,
  error,
  isLoading,
  refreshStats,
}) => {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <Card variant="elevated" padding="lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          👋 Bienvenido al Dashboard
        </h3>
        <p className="text-gray-600 mb-4">
          Has iniciado sesión exitosamente como{' '}
          <span className="font-medium text-blue-600">
            {user?.name || user?.email}
          </span>
          . Esta es tu vista general del sistema de tracking.
        </p>
      </Card>

      {/* stacks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="elevated" padding="lg">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {realTimeStats?.totalInteractionsToday || 0}
            </div>
            <div className="text-gray-600 font-medium">Interacciones Hoy</div>
            <div className="text-xs text-gray-500 mt-1">
              Actualizadas en tiempo real
            </div>
          </div>
        </Card>

        <Card variant="elevated" padding="lg">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {realTimeStats?.activeUsers || 0}
            </div>
            <div className="text-gray-600 font-medium">Usuarios Activos</div>
            <div className="text-xs text-gray-500 mt-1">Conectados ahora</div>
          </div>
        </Card>

        <Card variant="elevated" padding="lg">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {stats?.basicStats?.length || 0}
            </div>
            <div className="text-gray-600 font-medium">Componentes</div>
            <div className="text-xs text-gray-500 mt-1">
              Siendo monitoreados
            </div>
          </div>
        </Card>
      </div>

      {/* Resume */}
      <Card variant="elevated" padding="lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📊 Resumen de Actividad
        </h3>
        {error ? (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Estado del sistema:</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  🟢 Activo
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Componente más usado:</span>
                <span className="font-semibold text-blue-600">
                  {stats?.topComponents?.[0]?._id || 'N/A'}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Última actualización:</span>
                <span className="text-sm text-gray-500">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={refreshStats}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading
                  ? '⏳ Actualizando...'
                  : '🔄 Actualizar Estadísticas'}
              </Button>
            </div>
          </div>
        )}
      </Card>

      <footer className="text-center mt-10 text-xs text-gray-500 flex flex-col gap-1 w-full justify-center">
        <div className="flex gap-1 w-full justify-center">
          Desarrollado por
          <a
            href="https://github.com/JonathanRamirezJ/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="text-xs text-gray-500 hover:text-gray-600 hover:underline">
              Jonathan Ramirez
            </span>
          </a>
        </div>
        <div>Software Engineer.</div>
      </footer>
    </div>
  );
};

export default HomeSection;
