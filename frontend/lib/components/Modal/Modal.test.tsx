import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from './Modal';

describe('Modal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    children: <div>Modal content</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Renderizado básico
  it('renders correctly when open', () => {
    render(<Modal {...defaultProps} />);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  // Test 2: No renderiza cuando está cerrado
  it('does not render when closed', () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  // Test 3: Tamaños del modal
  it('renders different sizes correctly', () => {
    const { rerender } = render(<Modal {...defaultProps} size="small" />);
    expect(screen.getByRole('dialog').firstChild).toHaveClass('max-w-md');

    rerender(<Modal {...defaultProps} size="medium" />);
    expect(screen.getByRole('dialog').firstChild).toHaveClass('max-w-lg');

    rerender(<Modal {...defaultProps} size="large" />);
    expect(screen.getByRole('dialog').firstChild).toHaveClass('max-w-4xl');
  });

  // Test 4: Header del modal
  it('renders header correctly', () => {
    render(<Modal {...defaultProps} header="Test Header" />);
    
    expect(screen.getByText('Test Header')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-labelledby', 'modal-header');
  });

  // Test 5: Header personalizado (React node)
  it('renders custom header correctly', () => {
    const customHeader = <div data-testid="custom-header">Custom Header</div>;
    render(<Modal {...defaultProps} header={customHeader} />);
    
    expect(screen.getByTestId('custom-header')).toBeInTheDocument();
  });

  // Test 6: Footer del modal
  it('renders footer correctly', () => {
    const footer = (
      <div>
        <button>Cancel</button>
        <button>Save</button>
      </div>
    );
    
    render(<Modal {...defaultProps} footer={footer} />);
    
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  // Test 7: Botón de cerrar
  it('renders close button by default', () => {
    render(<Modal {...defaultProps} />);
    
    const closeButton = screen.getByLabelText('Cerrar modal');
    expect(closeButton).toBeInTheDocument();
  });

  // Test 8: Ocultar botón de cerrar
  it('hides close button when showCloseButton is false', () => {
    render(<Modal {...defaultProps} showCloseButton={false} />);
    
    expect(screen.queryByLabelText('Cerrar modal')).not.toBeInTheDocument();
  });

  // Test 9: Click en botón de cerrar
  it('calls onClose when close button is clicked', async () => {
    const onClose = jest.fn();
    const user = userEvent.setup();
    
    render(<Modal {...defaultProps} onClose={onClose} />);
    
    const closeButton = screen.getByLabelText('Cerrar modal');
    await user.click(closeButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // Test 10: Click en overlay
  it('calls onClose when overlay is clicked', async () => {
    const onClose = jest.fn();
    const user = userEvent.setup();
    
    render(<Modal {...defaultProps} onClose={onClose} />);
    
    const overlay = screen.getByRole('dialog');
    await user.click(overlay);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // Test 11: No cerrar en click de overlay cuando está deshabilitado
  it('does not close when overlay is clicked and closeOnOverlayClick is false', async () => {
    const onClose = jest.fn();
    const user = userEvent.setup();
    
    render(<Modal {...defaultProps} onClose={onClose} closeOnOverlayClick={false} />);
    
    const overlay = screen.getByRole('dialog');
    await user.click(overlay);
    
    expect(onClose).not.toHaveBeenCalled();
  });

  // Test 12: No cerrar en click del contenido del modal
  it('does not close when modal content is clicked', async () => {
    const onClose = jest.fn();
    const user = userEvent.setup();
    
    render(<Modal {...defaultProps} onClose={onClose} />);
    
    const content = screen.getByText('Modal content');
    await user.click(content);
    
    expect(onClose).not.toHaveBeenCalled();
  });

  // Test 13: Tecla Escape
  it('calls onClose when Escape key is pressed', () => {
    const onClose = jest.fn();
    
    render(<Modal {...defaultProps} onClose={onClose} />);
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // Test 14: No cerrar con Escape cuando está deshabilitado
  it('does not close when Escape is pressed and closeOnEscape is false', () => {
    const onClose = jest.fn();
    
    render(<Modal {...defaultProps} onClose={onClose} closeOnEscape={false} />);
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(onClose).not.toHaveBeenCalled();
  });

  // Test 15: Otras teclas no cierran el modal
  it('does not close when other keys are pressed', () => {
    const onClose = jest.fn();
    
    render(<Modal {...defaultProps} onClose={onClose} />);
    
    fireEvent.keyDown(document, { key: 'Enter' });
    fireEvent.keyDown(document, { key: 'Space' });
    
    expect(onClose).not.toHaveBeenCalled();
  });

  // Test 16: Prevención de scroll del body
  it('prevents body scroll when open', () => {
    const originalOverflow = document.body.style.overflow;
    
    const { unmount } = render(<Modal {...defaultProps} />);
    
    expect(document.body.style.overflow).toBe('hidden');
    
    unmount();
    
    expect(document.body.style.overflow).toBe('unset');
    
    // Restaurar el valor original
    document.body.style.overflow = originalOverflow;
  });

  // Test 17: Clases CSS personalizadas
  it('applies custom className correctly', () => {
    render(<Modal {...defaultProps} className="custom-modal-class" />);
    
    const modalContent = screen.getByRole('dialog').firstChild;
    expect(modalContent).toHaveClass('custom-modal-class');
  });

  // Test 18: Atributos de accesibilidad
  it('has correct accessibility attributes', () => {
    render(<Modal {...defaultProps} header="Test Modal" />);
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-header');
  });

  // Test 19: Sin aria-labelledby cuando no hay header
  it('does not have aria-labelledby when no header is provided', () => {
    render(<Modal {...defaultProps} />);
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).not.toHaveAttribute('aria-labelledby');
  });

  // Test 20: Limpieza de event listeners
  it('cleans up event listeners when unmounted', () => {
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
    
    const { unmount } = render(<Modal {...defaultProps} />);
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    
    removeEventListenerSpy.mockRestore();
  });
});
