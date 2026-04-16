import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";
import { X, ArrowDown, ArrowUp } from "lucide-react";
import type { System } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { getColorForValue } from "@/helpers/colors";
import {
  getSystemDependencies,
  getSystemDependents,
  resolveSystem,
} from "@/helpers/systemLookup";
import { RadialGraph } from "./DependencyTree";

interface DependencyModalProps {
  system: System | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DependencyModal({
  system,
  isOpen,
  onClose,
}: DependencyModalProps) {
  const resolved = system ? (resolveSystem(system.fides_key) ?? system) : null;
  const deps = resolved ? getSystemDependencies(resolved.fides_key) : [];
  const dependents = resolved ? getSystemDependents(resolved.fides_key) : [];

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
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

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="flex max-h-[85vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-gray-800 bg-gray-925 shadow-2xl">
              {/* Header */}
              <div className="flex shrink-0 items-center justify-between border-b border-gray-800 px-6 py-4">
                <div className="flex items-center gap-3">
                  <DialogTitle className="text-lg font-semibold text-gray-100">
                    {resolved?.name}
                  </DialogTitle>
                  {resolved && (
                    <Badge
                      colorSet={getColorForValue(
                        resolved.system_type,
                        "systemType"
                      )}
                    >
                      {resolved.system_type}
                    </Badge>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-800 hover:text-gray-300"
                >
                  <X size={18} aria-hidden="true" />
                  <span className="sr-only">Close</span>
                </button>
              </div>

              {/* Two-column body */}
              {resolved && (
                <div className="flex min-h-0 flex-1 overflow-y-auto">
                  {/* Dependencies (left) */}
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      <ArrowDown size={14} aria-hidden="true" />
                      Dependencies
                      <span className="rounded-full bg-gray-800 px-2 py-0.5 text-[10px] font-medium text-gray-400">
                        {deps.length}
                      </span>
                    </h3>
                    {deps.length > 0 ? (
                      <RadialGraph rootSystem={resolved} systems={deps} />
                    ) : (
                      <p className="flex flex-1 items-center justify-center text-xs text-gray-600">
                        None
                      </p>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="my-4 w-px bg-gray-800" />

                  {/* Dependents (right) */}
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      <ArrowUp size={14} aria-hidden="true" />
                      Dependents
                      <span className="rounded-full bg-gray-800 px-2 py-0.5 text-[10px] font-medium text-gray-400">
                        {dependents.length}
                      </span>
                    </h3>
                    {dependents.length > 0 ? (
                      <RadialGraph
                        rootSystem={resolved}
                        systems={dependents}
                      />
                    ) : (
                      <p className="flex flex-1 items-center justify-center text-xs text-gray-600">
                        None
                      </p>
                    )}
                  </div>
                </div>
              )}
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
