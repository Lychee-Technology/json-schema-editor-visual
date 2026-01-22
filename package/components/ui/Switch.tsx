import { Switch as HeadlessSwitch } from '@headlessui/react';
import { cn } from '../../utils';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
}

export function Switch({ checked, onChange, disabled = false, className, label }: SwitchProps) {
  return (
    <HeadlessSwitch.Group>
      <div className={cn('flex items-center', className)}>
        <HeadlessSwitch
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={cn(
            'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent',
            'transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
            checked ? 'bg-primary-600' : 'bg-gray-200',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <span
            className={cn(
              'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0',
              'transition duration-200 ease-in-out',
              checked ? 'translate-x-4' : 'translate-x-0'
            )}
          />
        </HeadlessSwitch>
        {label && (
          <HeadlessSwitch.Label className={cn('ml-2 text-sm text-gray-700', disabled && 'opacity-50')}>
            {label}
          </HeadlessSwitch.Label>
        )}
      </div>
    </HeadlessSwitch.Group>
  );
}
