import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from "@headlessui/react";
import { ChevronDown, Check } from "lucide-react";
import { Fragment } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  label: string;
}

export function Select({ value, onChange, options, label }: SelectProps) {
  const selectedOption = options.find((o) => o.value === value);

  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        <label className="mb-1 block text-xs font-medium text-gray-500">
          {label}
        </label>
        <ListboxButton className="relative w-full cursor-pointer rounded-lg border border-gray-700 bg-gray-800 py-2 pl-3 pr-10 text-left text-sm text-gray-200 transition-colors hover:border-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
          <span className="block truncate">
            {selectedOption?.label ?? "Select..."}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 pt-5">
            <ChevronDown size={16} aria-hidden="true" className="text-gray-500" />
          </span>
        </ListboxButton>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <ListboxOptions className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-700 bg-gray-800 py-1 text-sm shadow-xl focus:outline-none">
            {options.map((option) => (
              <ListboxOption
                key={option.value}
                value={option.value}
                className="group relative cursor-pointer px-3 py-2 text-gray-300 select-none data-[focus]:bg-gray-700 data-[focus]:text-white"
              >
                <span className="block truncate group-data-[selected]:font-medium">
                  {option.label}
                </span>
                <span className="absolute inset-y-0 right-0 hidden items-center pr-3 text-blue-400 group-data-[selected]:flex">
                  <Check size={16} aria-hidden="true" />
                </span>
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Transition>
      </div>
    </Listbox>
  );
}
