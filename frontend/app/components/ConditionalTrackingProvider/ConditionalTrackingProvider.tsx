'use client';

import React, { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { TrackingProvider } from '../../contexts/TrackingContext';

interface ConditionalTrackingProviderProps {
  children: ReactNode;
}

export const ConditionalTrackingProvider: React.FC<
  ConditionalTrackingProviderProps
> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Si está cargando, no renderizar el tracking provider aún
  if (isLoading) {
    return <>{children}</>;
  }

  // Solo activar tracking si el usuario está autenticado
  if (isAuthenticated) {
    return <TrackingProvider>{children}</TrackingProvider>;
  }

  // Si no está autenticado, renderizar sin tracking
  return <>{children}</>;
};

export default ConditionalTrackingProvider;
