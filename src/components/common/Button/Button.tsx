import React from 'react';
import { cn } from '../../../utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'spotlight' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const variantMap: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  spotlight: 'btn-spotlight',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
};

const sizeMap: Record<ButtonSize, string> = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}) => {
  return (
    <button
      className={cn('btn', variantMap[variant], sizeMap[size], className)}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
