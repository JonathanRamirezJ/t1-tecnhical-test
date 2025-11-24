/*
  * Card component props
  * @param header - Card header
  * @param footer - Card footer
  * @param children - Card children
  * @param image - Card image
  * @param variant - Card variant (default, outlined, elevated)
  * @param padding - Card padding (none, sm, md, lg)
  * @param className - Card className
  * @param onClick - Card onClick
  * @param hoverable - Card hoverable
*/

export interface CardProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  image?: {
    src: string;
    alt: string;
    position?: 'top' | 'bottom';
  };
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}