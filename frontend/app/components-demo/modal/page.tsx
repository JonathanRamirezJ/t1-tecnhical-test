'use client';

import React, { useState } from 'react';
import { Modal, Button } from '../../../lib';
import { ComponentPage } from '../components/ComponentPage';
import { PropInfo } from '../components/PropsTable';
import ProtectedRoute from '../../components/ProtectedRoute';

// Modal component examples
const ModalExamples = () => {
  const [modals, setModals] = useState({
    basic: false,
    withActions: false,
    large: false,
    small: false,
  });

  const openModal = (type: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [type]: true }));
  };

  const closeModal = (type: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [type]: false }));
  };

  return (
    <div className="space-y-8">
      {/* Modales básicos */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Ejemplos Básicos
        </h4>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" onClick={() => openModal('basic')}>
            Modal Básico
          </Button>
          <Button variant="secondary" onClick={() => openModal('withActions')}>
            Con Acciones
          </Button>
          <Button variant="secondary" onClick={() => openModal('large')}>
            Modal Grande
          </Button>
          <Button variant="secondary" onClick={() => openModal('small')}>
            Modal Pequeño
          </Button>
        </div>
      </div>

      {/* Modal básico */}
      <Modal
        isOpen={modals.basic}
        onClose={() => closeModal('basic')}
        header={<h3 className="text-lg font-semibold">Modal Básico</h3>}
      >
        <p className="text-gray-600">
          Este es un modal básico con título y contenido simple. Puedes cerrarlo
          haciendo click en la X o presionando Escape.
        </p>
      </Modal>

      {/* Modal con acciones */}
      <Modal
        isOpen={modals.withActions}
        onClose={() => closeModal('withActions')}
        header={<h3 className="text-lg font-semibold">Confirmar Acción</h3>}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            ¿Estás seguro de que quieres realizar esta acción? Esta operación no
            se puede deshacer.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => closeModal('withActions')}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                alert('Acción confirmada');
                closeModal('withActions');
              }}
            >
              Confirmar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal grande */}
      <Modal
        isOpen={modals.large}
        onClose={() => closeModal('large')}
        header={<h3 className="text-lg font-semibold">Modal Grande</h3>}
        size="large"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Este es un modal más grande que puede contener más contenido.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-semibold mb-2">Información Adicional</h5>
            <p className="text-sm text-gray-600">
              Los modales grandes son útiles para formularios complejos, tablas
              de datos o contenido que requiere más espacio visual.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded">
              <h6 className="font-medium text-blue-900">Característica 1</h6>
              <p className="text-sm text-blue-700">
                Descripción de la característica
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <h6 className="font-medium text-green-900">Característica 2</h6>
              <p className="text-sm text-green-700">
                Descripción de la característica
              </p>
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal pequeño */}
      <Modal
        isOpen={modals.small}
        onClose={() => closeModal('small')}
        header={<h3 className="text-lg font-semibold">Confirmación</h3>}
        size="small"
      >
        <div className="text-center space-y-4">
          <div className="text-4xl">⚠️</div>
          <p className="text-gray-600">¿Eliminar este elemento?</p>
          <div className="flex justify-center space-x-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => closeModal('small')}
            >
              No
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                alert('Elemento eliminado');
                closeModal('small');
              }}
            >
              Sí, eliminar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Información sobre uso */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h5 className="font-semibold text-blue-900 mb-2">💡 Consejos de Uso</h5>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>
            • Usa modales para acciones importantes que requieren confirmación
          </li>
          <li>• Mantén el contenido conciso y enfocado</li>
          <li>• Siempre proporciona una forma clara de cerrar el modal</li>
          <li>• Considera el tamaño apropiado según el contenido</li>
        </ul>
      </div>
    </div>
  );
};

// Code examples
const codeExamples = [
  {
    title: 'Uso básico',
    code: `import { Modal, Button } from '../lib';

const [isOpen, setIsOpen] = useState(false);

<Button onClick={() => setIsOpen(true)}>
  Abrir Modal
</Button>

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  header={<h3>Mi Modal</h3>}
>
  <p>Contenido del modal</p>
</Modal>`,
  },
  {
    title: 'Modal con acciones',
    code: `<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  header={<h3>Confirmar Acción</h3>}
>
  <div className="space-y-4">
    <p>¿Estás seguro?</p>
    <div className="flex justify-end space-x-3">
      <Button variant="secondary" onClick={() => setIsOpen(false)}>
        Cancelar
      </Button>
      <Button variant="danger" onClick={handleConfirm}>
        Confirmar
      </Button>
    </div>
  </div>
</Modal>`,
  },
  {
    title: 'Diferentes tamaños',
    code: `<Modal size="small" header={<h3>Pequeño</h3>}>...</Modal>
<Modal size="medium" header={<h3>Mediano</h3>}>...</Modal>
<Modal size="large" header={<h3>Grande</h3>}>...</Modal>`,
  },
];

// Props documentation
const modalProps: PropInfo[] = [
  {
    name: 'isOpen',
    type: 'boolean',
    required: true,
    description: 'Controla si el modal está visible',
  },
  {
    name: 'onClose',
    type: '() => void',
    required: true,
    description: 'Función que se ejecuta al cerrar el modal',
  },
  {
    name: 'header',
    type: 'React.ReactNode',
    required: false,
    description: 'Contenido del header del modal',
  },
  {
    name: 'footer',
    type: 'React.ReactNode',
    required: false,
    description: 'Contenido del footer del modal',
  },
  {
    name: 'size',
    type: "'small' | 'medium' | 'large'",
    required: false,
    defaultValue: "'medium'",
    description: 'Tamaño del modal',
  },
  {
    name: 'closeOnOverlayClick',
    type: 'boolean',
    required: false,
    defaultValue: 'true',
    description: 'Permite cerrar el modal haciendo click en el overlay',
  },
  {
    name: 'closeOnEscape',
    type: 'boolean',
    required: false,
    defaultValue: 'true',
    description: 'Permite cerrar el modal presionando Escape',
  },
  {
    name: 'showCloseButton',
    type: 'boolean',
    required: false,
    defaultValue: 'true',
    description: 'Muestra el botón de cerrar (X)',
  },
  {
    name: 'children',
    type: 'React.ReactNode',
    required: true,
    description: 'Contenido del modal',
  },
  {
    name: 'className',
    type: 'string',
    required: false,
    description: 'Clases CSS adicionales',
  },
];

function ModalPageContent() {
  return (
    <ComponentPage
      title="Modal"
      description="Componente de ventana modal para mostrar contenido superpuesto. Ideal para confirmaciones, formularios, alertas y cualquier contenido que requiera atención inmediata del usuario."
      examples={<ModalExamples />}
      codeExamples={codeExamples}
      props={modalProps}
    />
  );
}

export default function ModalPage() {
  return (
    <ProtectedRoute>
      <ModalPageContent />
    </ProtectedRoute>
  );
}
