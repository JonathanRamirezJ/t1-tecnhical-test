import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from './Input';

describe('Input', () => {
  // Test 1: Renderizado básico
  it('renders correctly with default props', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  // Test 2: Tipos de input
  it('renders different input types correctly', () => {
    const { rerender } = render(<Input type="text" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');

    rerender(<Input type="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');

    rerender(<Input type="password" />);
    const passwordInput = screen.getByDisplayValue('') || document.querySelector('input[type="password"]');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  // Test 3: Label y required
  it('renders label and required indicator correctly', () => {
    render(<Input label="Email" required />);
    
    const label = screen.getByText('Email');
    expect(label).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('required');
  });

  // Test 4: Placeholder
  it('renders placeholder correctly', () => {
    render(<Input placeholder="Enter your email" />);
    const input = screen.getByPlaceholderText('Enter your email');
    expect(input).toBeInTheDocument();
  });

  // Test 5: Estado disabled
  it('handles disabled state correctly', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  // Test 6: Estados de validación - Error
  it('handles error state correctly', () => {
    render(<Input error="This field is required" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-red-300');
    
    const errorMessage = screen.getByText('This field is required');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-red-600');
    
    // Verificar icono de error
    const errorIcon = input.parentElement?.querySelector('svg');
    expect(errorIcon).toBeInTheDocument();
  });

  // Test 7: Estados de validación - Success
  it('handles success state correctly', () => {
    render(<Input success="Valid email address" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-green-300');
    
    const successMessage = screen.getByText('Valid email address');
    expect(successMessage).toBeInTheDocument();
    expect(successMessage).toHaveClass('text-green-600');
    
    // Verificar icono de success
    const successIcon = input.parentElement?.querySelector('svg');
    expect(successIcon).toBeInTheDocument();
  });

  // Test 8: Helper text
  it('renders helper text correctly', () => {
    render(<Input helperText="Enter a valid email address" />);
    
    const helperText = screen.getByText('Enter a valid email address');
    expect(helperText).toBeInTheDocument();
    expect(helperText).toHaveClass('text-gray-500');
  });

  // Test 9: Tamaños
  it('renders different sizes correctly', () => {
    const { rerender } = render(<Input size="sm" />);
    expect(screen.getByRole('textbox')).toHaveClass('px-3', 'py-1.5', 'text-sm');

    rerender(<Input size="md" />);
    expect(screen.getByRole('textbox')).toHaveClass('px-3', 'py-2', 'text-base');

    rerender(<Input size="lg" />);
    expect(screen.getByRole('textbox')).toHaveClass('px-4', 'py-3', 'text-lg');
  });

  // Test 10: Interacciones - onChange
  it('handles change events correctly', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    
    render(<Input onChange={handleChange} />);
    const input = screen.getByRole('textbox');
    
    await user.type(input, 'test@example.com');
    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue('test@example.com');
  });

  // Test 11: Focus y blur
  it('handles focus and blur events correctly', async () => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();
    const user = userEvent.setup();
    
    render(<Input onFocus={handleFocus} onBlur={handleBlur} />);
    const input = screen.getByRole('textbox');
    
    await user.click(input);
    expect(handleFocus).toHaveBeenCalledTimes(1);
    
    await user.tab();
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  // Test 12: ID único
  it('generates unique ID when not provided', () => {
    const { rerender } = render(<Input label="First" />);
    const firstInput = screen.getByRole('textbox');
    const firstId = firstInput.getAttribute('id');
    
    rerender(<Input label="Second" />);
    const secondInput = screen.getByRole('textbox');
    const secondId = secondInput.getAttribute('id');
    
    expect(firstId).toBeTruthy();
    expect(secondId).toBeTruthy();
    expect(firstId).not.toBe(secondId);
  });

  // Test 13: ID personalizado
  it('uses custom ID when provided', () => {
    render(<Input id="custom-input" label="Custom" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'custom-input');
    
    const label = screen.getByText('Custom');
    expect(label).toHaveAttribute('for', 'custom-input');
  });

  // Test 14: Prioridad de mensajes (error > success > helper)
  it('prioritizes error over success and helper text', () => {
    render(
      <Input 
        error="Error message" 
        success="Success message" 
        helperText="Helper text" 
      />
    );
    
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.queryByText('Success message')).not.toBeInTheDocument();
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
  });

  // Test 15: Success sobre helper text
  it('prioritizes success over helper text when no error', () => {
    render(
      <Input 
        success="Success message" 
        helperText="Helper text" 
      />
    );
    
    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
  });

  // Test 16: Ref forwarding
  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toBe(screen.getByRole('textbox'));
  });

  // Test 17: Props HTML nativas
  it('forwards HTML attributes correctly', () => {
    render(
      <Input 
        data-testid="custom-input"
        aria-describedby="helper"
        maxLength={50}
      />
    );
    
    const input = screen.getByTestId('custom-input');
    expect(input).toHaveAttribute('aria-describedby', 'helper');
    expect(input).toHaveAttribute('maxLength', '50');
  });

  // Test 18: Clases CSS personalizadas
  it('applies custom className correctly', () => {
    render(<Input className="custom-class" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-class');
  });
});
