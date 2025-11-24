/*
 * Input component props
 * @param type - Input type (text, email, password)
 * @param label - Input label
 * @param placeholder - Input placeholder
 * @param error - Input error message
 * @param success - Input success message
 * @param disabled - Input disabled state
 * @param required - Input required state
 * @param helperText - Input helper text
 * @param size - Input size (sm, md, lg)
 * @param variant - Input variant (default, error, success)
 */

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  type?: 'text' | 'email' | 'password';
  label?: string;
  placeholder?: string;
  error?: string;
  success?: string;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'error' | 'success';
}
