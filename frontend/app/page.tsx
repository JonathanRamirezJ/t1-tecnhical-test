'use client';

import { useState, useCallback } from 'react';
import { Button, Input, Modal, Card } from '../lib';
import { PhoneIcon } from '@heroicons/react/20/solid';
import { CalendarIcon } from '@heroicons/react/20/solid';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sizeModal, setSizeModal] = useState<'small' | 'medium' | 'large'>('small');

  const handleSubmit = async () => {
    setIsLoading(true);
    // Simular carga
    setTimeout(() => {
      setIsLoading(false);
      alert('Formulario enviado!');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Librería de Componentes
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Una colección completa de componentes, construida con Tailwind CSS y Next.js con soporte para TypeScript.
          </p>
        </div>

        {/* Componentes Demo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

          {/* Button Examples */}
          <Card header="Button Component" padding="lg">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-2">Variantes</h4>
                <div className="flex flex-wrap gap-2">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="danger">Danger</Button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-2">Estados</h4>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="primary"
                    size="md"
                  >
                    default
                  </Button>
                  <Button
                    variant="primary"
                    loading={isLoading}
                    size="md"
                    onClick={() => setIsLoading(!isLoading)}
                  >
                    Loading
                  </Button>
                  <Button variant="secondary" disabled>
                    Disabled
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-2">Iconos</h4>
                <div className="flex flex-wrap gap-2 items-center">
                  <Button variant="primary" size="md" icon={<PhoneIcon className="w-5 h-5" />} iconPosition="left">
                    Phone icon left
                  </Button>
                  <Button variant="primary" size="md" icon={<CalendarIcon className="w-5 h-5" />} iconPosition="right">
                    Calendar icon right
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-2">Tamaños</h4>
                <div className="flex flex-wrap gap-2 items-center">
                  <Button variant="primary" size="sm">Small</Button>
                  <Button variant="primary" size="md">Medium</Button>
                  <Button variant="primary" size="lg">Large</Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Input Examples */}
          <Card header="Input Component" padding="lg">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-700 mb-2">
                Tipos de inputs
              </h4>
              <Input
                id="demo-text"
                type="text"
                label="Input text"
                placeholder="Texto"
                helperText="Ingresa tu texto"
              />

              <Input
                id="demo-email"
                type="email"
                label="Input email"
                placeholder="usuario@ejemplo.com"
                helperText="Ingresa tu correo electrónico"
              />

              <Input
                id="demo-password"
                type="password"
                label="Input password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={password.length > 0 && password.length < 8 ? 'Mínimo 8 caracteres' : ''}
                success={password.length >= 8 ? 'Contraseña válida' : ''}
              />

              <h4 className="text-sm font-bold text-gray-700 mb-2">
                Estados de validación inputs
              </h4>

              <Input
                id="demo-password-default"
                type="text"
                label="Default"
                placeholder=""
              />

              <Input
                id="demo-password-error"
                type="text"
                label="Error"
                placeholder=""
                error="Error message"
                helperText="Error message"
              />

              <Input
                id="demo-password-success"
                type="text"
                label="Success"
                placeholder=""
                success="Success message"
                helperText="Success message"
              />

              <h4 className="text-sm font-bold text-gray-700 mb-2">
                Estados del input
              </h4>

              <Input
                id="demo-disabled"
                type="text"
                label="Disabled"
                placeholder="Disabled"
                disabled
                value="Disabled"
              />
            </div>
          </Card>

          {/* Modal Example */}
          <Card header="Modal Component" padding="lg">
            <div className="space-y-4">
              <p className="text-gray-600">
                Los modales son útiles para confirmaciones, formularios y mostrar información adicional.
              </p>

              <div className="flex gap-2">
                <Button
                  variant="primary"
                  onClick={() => {
                    setSizeModal('small');
                    setIsModalOpen(true);
                  }}
                >
                  Abrir Modal - Small
                </Button>

                <Button
                  variant="primary"
                  onClick={() => {
                    setSizeModal('medium');
                    setIsModalOpen(true);
                  }}
                >
                  Abrir Modal - Medium
                </Button>

                <Button
                  variant="primary"
                  onClick={() => {
                    setSizeModal('large');
                    setIsModalOpen(true);
                  }}
                >
                  Abrir Modal - Large
                </Button>
              </div>
            </div>
          </Card>

          {/* Card Examples */}
          <Card header="Card Component" padding="lg">
            <div className="space-y-4">
              <p className="text-gray-600">
                Las tarjetas pueden tener diferentes variantes y ser interactivas.
              </p>

              <h4 className="text-sm font-bold text-gray-700 mb-2">
                Variantes
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                <h4 className="text-sm font-bold text-gray-700 mb-2">
                  Estilo Outlined
                </h4>
                <Card
                  variant="outlined"
                  padding="sm"
                  hoverable
                  header="Card outlined - Header Section"
                >
                  <p className="text-sm text-gray-600">Card outlined - Content Section</p>
                </Card>

                <h4 className="text-sm font-bold text-gray-700 mb-2">
                  Estilo Elevated
                </h4>
                <Card
                  variant="elevated"
                  padding="sm"
                  hoverable
                  header="Card elevated - Header Section"
                >
                  <p className="text-sm text-gray-700">Card elevated - Content Section</p>
                </Card>

                <h4 className="text-sm font-bold text-gray-700 mb-2">
                  Estilo Default
                </h4>
                <Card
                  variant="default"
                  padding="sm"
                  hoverable
                  header="Card con footer - Header Section"
                  footer={
                    <Button variant="primary" size="sm" onClick={() => alert('Click en el botón del footer')}>
                      Acción - Footer Section
                    </Button>
                  }
                >
                  <p className="text-sm text-gray-700">Card con footer - Content Section</p>
                </Card>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                <h4 className="text-sm font-bold text-gray-700 mb-2">
                  Variantes con imagenes
                </h4>
                <Card
                  variant="default"
                  padding="sm"
                  hoverable
                >
                  <img src="https://picsum.photos/id/237/600/400" alt="image" />
                </Card>
              </div>
            </div>
          </Card>
        </div>

        {/* Form Example */}
        <Card
          header="Ejemplo de Formulario Completo"
          padding="lg"
          className="max-w-2xl mx-auto"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="text"
                label="Nombre"
                placeholder="Tu nombre"
                required
              />
              <Input
                type="text"
                label="Apellido"
                placeholder="Tu apellido"
                required
              />
            </div>

            <Input
              type="email"
              label="Correo electrónico"
              placeholder="usuario@ejemplo.com"
              required
              helperText="Usaremos este email para contactarte"
            />

            <Input
              type="password"
              label="Contraseña"
              placeholder="••••••••"
              required
              helperText="Mínimo 8 caracteres"
            />

            <div className="flex justify-end gap-3">
              <Button variant="secondary">
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                loading={isLoading}
              >
                {isLoading ? 'Enviando...' : 'Enviar'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          size={sizeModal}
          header="Ejemplo de Modal"
          footer={
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setIsModalOpen(false);
                  alert('Acción confirmada!');
                }}
              >
                Confirmar
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Este es un ejemplo de modal con header, body y footer configurables.
            </p>
            <p className="text-gray-600">
              Puedes cerrarlo haciendo clic en el botón X, presionando Escape,
              o haciendo clic fuera del modal.
            </p>
            <div className="bg-blue-50 p-4 rounded-md">
              <p className="text-blue-800 text-sm">
                💡 <strong>Tip:</strong> Los modales previenen el scroll del body
                y manejan el foco automáticamente para mejorar la accesibilidad.
              </p>
            </div>
          </div>
        </Modal>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600">
            Jonathan Ramirez - Senior Software Engineer
          </p>
        </div>
      </div>
    </div>
  );
}
