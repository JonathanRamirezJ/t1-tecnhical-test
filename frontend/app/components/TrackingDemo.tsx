'use client';

import React, { useState } from 'react';
import { Card, Button, Input } from '../../lib';
import { trackingAPI } from '../services/tracking.api';

// Hook de tracking real que envía datos al backend (solo para clicks)
const useClickTracking = (componentName: string, variant?: string) => {
  const trackClick = async (metadata?: any) => {
    try {
      // Validar datos antes de enviar
      const validVariant = variant || 'default';
      const validComponentName = componentName.replace(/[^a-zA-Z0-9_-]/g, '');

      console.log('🎯 Click Tracking (enviando al backend):', {
        componentName: validComponentName,
        variant: validVariant,
        action: 'click',
        metadata,
        timestamp: new Date().toISOString(),
      });

      // Llamada real al backend
      const response = await trackingAPI.trackComponent({
        componentName: validComponentName,
        variant: validVariant,
        action: 'click',
        metadata,
      });

      if (response.success) {
        console.log('✅ Click tracking enviado exitosamente:', response.data);
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
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, placeholder, value, onChange }) => {
  const { trackClick } = useClickTracking('Input', 'default');

  const handleFocus = async () => {
    await trackClick({
      label,
      action: 'focus',
      valueLength: value.length,
    });
  };

  return (
    <Input
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onFocus={handleFocus}
    />
  );
};

// Componente Card sin tracking automático (solo visual)
const TrackedCard: React.FC<{
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  title?: string;
}> = ({ variant = 'default', padding = 'md', children, title }) => {
  // Sin tracking automático - solo renderiza el Card
  return (
    <Card variant={variant} padding={padding}>
      {children}
    </Card>
  );
};

// Componente principal de demostración
export const TrackingDemo: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [clickCount, setClickCount] = useState(0);

  return (
    <div className="space-y-6">
      <TrackedCard variant="elevated" padding="lg" title="Tracking Demo">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          🎯 Demo del Sistema de Tracking
        </h3>
        <p className="text-gray-600 mb-6">
          <strong>
            Solo se ejecuta tracking cuando haces CLICK en los botones o FOCUS
            en los inputs.
          </strong>
          <br />
          No hay tracking automático al cargar la página. Observa los eventos en
          la consola del navegador.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Demostración de Botones */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">
              Botones con Tracking
            </h4>
            <div className="space-y-2">
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
              label="Campo de prueba"
              placeholder="Escribe algo aquí..."
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
            />
            <p className="text-sm text-gray-500">
              Caracteres: {inputValue.length}
            </p>
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
      </TrackedCard>

      {/* Showcase de variantes */}
      <TrackedCard variant="outlined" padding="lg" title="Component Showcase">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          🎨 Showcase de Componentes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Variantes de Button */}
          <div>
            <h4 className="font-medium text-gray-800 mb-3">Button Variants</h4>
            <div className="space-y-2">
              <TrackedButton variant="primary" size="sm">
                Primary SM
              </TrackedButton>
              <TrackedButton variant="secondary" size="md">
                Secondary MD
              </TrackedButton>
              <TrackedButton variant="danger" size="lg">
                Danger LG
              </TrackedButton>
            </div>
          </div>

          {/* Variantes de Card */}
          <div>
            <h4 className="font-medium text-gray-800 mb-3">Card Variants</h4>
            <div className="space-y-2">
              <TrackedCard variant="default" padding="sm" title="Default Card">
                <p className="text-sm">Default card content</p>
              </TrackedCard>
              <TrackedCard
                variant="elevated"
                padding="md"
                title="Elevated Card"
              >
                <p className="text-sm">Elevated card content</p>
              </TrackedCard>
            </div>
          </div>

          {/* Estadísticas en vivo */}
          <div>
            <h4 className="font-medium text-gray-800 mb-3">Live Stats</h4>
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Button clicks:</span>
                  <span className="font-semibold">{clickCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Input chars:</span>
                  <span className="font-semibold">{inputValue.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cards viewed:</span>
                  <span className="font-semibold">3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TrackedCard>
    </div>
  );
};

export default TrackingDemo;
