import React, { useId, useMemo, useState } from 'react';
import {
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { InputProps } from './Input.types';

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      label,
      placeholder,
      error,
      success,
      disabled = false,
      required = false,
      helperText,
      size = 'md',
      variant = 'default',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    // Estado para mostrar/ocultar contraseña
    const [showPassword, setShowPassword] = useState(false);

    // Generar ID único si no se proporciona usando useId para SSR
    // Usamos useMemo para evitar que se regenere en cada render
    const generatedId = useId();
    const inputId = useMemo(() => id || generatedId, [id, generatedId]);

    // Determinar el variant basado en error/success
    const currentVariant = error ? 'error' : success ? 'success' : variant;

    const baseStyles = `
      w-full rounded-md border transition-colors duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50
      placeholder:text-gray-400
    `;

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-3 py-2 text-base',
      lg: 'px-4 py-3 text-lg',
    };

    const variantStyles = {
      default: `
        border-gray-300 bg-white text-gray-900
        hover:border-gray-400
        focus:border-blue-500 focus:ring-blue-500
      `,
      error: `
        border-red-300 bg-white text-gray-900
        hover:border-red-400
        focus:border-red-500 focus:ring-red-500
      `,
      success: `
        border-green-300 bg-white text-gray-900
        hover:border-green-400
        focus:border-green-500 focus:ring-green-500
      `,
    };

    const labelStyles = `
      block text-sm font-medium mb-1
      ${currentVariant === 'error' ? 'text-red-700' : 'text-gray-700'}
      ${disabled ? 'text-gray-400' : ''}
    `;

    const helperTextStyles = {
      default: 'text-gray-500',
      error: 'text-red-600',
      success: 'text-green-600',
    };

    const inputClasses = `
      ${baseStyles}
      ${sizeStyles[size]}
      ${variantStyles[currentVariant]}
      ${className}
    `
      .replace(/\s+/g, ' ')
      .trim();

    const renderIcon = () => {
      // Prioridad: Error > Success > Toggle de contraseña

      // Icono de error (máxima prioridad)
      if (currentVariant === 'error') {
        return (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
          </div>
        );
      }

      // Icono de éxito (segunda prioridad)
      if (currentVariant === 'success') {
        return (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
          </div>
        );
      }

      // Icono de toggle para contraseña (menor prioridad)
      if (type === 'password') {
        return (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        );
      }

      return null;
    };

    const showIcon =
      type === 'password' ||
      currentVariant === 'error' ||
      currentVariant === 'success';

    // Determinar el tipo de input real (para el toggle de contraseña)
    const inputType = type === 'password' && showPassword ? 'text' : type;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className={labelStyles}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={`${inputClasses} ${showIcon ? 'pr-10' : ''}`}
            {...props}
          />
          {renderIcon()}
        </div>

        {(error || success || helperText) && (
          <div className="mt-1">
            {error && (
              <p className={`text-sm ${helperTextStyles.error}`}>{error}</p>
            )}
            {success && !error && (
              <p className={`text-sm ${helperTextStyles.success}`}>{success}</p>
            )}
            {helperText && !error && !success && (
              <p className={`text-sm ${helperTextStyles.default}`}>
                {helperText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
