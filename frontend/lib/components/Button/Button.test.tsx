import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button', () => {
  // Test 1: Basic render
  it('renders correctly with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-blue-600'); // primary variant by default
  });

  // Test 2: Variants
  it('renders different variants correctly', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-blue-600');

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-white', 'text-gray-700');

    rerender(<Button variant="danger">Danger</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-red-600');
  });

  // Test 3: Sizes
  it('renders different sizes correctly', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-3', 'py-1.5', 'text-sm');

    rerender(<Button size="md">Medium</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-4', 'py-2', 'text-base');

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-6', 'py-3', 'text-lg');
  });

  // Test 4: Disabled state
  it('handles disabled state correctly', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass(
      'disabled:opacity-50',
      'disabled:cursor-not-allowed'
    );
  });

  // Test 5: Loading state
  it('handles loading state correctly', () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('cursor-wait');
    expect(screen.getByText('Loading')).toHaveClass('hidden');
    // Verify that the spinner is present
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  // Test 6: Interactions - onClick
  it('handles click events correctly', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole('button');

    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Test 7: Does not call onClick when disabled
  it('does not call onClick when disabled', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(
      <Button onClick={handleClick} disabled>
        Disabled
      </Button>
    );
    const button = screen.getByRole('button');

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  // Test 8: Icon support
  it('renders with icon correctly', () => {
    const TestIcon = () => <span data-testid="test-icon">🔥</span>;

    render(
      <Button icon={<TestIcon />} iconPosition="left">
        With Icon
      </Button>
    );

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  // Test 9: Icon position
  it('renders icon in correct position', () => {
    const TestIcon = () => <span data-testid="test-icon">🔥</span>;

    const { rerender } = render(
      <Button icon={<TestIcon />} iconPosition="left">
        Left Icon
      </Button>
    );

    let button = screen.getByRole('button');
    let icon = screen.getByTestId('test-icon');

    // Verify that the icon is present
    expect(icon).toBeInTheDocument();

    // For iconPosition="left", the first child should contain the icon
    const firstChild = button.firstElementChild;
    expect(firstChild).toContainElement(icon);

    rerender(
      <Button icon={<TestIcon />} iconPosition="right">
        Right Icon
      </Button>
    );

    button = screen.getByRole('button');
    icon = screen.getByTestId('test-icon');

    // For iconPosition="right", the last child should contain the icon
    const lastChild = button.lastElementChild;
    expect(lastChild).toContainElement(icon);
  });

  // Test 10: HTML native props
  it('forwards HTML attributes correctly', () => {
    render(
      <Button
        data-testid="custom-button"
        aria-label="Custom button"
        type="submit"
      >
        Submit
      </Button>
    );

    const button = screen.getByTestId('custom-button');
    expect(button).toHaveAttribute('aria-label', 'Custom button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  // Test 11: Ref forwarding
  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Button with ref</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toBe(screen.getByRole('button'));
  });

  // Test 12: Custom CSS classes
  it('applies custom className correctly', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });
});
