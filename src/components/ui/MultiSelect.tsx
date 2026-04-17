import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { ChevronDown, Check, X } from "lucide-react";
import { Fragment } from "react";

interface MultiSelectOption {
  value: string;
  label: string;
  /** Renders a thin divider line above this option */
  divider?: boolean;
}

interface MultiSelectProps {
  values: string[];
  onChange: (value: string) => void;
  options: MultiSelectOption[];
  placeholder?: string;
  label?: string;
  /** Render inline within a sentence rather than as a standalone field */
  inline?: boolean;
  className?: string;
}

/**
 * Multi-select dropdown built on Headless UI Listbox.
 * Supports both standalone (with label) and inline (sentence-builder) modes.
 *
 * @param values - Currently selected value strings
 * @param onChange - Called with a single value to toggle (add/remove)
 * @param options - Available options
 * @param placeholder - Text shown when nothing is selected
 * @param label - Optional field label (standalone mode)
 * @param inline - When true, renders compact for embedding in a sentence
 */
export function MultiSelect({
  values,
  onChange,
  options,
  placeholder = "any",
  label,
  inline = false,
  className = "",
}: MultiSelectProps) {
  const selectedLabels = values
    .map((v) => options.find((o) => o.value === v)?.label)
    .filter(Boolean);

  return (
    <Listbox
      value={values}
      onChange={(newValues: string[]) => {
        const added = newValues.find((v) => !values.includes(v));
        const removed = values.find((v) => !newValues.includes(v));
        const toggled = added ?? removed;
        if (toggled) onChange(toggled);
      }}
      multiple
    >
      <div className={`relative ${inline ? "inline-block" : ""} ${className}`}>
        {label && (
          <label className="mb-1 block text-xs font-medium text-gray-500">
            {label}
          </label>
        )}

        <ListboxButton
          className={
            inline
              ? "inline-flex cursor-pointer items-center gap-1 rounded-lg border border-gray-600 bg-gray-800/80 px-2.5 py-1 text-sm transition-colors hover:border-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              : "relative w-full cursor-pointer rounded-lg border border-gray-700 bg-gray-800 py-2 pl-3 pr-10 text-left text-sm text-gray-200 transition-colors hover:border-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          }
        >
          {selectedLabels.length === 0 ? (
            <span className="text-gray-500">{placeholder}</span>
          ) : (
            <span className="flex flex-wrap items-center gap-1">
              {selectedLabels.map((lbl) => (
                <span
                  key={lbl}
                  className="inline-flex items-center gap-1 rounded-md bg-gray-700 px-1.5 py-0.5 text-xs text-gray-200"
                >
                  {lbl}
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-200"
                    aria-label={`Remove ${lbl}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      const opt = options.find((o) => o.label === lbl);
                      if (opt) onChange(opt.value);
                    }}
                  >
                    <X size={10} aria-hidden="true" />
                  </button>
                </span>
              ))}
            </span>
          )}
          <ChevronDown
            size={14}
            aria-hidden="true"
            className={`shrink-0 text-gray-500 ${inline ? "" : "pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"}`}
          />
        </ListboxButton>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <ListboxOptions className="absolute z-50 mt-1 max-h-60 min-w-48 overflow-auto rounded-lg border border-gray-700 bg-gray-800 py-1 text-sm shadow-xl focus:outline-none">
            {options.map((option) => (
              <ListboxOption
                key={option.value}
                value={option.value}
                className={`group relative cursor-pointer px-3 py-2 text-gray-300 select-none data-[focus]:bg-gray-700 data-[focus]:text-white ${option.divider ? "border-t border-gray-700 mt-1 pt-2" : ""}`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                      values.includes(option.value)
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-600 bg-gray-900"
                    }`}
                    aria-hidden="true"
                  >
                    {values.includes(option.value) && (
                      <Check size={12} className="text-white" />
                    )}
                  </span>
                  <span className="block truncate">{option.label}</span>
                </span>
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Transition>
      </div>
    </Listbox>
  );
}
