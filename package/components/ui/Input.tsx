import { forwardRef } from 'react';
import { cn } from '../../utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  addonAfter?: React.ReactNode;
  addonBefore?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, addonAfter, addonBefore, disabled, ...props }, ref) => {
    if (addonAfter || addonBefore) {
      return (
        <div className={cn('flex', className)}>
          {addonBefore && (
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              {addonBefore}
            </span>
          )}
          <input
            ref={ref}
            disabled={disabled}
            className={cn(
              'flex-1 min-w-0 block w-full px-3 py-1.5 text-sm border border-gray-300',
              'focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500',
              'disabled:bg-gray-100 disabled:cursor-not-allowed',
              addonBefore && !addonAfter && 'rounded-r-md',
              addonAfter && !addonBefore && 'rounded-l-md',
              !addonBefore && !addonAfter && 'rounded-md'
            )}
            {...props}
          />
          {addonAfter && (
            <span className="inline-flex items-center px-2 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              {addonAfter}
            </span>
          )}
        </div>
      );
    }

    return (
      <input
        ref={ref}
        disabled={disabled}
        className={cn(
          'block w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md',
          'focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500',
          'disabled:bg-gray-100 disabled:cursor-not-allowed',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
