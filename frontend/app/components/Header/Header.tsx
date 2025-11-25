'use client';

import React from 'react';
import { Button } from '../../../lib';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Bars3Icon } from '@heroicons/react/24/outline';

interface HeaderProps {
  title: string;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  showBackButton?: boolean;
  backButtonText?: string;
  backButtonAction?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  sidebarCollapsed,
  onToggleSidebar,
  showBackButton = false,
  backButtonText = '← Volver',
  backButtonAction,
}) => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:hidden"
              aria-label={sidebarCollapsed ? 'Expandir menú' : 'Contraer menú'}
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            {showBackButton && backButtonAction && (
              <Button
                variant="secondary"
                size="sm"
                onClick={backButtonAction}
                className="hidden sm:inline-flex"
              >
                {backButtonText}
              </Button>
            )}
            <Button
              variant="danger"
              size="sm"
              onClick={handleLogout}
              className="text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Cerrar Sesión</span>
              <span className="sm:hidden">Salir</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
