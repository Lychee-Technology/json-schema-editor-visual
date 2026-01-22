import { forwardRef } from 'react';
import { cn } from '../../utils';

export interface InputNumberProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  onChange?: (value: number | undefined) => void;
}

export const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(
  ({ className, onChange, value, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (val === '') {
        onChange?.(undefined);
      } else {
        const num = parseFloat(val);
        if (!isNaN(num)) {
          onChange?.(num);
        }
      }
    };

    return (
      <input
        ref={ref}
        type="number"
        value={value ?? ''}
        onChange={handleChange}
        className={cn(
          'block w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md',
          'focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500',
          'disabled:bg-gray-100 disabled:cursor-not-allowed',
          '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
          className
        )}
        {...props}
      />
    );
  }
);

InputNumber.displayName = 'InputNumber';
