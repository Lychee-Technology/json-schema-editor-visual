import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../utils';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function Select({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  disabled = false,
  className,
}: SelectProps) {
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      <div className={cn('relative', className)}>
        <Listbox.Button
          className={cn(
            'relative w-full cursor-pointer rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-sm',
            'border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500',
            'disabled:bg-gray-100 disabled:cursor-not-allowed'
          )}
        >
          <span className={cn('block truncate', !selectedOption && 'text-gray-400')}>
            {selectedOption?.label || placeholder}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
          </span>
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options
            className={cn(
              'absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1',
              'text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
            )}
          >
            {options.map((option) => (
              <Listbox.Option
                key={option.value}
                value={option.value}
                className={({ active }) =>
                  cn(
                    'relative cursor-pointer select-none py-2 pl-10 pr-4',
                    active ? 'bg-primary-100 text-primary-900' : 'text-gray-900'
                  )
                }
              >
                {({ selected }) => (
                  <>
                    <span className={cn('block truncate', selected && 'font-medium')}>
                      {option.label}
                    </span>
                    {selected && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600">
                        <Check className="h-4 w-4" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
