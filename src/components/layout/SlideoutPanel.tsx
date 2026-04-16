import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { X } from "lucide-react";
import { Fragment, type ReactNode } from "react";

interface SlideoutPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function SlideoutPanel({
  isOpen,
  onClose,
  title,
  children,
}: SlideoutPanelProps) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        {/* Backdrop */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
        </TransitionChild>

        {/* Panel */}
        <div className="fixed inset-0 flex justify-end">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="ease-in duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <DialogPanel className="flex w-full max-w-2xl flex-col border-l border-gray-800 bg-gray-925 shadow-2xl">
              <div className="flex shrink-0 items-center justify-between px-6 pt-6 pb-4">
                <DialogTitle className="text-lg font-semibold text-gray-100">
                  {title}
                </DialogTitle>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-800 hover:text-gray-300"
                >
                  <X size={18} aria-hidden="true" />
                  <span className="sr-only">Close panel</span>
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
                {children}
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
