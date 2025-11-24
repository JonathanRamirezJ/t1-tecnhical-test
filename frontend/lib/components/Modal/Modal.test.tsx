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

  // Test 1: Basic render
  it('renders correctly when open', () => {
    render(<Modal {...defaultProps} />);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  // Test 2: Does not render when closed 
  it('does not render when closed', () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  // Test 3: Modal sizes
  it('renders different sizes correctly', () => {
    const { rerender } = render(<Modal {...defaultProps} size="small" />);
    expect(screen.getByRole('dialog').firstChild).toHaveClass('max-w-md');

    rerender(<Modal {...defaultProps} size="medium" />);
    expect(screen.getByRole('dialog').firstChild).toHaveClass('max-w-lg');

    rerender(<Modal {...defaultProps} size="large" />);
    expect(screen.getByRole('dialog').firstChild).toHaveClass('max-w-4xl');
  });

  // Test 4: Modal header
  it('renders header correctly', () => {
    render(<Modal {...defaultProps} header="Test Header" />);
    
    expect(screen.getByText('Test Header')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-labelledby', 'modal-header');
  });

  // Test 5: Custom header (React node)
  it('renders custom header correctly', () => {
    const customHeader = <div data-testid="custom-header">Custom Header</div>;
    render(<Modal {...defaultProps} header={customHeader} />);
    
    expect(screen.getByTestId('custom-header')).toBeInTheDocument();
  });

  // Test 6: Modal footer
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

  // Test 7: Close button
  it('renders close button by default', () => {
    render(<Modal {...defaultProps} />);
    
    const closeButton = screen.getByLabelText('Cerrar modal');
    expect(closeButton).toBeInTheDocument();
  });

  // Test 8: Hide close button when showCloseButton is false
  it('hides close button when showCloseButton is false', () => {
    render(<Modal {...defaultProps} showCloseButton={false} />);
    
    expect(screen.queryByLabelText('Cerrar modal')).not.toBeInTheDocument();
  });

  // Test 9: Click on close button
  it('calls onClose when close button is clicked', async () => {
    const onClose = jest.fn();
    const user = userEvent.setup();
    
    render(<Modal {...defaultProps} onClose={onClose} />);
    
    const closeButton = screen.getByLabelText('Cerrar modal');
    await user.click(closeButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // Test 10: Click on overlay
  it('calls onClose when overlay is clicked', async () => {
    const onClose = jest.fn();
    const user = userEvent.setup();
    
    render(<Modal {...defaultProps} onClose={onClose} />);
    
    const overlay = screen.getByRole('dialog');
    await user.click(overlay);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // Test 11: No close when overlay is clicked and closeOnOverlayClick is false
  it('does not close when overlay is clicked and closeOnOverlayClick is false', async () => {
    const onClose = jest.fn();
    const user = userEvent.setup();
    
    render(<Modal {...defaultProps} onClose={onClose} closeOnOverlayClick={false} />);
    
    const overlay = screen.getByRole('dialog');
    await user.click(overlay);
    
    expect(onClose).not.toHaveBeenCalled();
  });

  // Test 12: No close when modal content is clicked
  it('does not close when modal content is clicked', async () => {
    const onClose = jest.fn();
    const user = userEvent.setup();
    
    render(<Modal {...defaultProps} onClose={onClose} />);
    
    const content = screen.getByText('Modal content');
    await user.click(content);
    
    expect(onClose).not.toHaveBeenCalled();
  });

  // Test 13: Escape key
  it('calls onClose when Escape key is pressed', () => {
    const onClose = jest.fn();
    
    render(<Modal {...defaultProps} onClose={onClose} />);
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // Test 14: No close when Escape is pressed and closeOnEscape is false
  it('does not close when Escape is pressed and closeOnEscape is false', () => {
    const onClose = jest.fn();
    
    render(<Modal {...defaultProps} onClose={onClose} closeOnEscape={false} />);
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(onClose).not.toHaveBeenCalled();
  });

  // Test 15: Other keys do not close the modal
  it('does not close when other keys are pressed', () => {
    const onClose = jest.fn();
    
    render(<Modal {...defaultProps} onClose={onClose} />);
    
    fireEvent.keyDown(document, { key: 'Enter' });
    fireEvent.keyDown(document, { key: 'Space' });
    
    expect(onClose).not.toHaveBeenCalled();
  });

  // Test 16: Prevent body scroll when open
  it('prevents body scroll when open', () => {
    const originalOverflow = document.body.style.overflow;
    
    const { unmount } = render(<Modal {...defaultProps} />);
    
    expect(document.body.style.overflow).toBe('hidden');
    
    unmount();
    
    expect(document.body.style.overflow).toBe('unset');
    
    // Restore the original value
    document.body.style.overflow = originalOverflow;
  });

  // Test 17: Custom CSS classes
  it('applies custom className correctly', () => {
    render(<Modal {...defaultProps} className="custom-modal-class" />);
    
    const modalContent = screen.getByRole('dialog').firstChild;
    expect(modalContent).toHaveClass('custom-modal-class');
  });

  // Test 18: Accessibility attributes
  it('has correct accessibility attributes', () => {
    render(<Modal {...defaultProps} header="Test Modal" />);
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-header');
  });

  // Test 19: No aria-labelledby when no header is provided
  it('does not have aria-labelledby when no header is provided', () => {
    render(<Modal {...defaultProps} />);
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).not.toHaveAttribute('aria-labelledby');
  });

  // Test 20: Cleanup event listeners
  it('cleans up event listeners when unmounted', () => {
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
    
    const { unmount } = render(<Modal {...defaultProps} />);
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    
    removeEventListenerSpy.mockRestore();
  });
});
