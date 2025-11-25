'use client';

import React, { useState } from 'react';
import { Input } from '../../../lib';
import { ComponentPage } from '../components/ComponentPage';
import { PropInfo } from '../components/PropsTable';
import { ProtectedRoute, ConditionalTrackingProvider } from '../../components';

// Input component examples
const InputExamples = () => {
  const [values, setValues] = useState({
    basic: '',
    email: '',
    password: '',
    error: '',
    success: 'usuario@ejemplo.com',
    disabled: 'Campo deshabilitado',
  });

  const handleChange =
    (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues(prev => ({ ...prev, [name]: e.target.value }));
    };

  return (
    <div className="space-y-8">
      {/* Tipos básicos */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Tipos Básicos
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Texto básico"
            placeholder="Escribe algo..."
            value={values.basic}
            onChange={handleChange('basic')}
          />
          <Input
            label="Email"
            type="email"
            placeholder="tu@email.com"
            value={values.email}
            onChange={handleChange('email')}
          />
          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={values.password}
            onChange={handleChange('password')}
          />
          <Input
            label="Campo requerido"
            placeholder="Campo obligatorio"
            required
          />
        </div>
      </div>

      {/* Estados */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Estados</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Con error"
            placeholder="Campo con error"
            value={values.error}
            onChange={handleChange('error')}
            error="Este campo tiene un error"
          />
          <Input
            label="Exitoso"
            placeholder="Campo válido"
            value={values.success}
            onChange={handleChange('success')}
            success="Campo válido"
          />
          <Input label="Deshabilitado" value={values.disabled} disabled />
          <Input
            label="Con texto de ayuda"
            placeholder="Campo con ayuda"
            helperText="Este es un texto de ayuda para el usuario"
          />
        </div>
      </div>

      {/* Tamaños */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Tamaños</h4>
        <div className="space-y-4">
          <Input label="Pequeño" size="sm" placeholder="Input pequeño" />
          <Input
            label="Mediano (por defecto)"
            size="md"
            placeholder="Input mediano"
          />
          <Input label="Grande" size="lg" placeholder="Input grande" />
        </div>
      </div>

      {/* Variantes */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Variantes</h4>
        <div className="space-y-4">
          <Input
            label="Por defecto"
            variant="default"
            placeholder="Variante por defecto"
          />
          <Input
            label="Error"
            variant="error"
            placeholder="Variante de error"
          />
          <Input
            label="Éxito"
            variant="success"
            placeholder="Variante de éxito"
          />
        </div>
      </div>
    </div>
  );
};

// Code examples
const codeExamples = [
  {
    title: 'Uso básico',
    code: `import { Input } from '../lib';

<Input
  label="Nombre"
  placeholder="Tu nombre"
  value={value}
  onChange={handleChange}
/>`,
  },
  {
    title: 'Tipos de input',
    code: `<Input type="text" label="Texto" />
<Input type="email" label="Email" />
<Input type="password" label="Contraseña" />
<Input type="number" label="Número" />`,
  },
  {
    title: 'Estados de validación',
    code: `<Input
  label="Con error"
  error="Este campo es requerido"
  value={value}
  onChange={handleChange}
/>

<Input
  label="Exitoso"
  success="Campo válido"
  value={value}
  onChange={handleChange}
/>`,
  },
  {
    title: 'Campo deshabilitado',
    code: `<Input
  label="Campo deshabilitado"
  value="No editable"
  disabled
/>`,
  },
  {
    title: 'Con texto de ayuda',
    code: `<Input
  label="Contraseña"
  type="password"
  helperText="Mínimo 8 caracteres"
  value={password}
  onChange={handlePasswordChange}
/>`,
  },
];

// Props documentation
const inputProps: PropInfo[] = [
  {
    name: 'label',
    type: 'string',
    required: false,
    description: 'Etiqueta del campo',
  },
  {
    name: 'type',
    type: "'text' | 'email' | 'password' | 'number' | etc.",
    required: false,
    defaultValue: "'text'",
    description: 'Tipo de input HTML',
  },
  {
    name: 'placeholder',
    type: 'string',
    required: false,
    description: 'Texto de placeholder',
  },
  {
    name: 'value',
    type: 'string',
    required: false,
    description: 'Valor del input',
  },
  {
    name: 'onChange',
    type: '(e: ChangeEvent<HTMLInputElement>) => void',
    required: false,
    description: 'Función que se ejecuta al cambiar el valor',
  },
  {
    name: 'error',
    type: 'string',
    required: false,
    description: 'Mensaje de error a mostrar',
  },
  {
    name: 'success',
    type: 'string',
    required: false,
    description: 'Mensaje de éxito a mostrar',
  },
  {
    name: 'helperText',
    type: 'string',
    required: false,
    description: 'Texto de ayuda',
  },
  {
    name: 'disabled',
    type: 'boolean',
    required: false,
    defaultValue: 'false',
    description: 'Deshabilita el input',
  },
  {
    name: 'required',
    type: 'boolean',
    required: false,
    defaultValue: 'false',
    description: 'Marca el campo como requerido',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    required: false,
    defaultValue: "'md'",
    description: 'Tamaño del input',
  },
  {
    name: 'variant',
    type: "'default' | 'error' | 'success'",
    required: false,
    defaultValue: "'default'",
    description: 'Variante visual del input',
  },
];

function InputPageContent() {
  return (
    <ComponentPage
      title="Input"
      description="Componente de campo de entrada versátil con soporte para validación, diferentes tipos, estados y estilos. Incluye manejo automático de contraseñas y feedback visual."
      examples={<InputExamples />}
      codeExamples={codeExamples}
      props={inputProps}
    />
  );
}

export default function InputPage() {
  return (
    <ProtectedRoute>
      <ConditionalTrackingProvider>
        <InputPageContent />
      </ConditionalTrackingProvider>
    </ProtectedRoute>
  );
}
