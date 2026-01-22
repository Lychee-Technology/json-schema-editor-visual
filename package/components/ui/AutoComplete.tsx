import { useState, Fragment } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { cn } from '../../utils';

export interface AutoCompleteOption {
  value: string;
  label?: string;
}

export interface AutoCompleteProps {
  value: string;
  onChange: (value: string | null) => void;
  options: AutoCompleteOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  addonAfter?: React.ReactNode;
}

export function AutoComplete({
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  className,
  addonAfter,
}: AutoCompleteProps) {
  const [query, setQuery] = useState('');

  const filteredOptions =
    query === ''
      ? options
      : options.filter((option) =>
          (option.label || option.value).toLowerCase().includes(query.toLowerCase())
        );

  return (
    <Combobox value={value} onChange={onChange} disabled={disabled}>
      <div className={cn('relative', className)}>
        <div className="flex">
          <Combobox.Input
            className={cn(
              'flex-1 min-w-0 block w-full px-3 py-1.5 text-sm border border-gray-300',
              'focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500',
              'disabled:bg-gray-100 disabled:cursor-not-allowed',
              addonAfter ? 'rounded-l-md' : 'rounded-md'
            )}
            placeholder={placeholder}
            onChange={(e) => {
              setQuery(e.target.value);
              onChange(e.target.value);
            }}
            displayValue={(val: string) => val}
          />
          {addonAfter && (
            <span className="inline-flex items-center px-2 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              {addonAfter}
            </span>
          )}
        </div>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery('')}
        >
          <Combobox.Options
            className={cn(
              'absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1',
              'text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
            )}
          >
            {filteredOptions.length === 0 && query !== '' ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                Nothing found.
              </div>
            ) : (
              filteredOptions.map((option) => (
                <Combobox.Option
                  key={option.value}
                  value={option.value}
                  className={({ active }) =>
                    cn(
                      'relative cursor-pointer select-none py-2 px-4',
                      active ? 'bg-primary-100 text-primary-900' : 'text-gray-900'
                    )
                  }
                >
                  {option.label || option.value}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
}
