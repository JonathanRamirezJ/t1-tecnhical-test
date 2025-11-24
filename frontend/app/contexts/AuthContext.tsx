'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { User } from '../services/api.types';
import { AuthContextType, AuthProviderProps } from './AuthContext.types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // check auth status
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // check if there is a token saved
        const token =
          typeof window !== 'undefined'
            ? localStorage.getItem('auth_token')
            : null;

        if (token) {
          // check if the token is valid
          const response = await authAPI.getMe();
          if (response.success && response.data) {
            setUser(response.data);
          } else {
            // if the token is not valid, remove it
            localStorage.removeItem('auth_token');
          }
        }
      } catch (error) {
        console.error(
          'AuthContext: Error verificando estado de autenticación:',
          error
        );
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);

    try {
      const response = await authAPI.login({ email, password });

      if (response.success && response.data) {
        setUser(response.data.user);
      } else {
        throw new Error(response.error || 'Error en el login');
      }
    } catch (error) {
      console.error('AuthContext: Error en login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<void> => {
    setIsLoading(true);

    try {
      const response = await authAPI.register({ name, email, password });

      if (response.success && response.data) {
        setUser(response.data.user);
      } else {
        throw new Error(response.error || 'Error en el registro');
      }
    } catch (error) {
      console.error('AuthContext: Error en registro:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);

    try {
      await authAPI.logout();
      setUser(null);
    } catch (error) {
      console.error('Error durante logout:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
