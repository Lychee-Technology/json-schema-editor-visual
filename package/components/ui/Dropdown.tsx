import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { cn } from '../../utils';

export interface DropdownItem {
  key: string;
  label: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  className?: string;
}

export function Dropdown({ trigger, items, className }: DropdownProps) {
  return (
    <Menu as="div" className={cn('relative inline-block text-left', className)}>
      <Menu.Button as={Fragment}>{trigger}</Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={cn(
            'absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg',
            'ring-1 ring-black ring-opacity-5 focus:outline-none'
          )}
        >
          <div className="py-1">
            {items.map((item) => (
              <Menu.Item key={item.key} disabled={item.disabled}>
                {({ active }) => (
                  <button
                    onClick={item.onClick}
                    className={cn(
                      'block w-full px-4 py-2 text-left text-sm',
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      item.disabled && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {item.label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
