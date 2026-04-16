import { Select } from "@/components/ui/Select";
import { FilterCheckbox } from "@/components/ui/FilterCheckbox";
import { Button } from "@/components/ui/Button";
import { formatLabel, formatDimensionLabel } from "@/helpers/formatLabel";
import { getColorForValue } from "@/helpers/colors";
import type { GroupByOption } from "@/types";
import { X, Link2, Link2Off } from "lucide-react";

interface FilterBarProps {
  groupBy: GroupByOption;
  filterType: GroupByOption | "";
  filters: string[];
  availableFilterValues: string[];
  showLines: boolean;
  onGroupByChange: (value: GroupByOption) => void;
  onFilterTypeChange: (value: GroupByOption | "") => void;
  onToggleFilter: (value: string) => void;
  onClearFilters: () => void;
  onShowLinesChange: (value: boolean) => void;
}

const GROUP_BY_OPTIONS = [
  { value: "systemType", label: "System Type" },
  { value: "dataUse", label: "Data Use" },
  { value: "dataCategories", label: "Data Categories" },
];

function getFilterDimensionOptions(groupBy: GroupByOption) {
  return GROUP_BY_OPTIONS.filter((opt) => opt.value !== groupBy);
}

export function FilterBar({
  groupBy,
  filterType,
  filters,
  availableFilterValues,
  showLines,
  onGroupByChange,
  onFilterTypeChange,
  onToggleFilter,
  onClearFilters,
  onShowLinesChange,
}: FilterBarProps) {
  const filterDimensionOptions = [
    { value: "", label: "None" },
    ...getFilterDimensionOptions(groupBy),
  ];

  return (
    <div className="flex shrink-0 flex-wrap items-end gap-4 border-b border-gray-800 bg-gray-950 px-6 py-4">
      {/* Group By selector */}
      <div className="w-44">
        <Select
          label="Group by"
          value={groupBy}
          onChange={(v) => onGroupByChange(v as GroupByOption)}
          options={GROUP_BY_OPTIONS}
        />
      </div>

      {/* Filter dimension selector */}
      <div className="w-44">
        <Select
          label="Filter by"
          value={filterType}
          onChange={(v) => onFilterTypeChange(v as GroupByOption | "")}
          options={filterDimensionOptions}
        />
      </div>

      {/* Filter value chips */}
      {filterType && availableFilterValues.length > 0 && (
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500">
            {formatDimensionLabel(filterType)}:
          </span>
          {availableFilterValues.map((val) => (
            <FilterCheckbox
              key={val}
              label={formatLabel(val)}
              checked={filters.includes(val)}
              onChange={() => onToggleFilter(val)}
              colorSet={getColorForValue(val, filterType)}
            />
          ))}

          {filters.length > 0 && (
            <Button variant="ghost" onClick={onClearFilters} className="ml-1">
              <X size={12} aria-hidden="true" />
              <span>Clear</span>
            </Button>
          )}
        </div>
      )}

      {/* Dependency lines toggle */}
      <button
        onClick={() => onShowLinesChange(!showLines)}
        className={`ml-auto flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
          showLines
            ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
            : "border-gray-700 bg-gray-800/50 text-gray-500"
        }`}
      >
        {showLines ? (
          <Link2 size={13} aria-hidden="true" />
        ) : (
          <Link2Off size={13} aria-hidden="true" />
        )}
        Show Dependencies
      </button>
    </div>
  );
}
