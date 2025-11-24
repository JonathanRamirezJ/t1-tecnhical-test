import React, { useEffect } from 'react';
import { ModalProps } from './Modal.types';

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  size = 'medium',
  header,
  footer,
  children,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = '',
}) => {
  // Manejar tecla Escape
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeStyles = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-4xl',
  };

  const overlayStyles = `
    fixed inset-0 z-50 flex items-center justify-center
    backdrop-blur-sm
    transition-opacity duration-300 ease-out
    p-4
  `;

  const modalStyles = `
    relative bg-white rounded-lg shadow-xl
    max-h-[90vh] overflow-hidden
    transform transition-all duration-300 ease-out
    ${sizeStyles[size]}
    ${className}
  `;

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  const CloseButton = () => (
    <button
      onClick={onClose}
      className="
        absolute top-4 right-4 z-10
        p-1 rounded-md text-gray-400 hover:text-gray-600
        hover:bg-gray-100 transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
      "
      aria-label="Cerrar modal"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );

  return (
    <div
      className={overlayStyles}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={header ? 'modal-header' : undefined}
    >
      <div className={modalStyles}>
        {showCloseButton && <CloseButton />}
        
        {header && (
          <div
            id="modal-header"
            className="
              px-6 py-4 border-b border-gray-200
              bg-gray-50 rounded-t-lg
            "
          >
            {typeof header === 'string' ? (
              <h2 className="text-lg font-semibold text-gray-900">
                {header}
              </h2>
            ) : (
              header
            )}
          </div>
        )}

        <div className="
          px-6 py-4 overflow-y-auto
          max-h-[calc(90vh-8rem)]
        ">
          {children}
        </div>

        {footer && (
          <div className="
            px-6 py-4 border-t border-gray-200
            bg-gray-50 rounded-b-lg
            flex justify-end gap-3
          ">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
