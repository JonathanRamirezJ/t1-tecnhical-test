'use client';

import React from 'react';
import {
  HomeIcon,
  SwatchIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  BeakerIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

interface MenuItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const menuItems: MenuItem[] = [
  {
    id: 'home',
    name: 'Dashboard',
    icon: HomeIcon,
    description: 'Vista general del sistema',
  },
  {
    id: 'components',
    name: 'Guía de Estilos',
    icon: SwatchIcon,
    description: 'Componentes y estilos',
  },
  {
    id: 'demo',
    name: 'Tracking',
    icon: BeakerIcon,
    description: 'Demostración del sistema',
  },
  {
    id: 'analytics',
    name: 'Análisis Detallado',
    icon: ChartBarIcon,
    description: 'Gráficos y estadísticas',
  },
  {
    id: 'export',
    name: 'Exportar Datos',
    icon: DocumentArrowDownIcon,
    description: 'Descargar información',
  },
];

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggle,
  activeSection,
  onSectionChange,
}) => {
  const isMobile = useMediaQuery('(max-width: 1023px)'); // Detectar móvil (antes del lg breakpoint)

  const handleSectionChange = (section: string) => {
    onSectionChange(section);

    // Auto-cerrar sidebar en móvil después de seleccionar una opción
    if (isMobile && !isCollapsed) {
      onToggle();
    }
  };
  return (
    <>
      {/* Overlay para móvil - solo se muestra cuando el sidebar está abierto en móvil */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 flex flex-col bg-white shadow-xl transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-16' : 'w-64'}
          ${isCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
        `}
      >
        {/* Header del sidebar */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-gray-900 truncate">
              Menú Principal
            </h2>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={isCollapsed ? 'Expandir menú' : 'Contraer menú'}
          >
            {isCollapsed ? (
              <Bars3Icon className="h-5 w-5" />
            ) : (
              <XMarkIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSectionChange(item.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title={isCollapsed ? item.name : ''}
              >
                <Icon
                  className={`h-5 w-5 flex-shrink-0 ${
                    isActive ? 'text-blue-700' : 'text-gray-400'
                  }`}
                />
                {!isCollapsed && (
                  <div className="ml-3 flex-1 text-left">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {item.description}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer del sidebar */}
        <div className="border-t border-gray-200 p-4">
          {!isCollapsed && (
            <div className="text-xs text-gray-500 text-center">
              <div className="font-medium">Sistema de Tracking</div>
              <div className="mt-1">v1.0.0</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
