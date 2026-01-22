import { forwardRef } from 'react';
import { cn } from '../../utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, disabled, ...props }, ref) => {
    return (
      <label className={cn('inline-flex items-center', disabled && 'cursor-not-allowed', className)}>
        <input
          ref={ref}
          type="checkbox"
          disabled={disabled}
          className={cn(
            'h-4 w-4 rounded border-gray-300 text-primary-600',
            'focus:ring-primary-500 focus:ring-2',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          {...props}
        />
        {label && (
          <span className={cn('ml-2 text-sm text-gray-700', disabled && 'opacity-50')}>
            {label}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
