import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from './Input';

describe('Input', () => {
  // Test 1: Basic render
  it('renders correctly with default props', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  // Test 2: Input types
  it('renders different input types correctly', () => {
    const { rerender } = render(<Input type="text" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');

    rerender(<Input type="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');

    rerender(<Input type="password" />);
    const passwordInput =
      screen.getByDisplayValue('') ||
      document.querySelector('input[type="password"]');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  // Test 3: Label and required
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

  // Test 5: Disabled state
  it('handles disabled state correctly', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toHaveClass(
      'disabled:opacity-50',
      'disabled:cursor-not-allowed'
    );
  });

  // Test 6: Error state
  it('handles error state correctly', () => {
    render(<Input error="This field is required" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-red-300');

    const errorMessage = screen.getByText('This field is required');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-red-600');

    // Verify error icon (Heroicons)
    const container = input.parentElement;
    const errorIcon = container?.querySelector(
      '[data-testid="ExclamationCircleIcon"], svg'
    );
    expect(errorIcon).toBeInTheDocument();
  });

  // Test 7: Success state
  it('handles success state correctly', () => {
    render(<Input success="Valid email address" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-green-300');

    const successMessage = screen.getByText('Valid email address');
    expect(successMessage).toBeInTheDocument();
    expect(successMessage).toHaveClass('text-green-600');

    // Verify success icon (Heroicons)
    const container = input.parentElement;
    const successIcon = container?.querySelector(
      '[data-testid="CheckCircleIcon"], svg'
    );
    expect(successIcon).toBeInTheDocument();
  });

  // Test 8: Helper text
  it('renders helper text correctly', () => {
    render(<Input helperText="Enter a valid email address" />);

    const helperText = screen.getByText('Enter a valid email address');
    expect(helperText).toBeInTheDocument();
    expect(helperText).toHaveClass('text-gray-500');
  });

  // Test 9: Sizes
  it('renders different sizes correctly', () => {
    const { rerender } = render(<Input size="sm" />);
    expect(screen.getByRole('textbox')).toHaveClass(
      'px-3',
      'py-1.5',
      'text-sm'
    );

    rerender(<Input size="md" />);
    expect(screen.getByRole('textbox')).toHaveClass(
      'px-3',
      'py-2',
      'text-base'
    );

    rerender(<Input size="lg" />);
    expect(screen.getByRole('textbox')).toHaveClass('px-4', 'py-3', 'text-lg');
  });

  // Test 10: onChange events
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

  // Test 12: Unique ID
  it('generates unique ID when not provided', () => {
    render(
      <div>
        <Input label="First" />
        <Input label="Second" />
      </div>
    );

    const inputs = screen.getAllByRole('textbox');
    const firstId = inputs[0].getAttribute('id');
    const secondId = inputs[1].getAttribute('id');

    expect(firstId).toBeTruthy();
    expect(secondId).toBeTruthy();
    // IDs must be different when components are separated
    expect(firstId).not.toBe(secondId);
  });

  // Test 13: Custom ID
  it('uses custom ID when provided', () => {
    render(<Input id="custom-input" label="Custom" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'custom-input');

    const label = screen.getByText('Custom');
    expect(label).toHaveAttribute('for', 'custom-input');
  });

  // Test 14: Prioritizes error over success and helper text
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

  // Test 15: Prioritizes success over helper text when no error
  it('prioritizes success over helper text when no error', () => {
    render(<Input success="Success message" helperText="Helper text" />);

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

  // Test 17: HTML attributes
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

  // Test 18: Custom classes
  it('applies custom className correctly', () => {
    render(<Input className="custom-class" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-class');
  });

  // Test 19: Password toggle button
  it('renders password toggle button for password input', () => {
    render(<Input type="password" />);

    const passwordInput = document.querySelector('input[type="password"]');
    expect(passwordInput).toBeInTheDocument();

    // Verify that the toggle button exists
    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveAttribute('type', 'button');

    // Verify eye icon (EyeIcon by default)
    const container = passwordInput?.parentElement;
    const eyeIcon = container?.querySelector('svg');
    expect(eyeIcon).toBeInTheDocument();
  });

  // Test 20: Password toggle functionality
  it('toggles password visibility when button is clicked', async () => {
    const user = userEvent.setup();
    render(<Input type="password" value="secretpassword" readOnly />);

    const passwordInput = document.querySelector('input') as HTMLInputElement;
    const toggleButton = screen.getByRole('button');

    // Initially should be type password
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Click to show password
    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    // Click to hide password
    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  // Test 21: Password toggle button - Not displayed for non-password inputs
  it('does not render toggle button for non-password inputs', () => {
    render(<Input type="text" />);

    const toggleButton = screen.queryByRole('button');
    expect(toggleButton).not.toBeInTheDocument();
  });

  // Test 22: Prioritizes error icon over password toggle
  it('prioritizes error icon over password toggle', () => {
    render(<Input type="password" error="Password is required" />);

    const passwordInput = document.querySelector('input[type="password"]');
    expect(passwordInput).toBeInTheDocument();

    // Should not have toggle button when there is an error
    const toggleButton = screen.queryByRole('button');
    expect(toggleButton).not.toBeInTheDocument();

    // Should display error icon
    const container = passwordInput?.parentElement;
    const errorIcon = container?.querySelector('svg');
    expect(errorIcon).toBeInTheDocument();

    const errorMessage = screen.getByText('Password is required');
    expect(errorMessage).toBeInTheDocument();
  });

  // Test 23: Prioritizes success icon over password toggle
  it('prioritizes success icon over password toggle', () => {
    render(<Input type="password" success="Strong password" />);

    const passwordInput = document.querySelector('input[type="password"]');
    expect(passwordInput).toBeInTheDocument();

    // Should not have toggle button when there is a success
    const toggleButton = screen.queryByRole('button');
    expect(toggleButton).not.toBeInTheDocument();

    // Should display success icon
    const container = passwordInput?.parentElement;
    const successIcon = container?.querySelector('svg');
    expect(successIcon).toBeInTheDocument();

    const successMessage = screen.getByText('Strong password');
    expect(successMessage).toBeInTheDocument();
  });
});
