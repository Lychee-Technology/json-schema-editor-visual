import { forwardRef } from 'react';
import { cn } from '../../utils';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  minRows?: number;
  maxRows?: number;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, minRows = 2, maxRows = 6, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={minRows}
        className={cn(
          'block w-full px-3 py-2 text-sm border border-gray-300 rounded-md',
          'focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500',
          'disabled:bg-gray-100 disabled:cursor-not-allowed',
          'resize-y',
          className
        )}
        style={{ minHeight: `${minRows * 1.5}rem`, maxHeight: `${maxRows * 1.5}rem` }}
        {...props}
      />
    );
  }
);

TextArea.displayName = 'TextArea';
