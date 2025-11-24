/*
 * Modal component props
 * @param isOpen - Modal isOpen state
 * @param onClose - Modal onClose function
 * @param size - Modal size (small, medium, large)
 * @param header - Modal header
 * @param footer - Modal footer
 * @param children - Modal children
 * @param closeOnOverlayClick - Modal close on overlay click
 * @param closeOnEscape - Modal close on escape
 * @param showCloseButton - Modal show close button
 * @param className - Modal className
 */

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  size?: 'small' | 'medium' | 'large';
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string;
}
