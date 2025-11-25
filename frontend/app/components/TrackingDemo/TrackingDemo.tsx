'use client';

import React, { useState } from 'react';
import { Card, Button, Input, Modal } from '../../../lib';
import { trackingAPI } from '../../services/tracking.api';
import { useTrackingStats } from '../../contexts/TrackingContext';

// Hook de tracking real que envía datos al backend (solo para clicks)
const useClickTracking = (componentName: string, variant?: string) => {
  const { incrementInteraction } = useTrackingStats();

  const trackClick = async (metadata?: Record<string, unknown>) => {
    try {
      // Validar datos antes de enviar
      const validVariant = variant || 'default';
      const validComponentName =
        componentName.replace(/[^a-zA-Z0-9_-]/g, '') || 'unknown';

      // Limpiar metadata para evitar campos que causen errores de validación
      const cleanMetadata = {
        ...metadata,
        // Remover campos que puedan causar problemas
        action: undefined, // No enviar action en metadata
        url: undefined, // No enviar URL en metadata
      };

      console.log('🎯 Click Tracking (enviando al backend):', {
        componentName: validComponentName,
        variant: validVariant,
        action: 'click',
        metadata: cleanMetadata,
        timestamp: new Date().toISOString(),
      });

      // Llamada real al backend
      const response = await trackingAPI.trackComponent({
        componentName: validComponentName,
        variant: validVariant,
        action: 'click',
        metadata: cleanMetadata,
      });

      if (response.success) {
        // Incrementar estadísticas locales inmediatamente
        incrementInteraction(validComponentName, 'click');
      } else {
        console.error('❌ Error enviando click tracking:', response.error);
      }
    } catch (error) {
      console.error('❌ Error en click tracking:', error);
    }
  };

  return { trackClick };
};

// Componente Button con tracking integrado
const TrackedButton: React.FC<{
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ variant = 'primary', size = 'md', children, onClick, className }) => {
  const { trackClick } = useClickTracking('Button', variant);

  const handleClick = async () => {
    await trackClick({
      variant,
      size,
      text: children?.toString(),
    });
    onClick?.();
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={className}
    >
      {children}
    </Button>
  );
};

// Componente Input con tracking solo en focus (sin tracking automático)
const TrackedInput: React.FC<{
  label: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password';
}> = ({ label, placeholder, type }) => {
  const { incrementInteraction } = useTrackingStats();

  const handleFocus = async () => {
    // Incrementar estadísticas locales inmediatamente
    incrementInteraction('Input', 'focus');

    // También enviar al backend (opcional)
    try {
      await trackingAPI.trackComponent({
        componentName: 'Input',
        variant: type === 'text' ? 'default' : type,
        action: 'focus',
        metadata: { label },
      });
    } catch (error) {
      console.error('Error enviando focus tracking:', error);
    }
  };

  return (
    <Input
      label={label}
      placeholder={placeholder}
      type={type}
      onFocus={handleFocus}
    />
  );
};

// Componente Card con tracking integrado
const TrackedCard: React.FC<{
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  title?: string;
}> = ({ variant = 'default', padding = 'md', children, title }) => {
  // Sin tracking automático - solo renderiza el Card
  const handleFocus = async () => {
    // También enviar al backend (opcional)
    try {
      await trackingAPI.trackComponent({
        componentName: 'Card',
        variant: variant,
        action: 'focus',
        metadata: { title },
      });
    } catch (error) {
      console.error('Error enviando focus tracking:', error);
    }
  };
  return (
    <Card variant={variant} padding={padding} onClick={handleFocus}>
      {children}
    </Card>
  );
};

// Componente Modal con tracking integrado
const TrackedModal: React.FC<{
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  title?: string;
}> = ({ size = 'medium', children, title }) => {
  // Sin tracking automático - solo renderiza el Modal
  const handleClick = async () => {
    // También enviar al backend (opcional)
    try {
      await trackingAPI.trackComponent({
        componentName: 'Modal',
        variant: size,
        action: 'focus',
        metadata: { title },
      });
    } catch (error) {
      console.error('Error enviando focus tracking:', error);
    }
  };
  return (
    <Button variant="primary" size="md" onClick={handleClick}>
      {children}
    </Button>
  );
};

// Componente principal de demostración
export const TrackingDemo: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [clickCount, setClickCount] = useState(0);

  return (
    <div className="space-y-6">
      <Card variant="elevated" padding="lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          🎯 Demo del Sistema de Tracking
        </h3>
        <p className="text-gray-600 mb-6">
          <strong>
            Solo se ejecuta tracking cuando haces CLICK en los botones o FOCUS
            en los inputs.
          </strong>
          <br />
          Observa los eventos en la consola del navegador.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Demostración de Botones */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">
              Botones con Tracking
            </h4>
            <div className="space-y-2 flex flex-col gap-2">
              <TrackedButton
                variant="primary"
                onClick={() => setClickCount(c => c + 1)}
              >
                Botón Primario (Clicks: {clickCount})
              </TrackedButton>
              <TrackedButton variant="secondary">
                Botón Secundario
              </TrackedButton>
              <TrackedButton variant="danger" size="sm">
                Botón Peligro
              </TrackedButton>
            </div>
          </div>

          {/* Demostración de Input */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Input con Tracking</h4>
            <TrackedInput
              label="Campo texto"
              placeholder="Escribe algo aquí..."
            />
            <TrackedInput
              label="Campo password"
              placeholder="Escribe algo aquí..."
              type="password"
            />
            <TrackedInput
              label="Campo email"
              placeholder="Escribe algo aquí..."
              type="email"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800">Card con Tracking</h4>
              <TrackedCard variant="default" padding="sm" title="Default Card">
                <p className="text-sm text-gray-600">
                  Contenido del card default
                </p>
              </TrackedCard>
              <TrackedCard
                variant="outlined"
                padding="sm"
                title="Outlined Card"
              >
                <p className="text-sm text-gray-600">
                  Contenido del card outlined
                </p>
              </TrackedCard>
              <TrackedCard
                variant="elevated"
                padding="md"
                title="Elevated Card"
              >
                <p className="text-sm text-gray-600">
                  Contenido del card con efecto elevado
                </p>
              </TrackedCard>
            </div>
          </div>
          <div>
            <div className="space-y-2 flex flex-col gap-2">
              <h4 className="font-semibold text-gray-800">
                Modal con Tracking
              </h4>
              <TrackedModal size="small" title="Default Card">
                Botón para abrir modal pequeño
              </TrackedModal>
              <TrackedModal size="medium" title="Elevated Card">
                Botón para abrir modal mediano
              </TrackedModal>
              <TrackedModal size="large" title="Elevated Card">
                Botón para abrir modal grande
              </TrackedModal>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h5 className="font-semibold text-blue-900 mb-2">
            📊 Eventos Trackeados:
          </h5>
          <p className="text-blue-800 text-sm">
            <strong>Solo se envían eventos cuando interactúas:</strong>
            <br />
            • Clicks en botones → Evento 'click'
            <br />
            • Focus en inputs → Evento 'focus'
            <br />
            Abre la consola del navegador (F12) para ver los eventos en tiempo
            real.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default TrackingDemo;
