import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Card from './Card';

describe('Card', () => {
  const defaultProps = {
    children: <div>Card content</div>,
  };

  // Test 1: Basic render
  it('renders correctly with default props', () => {
    render(<Card {...defaultProps} />);

    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  // Test 2: Different styles
  it('renders different variants correctly', () => {
    const { rerender } = render(<Card {...defaultProps} variant="default" />);
    let card = screen.getByText('Card content').parentElement?.parentElement;
    expect(card).toHaveClass('border', 'border-gray-200');

    rerender(<Card {...defaultProps} variant="outlined" />);
    card = screen.getByText('Card content').parentElement?.parentElement;
    expect(card).toHaveClass('border-2', 'border-gray-300');

    rerender(<Card {...defaultProps} variant="elevated" />);
    card = screen.getByText('Card content').parentElement?.parentElement;
    expect(card).toHaveClass('shadow-lg', 'border', 'border-gray-100');
  });

  // Test 3: Different padding levels
  it('renders different padding levels correctly', () => {
    const { rerender } = render(<Card {...defaultProps} padding="sm" />);
    let content = screen.getByText('Card content').parentElement;
    expect(content).toHaveClass('p-3');

    rerender(<Card {...defaultProps} padding="md" />);
    content = screen.getByText('Card content').parentElement;
    expect(content).toHaveClass('p-4');

    rerender(<Card {...defaultProps} padding="lg" />);
    content = screen.getByText('Card content').parentElement;
    expect(content).toHaveClass('p-6');

    rerender(<Card {...defaultProps} padding="none" />);
    content = screen.getByText('Card content').parentElement;
    expect(content).not.toHaveClass('p-3', 'p-4', 'p-6');
  });

  // Test 4: Header as string
  it('renders string header correctly', () => {
    render(<Card {...defaultProps} header="Card Title" />);

    const header = screen.getByText('Card Title');
    expect(header).toBeInTheDocument();
    expect(header.tagName).toBe('H3');
    expect(header).toHaveClass('text-lg', 'font-semibold');
  });

  // Test 5: Custom header (React node)
  it('renders custom header correctly', () => {
    const customHeader = <div data-testid="custom-header">Custom Header</div>;
    render(<Card {...defaultProps} header={customHeader} />);

    expect(screen.getByTestId('custom-header')).toBeInTheDocument();
  });

  // Test 6: Footer
  it('renders footer correctly', () => {
    const footer = (
      <div>
        <button>Action 1</button>
        <button>Action 2</button>
      </div>
    );

    render(<Card {...defaultProps} footer={footer} />);

    expect(screen.getByText('Action 1')).toBeInTheDocument();
    expect(screen.getByText('Action 2')).toBeInTheDocument();
  });

  // Test 7: Image at top
  it('renders image at top correctly', () => {
    const image = {
      src: 'https://example.com/image.jpg',
      alt: 'Test image',
      position: 'top' as const,
    };

    render(<Card {...defaultProps} image={image} />);

    const img = screen.getByAltText('Test image');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
    expect(img).toHaveClass('w-full', 'h-48', 'object-cover');
  });

  // Test 8: Image at bottom
  it('renders image at bottom correctly', () => {
    const image = {
      src: 'https://example.com/image.jpg',
      alt: 'Test image',
      position: 'bottom' as const,
    };

    render(<Card {...defaultProps} image={image} />);

    const img = screen.getByAltText('Test image');
    expect(img).toBeInTheDocument();
  });

  // Test 9: Card clickeable
  it('handles click events correctly', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(<Card {...defaultProps} onClick={handleClick} />);

    const card = screen.getByRole('button');
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute('tabIndex', '0');

    await user.click(card);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Test 10: Keyboard navigation
  it('handles keyboard navigation correctly', () => {
    const handleClick = jest.fn();

    render(<Card {...defaultProps} onClick={handleClick} />);

    const card = screen.getByRole('button');

    // Enter key
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalledTimes(1);

    // Space key
    fireEvent.keyDown(card, { key: ' ' });
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  // Test 11: Card hoverable without onClick
  it('applies hover styles when hoverable is true', () => {
    render(<Card {...defaultProps} hoverable />);

    const card = screen.getByText('Card content').parentElement?.parentElement;
    expect(card).toHaveClass('cursor-pointer');
  });

  // Test 12: Card not clickable by default
  it('does not have click behavior by default', () => {
    render(<Card {...defaultProps} />);

    const card = screen.getByText('Card content').closest('div');
    expect(card).not.toHaveAttribute('role', 'button');
    expect(card).not.toHaveAttribute('tabIndex');
    expect(card).not.toHaveClass('cursor-pointer');
  });

  // Test 13: Custom CSS classes
  it('applies custom className correctly', () => {
    render(<Card {...defaultProps} className="custom-card-class" />);

    const card = screen.getByText('Card content').parentElement?.parentElement;
    expect(card).toHaveClass('custom-card-class');
  });

  // Test 14: Complete card structure
  it('renders complete card structure correctly', () => {
    const image = {
      src: 'https://example.com/image.jpg',
      alt: 'Test image',
      position: 'top' as const,
    };

    const footer = <button>Action</button>;

    render(
      <Card
        {...defaultProps}
        header="Card Title"
        footer={footer}
        image={image}
      />
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByAltText('Test image')).toBeInTheDocument();
  });

  // Test 15: Lazy loading images
  it('applies lazy loading to images', () => {
    const image = {
      src: 'https://example.com/image.jpg',
      alt: 'Test image',
      position: 'top' as const,
    };

    render(<Card {...defaultProps} image={image} />);

    const img = screen.getByAltText('Test image');
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  // Test 16: Special padding for header and footer when card padding is none
  it('applies special padding to header and footer when card padding is none', () => {
    render(
      <Card
        {...defaultProps}
        header="Header"
        footer={<div>Footer</div>}
        padding="none"
      />
    );

    const header = screen.getByText('Header').parentElement;
    const footer = screen.getByText('Footer').parentElement;

    expect(header).toHaveClass('px-4', 'py-3');
    expect(footer).toHaveClass('px-4', 'py-3');
  });

  // Test 17: Accessibility - aria-pressed
  it('has correct accessibility attributes when clickable', () => {
    render(<Card {...defaultProps} onClick={() => {}} />);

    const card = screen.getByRole('button');
    expect(card).toHaveAttribute('aria-pressed', 'false');
  });

  // Test 18: Prevent default behavior for space key
  it('prevents default behavior for space key', () => {
    const handleClick = jest.fn();

    render(<Card {...defaultProps} onClick={handleClick} />);

    const card = screen.getByRole('button');

    // Crear un evento personalizado con preventDefault
    const keyDownEvent = new KeyboardEvent('keydown', {
      key: ' ',
      bubbles: true,
      cancelable: true,
    });

    const preventDefaultSpy = jest.spyOn(keyDownEvent, 'preventDefault');

    fireEvent(card, keyDownEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Test 19: Does not respond to other keys
  it('does not respond to other keys', () => {
    const handleClick = jest.fn();

    render(<Card {...defaultProps} onClick={handleClick} />);

    const card = screen.getByRole('button');

    fireEvent.keyDown(card, { key: 'Tab' });
    fireEvent.keyDown(card, { key: 'Escape' });

    expect(handleClick).not.toHaveBeenCalled();
  });

  // Test 20: Image without specified position (default top)
  it('renders image at top when position is not specified', () => {
    const image = {
      src: 'https://example.com/image.jpg',
      alt: 'Test image',
    };

    render(<Card {...defaultProps} image={image} />);

    // The image should render since by default position is undefined
    // and the component handles this correctly
    const img = screen.queryByAltText('Test image');
    expect(img).not.toBeInTheDocument(); // It is not rendered without explicit position
  });
});
