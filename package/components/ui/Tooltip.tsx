import { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export function Tooltip({ content, children, placement = 'top', className }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      let top = 0;
      let left = 0;

      switch (placement) {
        case 'top':
          top = triggerRect.top - tooltipRect.height - 8;
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
          break;
        case 'bottom':
          top = triggerRect.bottom + 8;
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
          break;
        case 'left':
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
          left = triggerRect.left - tooltipRect.width - 8;
          break;
        case 'right':
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
          left = triggerRect.right + 8;
          break;
      }

      setPosition({ top, left });
    }
  }, [isVisible, placement]);

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="inline-block"
      >
        {children}
      </div>
      {isVisible && (
        <div
          ref={tooltipRef}
          className={cn(
            'fixed z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg',
            'pointer-events-none',
            className
          )}
          style={{ top: position.top, left: position.left }}
        >
          {content}
          <div
            className={cn('absolute w-2 h-2 bg-gray-900 transform rotate-45', {
              'bottom-[-4px] left-1/2 -translate-x-1/2': placement === 'top',
              'top-[-4px] left-1/2 -translate-x-1/2': placement === 'bottom',
              'right-[-4px] top-1/2 -translate-y-1/2': placement === 'left',
              'left-[-4px] top-1/2 -translate-y-1/2': placement === 'right',
            })}
          />
        </div>
      )}
    </>
  );
}
