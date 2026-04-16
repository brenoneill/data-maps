import type { ColorSet } from "@/helpers/colors";

interface FilterCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  colorSet: ColorSet;
}

export function FilterCheckbox({
  label,
  checked,
  onChange,
  colorSet,
}: FilterCheckboxProps) {
  return (
    <label data-cy="filter-checkbox" className="group inline-flex cursor-pointer items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all ${
          checked
            ? `${colorSet.bg} ${colorSet.border} ${colorSet.text}`
            : "border-gray-700 bg-gray-800/50 text-gray-500 hover:border-gray-600 hover:text-gray-400"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full transition-colors ${
            checked ? colorSet.dot : "bg-gray-600"
          }`}
          aria-hidden="true"
        />
        {label}
      </span>
    </label>
  );
}
