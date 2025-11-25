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

  // If loading, don't render the tracking provider yet
  if (isLoading) {
    return <>{children}</>;
  }

  // Only activate tracking if user is authenticated
  if (isAuthenticated) {
    return <TrackingProvider>{children}</TrackingProvider>;
  }

  // If not authenticated, render without tracking
  return <>{children}</>;
};

export default ConditionalTrackingProvider;
