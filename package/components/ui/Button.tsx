import { forwardRef } from 'react';
import { cn } from '../../utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500':
              variant === 'primary',
            'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500':
              variant === 'secondary',
            'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500':
              variant === 'ghost',
            'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500': variant === 'danger',
          },
          {
            'px-2.5 py-1.5 text-xs': size === 'sm',
            'px-4 py-2 text-sm': size === 'md',
            'px-6 py-3 text-base': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
