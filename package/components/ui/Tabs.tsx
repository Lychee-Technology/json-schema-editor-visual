import { Tab } from '@headlessui/react';
import { cn } from '../../utils';

export interface TabItem {
  key: string;
  label: React.ReactNode;
  content: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultIndex?: number;
  onChange?: (index: number) => void;
  className?: string;
}

export function Tabs({ items, defaultIndex = 0, onChange, className }: TabsProps) {
  return (
    <Tab.Group defaultIndex={defaultIndex} onChange={onChange}>
      <Tab.List className={cn('flex space-x-1 border-b border-gray-200', className)}>
        {items.map((item) => (
          <Tab
            key={item.key}
            className={({ selected }) =>
              cn(
                'px-4 py-2 text-sm font-medium leading-5 focus:outline-none',
                'border-b-2 -mb-px transition-colors',
                selected
                  ? 'text-primary-600 border-primary-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              )
            }
          >
            {item.label}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="mt-4">
        {items.map((item) => (
          <Tab.Panel key={item.key}>{item.content}</Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
}
