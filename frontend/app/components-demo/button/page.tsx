'use client';

import React from 'react';
import { Button } from '../../../lib';
import { ComponentPage } from '../components/ComponentPage';
import { PropInfo } from '../components/PropsTable';
import { ProtectedRoute, ConditionalTrackingProvider } from '../../components';

// Button component examples
const ButtonExamples = () => (
  <div className="space-y-8">
    {/* Variantes */}
    <div>
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Variantes</h4>
      <div className="flex flex-wrap gap-4">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="danger">Danger</Button>
      </div>
    </div>

    {/* Tamaños */}
    <div>
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Tamaños</h4>
      <div className="flex flex-wrap items-center gap-4">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
    </div>

    {/* Estados */}
    <div>
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Estados</h4>
      <div className="flex flex-wrap gap-4">
        <Button>Normal</Button>
        <Button loading>Loading</Button>
        <Button disabled>Disabled</Button>
      </div>
    </div>

    {/* Con iconos */}
    <div>
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Con Iconos</h4>
      <div className="flex flex-wrap gap-4">
        <Button variant="primary">✓ Guardar</Button>
        <Button variant="secondary">📁 Abrir</Button>
        <Button variant="danger">🗑️ Eliminar</Button>
      </div>
    </div>
  </div>
);

// Code examples
const codeExamples = [
  {
    title: 'Uso básico',
    code: `import { Button } from '../lib';

<Button variant="primary">
  Mi Botón
</Button>`,
  },
  {
    title: 'Variantes disponibles',
    code: `<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Danger</Button>`,
  },
  {
    title: 'Tamaños',
    code: `<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`,
  },
  {
    title: 'Estados especiales',
    code: `<Button loading>Cargando...</Button>
<Button disabled>Deshabilitado</Button>`,
  },
  {
    title: 'Con manejador de eventos',
    code: `<Button 
  variant="primary" 
  onClick={() => console.log('¡Clicked!')}
>
  Click me
</Button>`,
  },
];

// Props documentation
const buttonProps: PropInfo[] = [
  {
    name: 'variant',
    type: "'primary' | 'secondary' | 'danger'",
    required: false,
    defaultValue: "'primary'",
    description: 'Estilo visual del botón',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    required: false,
    defaultValue: "'md'",
    description: 'Tamaño del botón',
  },
  {
    name: 'loading',
    type: 'boolean',
    required: false,
    defaultValue: 'false',
    description: 'Muestra un spinner de carga',
  },
  {
    name: 'disabled',
    type: 'boolean',
    required: false,
    defaultValue: 'false',
    description: 'Deshabilita el botón',
  },
  {
    name: 'onClick',
    type: '() => void',
    required: false,
    description: 'Función que se ejecuta al hacer click',
  },
  {
    name: 'className',
    type: 'string',
    required: false,
    description: 'Clases CSS adicionales',
  },
  {
    name: 'children',
    type: 'React.ReactNode',
    required: true,
    description: 'Contenido del botón',
  },
];

function ButtonPageContent() {
  return (
    <ComponentPage
      title="Button"
      description="Componente de botón versátil con múltiples variantes, tamaños y estados. Ideal para acciones primarias, secundarias y navegación."
      examples={<ButtonExamples />}
      codeExamples={codeExamples}
      props={buttonProps}
    />
  );
}

export default function ButtonPage() {
  return (
    <ProtectedRoute>
      <ConditionalTrackingProvider>
        <ButtonPageContent />
      </ConditionalTrackingProvider>
    </ProtectedRoute>
  );
}
