import { Select } from "@/components/ui/Select";
import { FilterCheckbox } from "@/components/ui/FilterCheckbox";
import { Button } from "@/components/ui/Button";
import { formatLabel, formatDimensionLabel } from "@/helpers/formatLabel";
import { getColorForValue } from "@/helpers/colors";
import type { GroupByOption } from "@/types";
import { X } from "lucide-react";

interface FilterBarProps {
  groupBy: GroupByOption;
  filterType: GroupByOption | "";
  filters: string[];
  availableFilterValues: string[];
  onGroupByChange: (value: GroupByOption) => void;
  onFilterTypeChange: (value: GroupByOption | "") => void;
  onToggleFilter: (value: string) => void;
  onClearFilters: () => void;
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
  onGroupByChange,
  onFilterTypeChange,
  onToggleFilter,
  onClearFilters,
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
    </div>
  );
}
