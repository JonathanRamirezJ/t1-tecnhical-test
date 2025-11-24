import { useState } from 'react';
import { Button, Card, Modal } from '../../../lib';

export const ModalDemo = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [sizeModal, setSizeModal] = useState<'small' | 'medium' | 'large'>(
    'small'
  );

  return (
    <>
      <Card header="Modal Component" padding="lg">
        <div className="space-y-4">
          <p className="text-gray-600">
            Los modales son útiles para confirmaciones, formularios y mostrar
            información adicional.
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
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size={sizeModal}
        header="Ejemplo de Modal"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
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
            Puedes cerrarlo haciendo clic en el botón X, presionando Escape, o
            haciendo clic fuera del modal.
          </p>
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-blue-800 text-sm">
              💡 <strong>Tip:</strong> Los modales previenen el scroll del body
              y manejan el foco automáticamente para mejorar la accesibilidad.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};
