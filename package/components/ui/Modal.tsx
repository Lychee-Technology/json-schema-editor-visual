import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { cn } from '../../utils';
import { Button } from './Button';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  width?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  className,
  width = 'md',
}: ModalProps) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={cn(
                  'w-full transform overflow-hidden rounded-lg bg-white shadow-xl transition-all',
                  {
                    'max-w-sm': width === 'sm',
                    'max-w-md': width === 'md',
                    'max-w-lg': width === 'lg',
                    'max-w-3xl': width === 'xl',
                  },
                  className
                )}
              >
                {title && (
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
                      {title}
                    </Dialog.Title>
                    <button
                      onClick={onClose}
                      className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}

                <div className="px-6 py-4">{children}</div>

                {footer && (
                  <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                    {footer}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export interface ConfirmModalProps extends Omit<ModalProps, 'footer'> {
  onOk?: () => void;
  okText?: string;
  cancelText?: string;
}

export function ConfirmModal({
  onClose,
  onOk,
  okText = 'OK',
  cancelText = 'Cancel',
  ...props
}: ConfirmModalProps) {
  return (
    <Modal
      {...props}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {cancelText}
          </Button>
          <Button
            onClick={() => {
              onOk?.();
            }}
          >
            {okText}
          </Button>
        </>
      }
    />
  );
}
