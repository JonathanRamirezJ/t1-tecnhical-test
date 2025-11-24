import React from 'react';
import { ButtonProps } from './Button.types';
import { ArrowPathIcon } from '@heroicons/react/20/solid';

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      icon,
      iconPosition = 'left',
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center font-medium rounded-md
      transition-all duration-200 ease-in-out
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      ${loading ? 'cursor-wait' : 'cursor-pointer'}
    `;

    const variantStyles = {
      primary: `
        bg-blue-600 text-white border border-transparent
        hover:bg-blue-700 active:bg-blue-800
        focus:ring-blue-500
        disabled:hover:bg-blue-600
      `,
      secondary: `
        bg-white text-gray-700 border border-gray-300
        hover:bg-gray-50 active:bg-gray-100
        focus:ring-gray-500
        disabled:hover:bg-white
      `,
      danger: `
        bg-red-600 text-white border border-transparent
        hover:bg-red-700 active:bg-red-800
        focus:ring-red-500
        disabled:hover:bg-red-600
      `,
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2 text-base gap-2',
      lg: 'px-6 py-3 text-lg gap-2.5',
    };

    const iconSizeStyles = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    const isDisabled = disabled || loading;

    const LoadingSpinner = () => (
      <div className="flex justify-center w-15">
        <ArrowPathIcon className="w-5 h-5 animate-spin" />
      </div>
    );

    const renderIcon = () => {
      if (loading) {
        return <LoadingSpinner />;
      }
      if (icon) {
        return <span className={iconSizeStyles[size]}>{icon}</span>;
      }
      return null;
    };

    const buttonClasses = `
      ${baseStyles}
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${className}
    `
      .replace(/\s+/g, ' ')
      .trim();

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={isDisabled}
        {...props}
      >
        {iconPosition === 'left' && renderIcon()}
        <span className={loading ? 'hidden' : ''}>{children}</span>
        {iconPosition === 'right' && renderIcon()}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
