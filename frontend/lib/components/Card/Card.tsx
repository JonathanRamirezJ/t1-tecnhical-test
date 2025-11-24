import React from 'react';
import { CardProps } from './Card.types';

const Card: React.FC<CardProps> = ({
  header,
  footer,
  children,
  image,
  variant = 'default',
  padding = 'md',
  className = '',
  onClick,
  hoverable = false,
}) => {
  const baseStyles = `
    bg-white rounded-lg overflow-hidden
    transition-all duration-200 ease-in-out
    ${onClick || hoverable ? 'cursor-pointer' : ''}
  `;

  const variantStyles = {
    default: 'border border-gray-200',
    outlined: 'border-2 border-gray-300',
    elevated: 'shadow-lg border border-gray-100',
  };

  const hoverStyles = (onClick || hoverable) ? `
    hover:shadow-md hover:scale-[1.02]
    active:scale-[0.98]
  ` : '';

  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const cardClasses = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${hoverStyles}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick();
    }
  };

  const CardImage = ({ position }: { position: 'top' | 'bottom' }) => {
    if (!image || image.position !== position) return null;

    return (
      <div className="w-full">
        <img
          src={image.src}
          alt={image.alt}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
      </div>
    );
  };

  const CardHeader = () => {
    if (!header) return null;

    return (
      <div className={`
        border-b border-gray-200 bg-gray-50
        ${padding === 'none' ? 'px-4 py-3' : paddingStyles[padding]}
      `}>
        {typeof header === 'string' ? (
          <h3 className="text-lg font-semibold text-gray-900">
            {header}
          </h3>
        ) : (
          header
        )}
      </div>
    );
  };

  const CardFooter = () => {
    if (!footer) return null;

    return (
      <div className={`
        border-t border-gray-200 bg-gray-50
        ${padding === 'none' ? 'px-4 py-3' : paddingStyles[padding]}
      `}>
        {footer}
      </div>
    );
  };

  const CardContent = () => (
    <div className={padding !== 'none' ? paddingStyles[padding] : ''}>
      {children}
    </div>
  );

  return (
    <div
      className={cardClasses}
      onClick={onClick ? handleClick : undefined}
      onKeyDown={onClick ? handleKeyDown : undefined}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      aria-pressed={onClick ? false : undefined}
    >
      <CardImage position="top" />
      <CardHeader />
      <CardContent />
      <CardFooter />
      <CardImage position="bottom" />
    </div>
  );
};

export default Card;
