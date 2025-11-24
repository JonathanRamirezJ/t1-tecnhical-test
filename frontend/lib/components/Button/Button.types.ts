/**
 * Button component props
 * @param variant - Button variant (primary, secondary, danger)
 * @param size - Button size (sm, md, lg)
 * @param loading - Button loading state
 * @param disabled - Button disabled state
 * @param icon - Button icon
 * @param iconPosition - Button icon position (left, right)
 * @param children - Button children
 */

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}