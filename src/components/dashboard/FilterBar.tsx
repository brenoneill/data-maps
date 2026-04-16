import { Select } from "@/components/ui/Select";
import { FilterCheckbox } from "@/components/ui/FilterCheckbox";
import { Button } from "@/components/ui/Button";
import { formatLabel, formatDimensionLabel } from "@/helpers/formatLabel";
import { getColorForValue } from "@/helpers/colors";
import type { GroupByOption } from "@/types";
import { X, Link2, Link2Off, ExternalLink, Layers, List } from "lucide-react";
import { FIDESLANG_DOCS_URL } from "@/helpers/constants";

interface FilterBarProps {
  groupBy: GroupByOption;
  filterType: GroupByOption | "";
  filters: string[];
  fidesMode: boolean;
  availableFilterValues: string[];
  fidesGroupMap: Map<string, string[]>;
  showLines: boolean;
  onGroupByChange: (value: GroupByOption) => void;
  onFilterTypeChange: (value: GroupByOption | "") => void;
  onFidesModeChange: (on: boolean) => void;
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
  fidesMode,
  availableFilterValues,
  fidesGroupMap,
  showLines,
  onGroupByChange,
  onFilterTypeChange,
  onFidesModeChange,
  onToggleFilter,
  onClearFilters,
  onShowLinesChange,
}: FilterBarProps) {
  const filterDimensionOptions = [
    { value: "", label: "None" },
    ...getFilterDimensionOptions(groupBy),
  ];

  const dataCategoriesActive =
    groupBy === "dataCategories" || filterType === "dataCategories";

  const chipColorDimension =
    fidesMode && filterType === "dataCategories"
      ? ("fidesGroup" as const)
      : filterType || "systemType";

  return (
    <div className="flex shrink-0 flex-wrap items-end gap-4 border-b border-gray-800 bg-gray-950 px-6 py-4">
      <div className="w-44">
        <Select
          label="Group by"
          value={groupBy}
          onChange={(v) => onGroupByChange(v as GroupByOption)}
          options={GROUP_BY_OPTIONS}
        />
      </div>

      <div className="w-44">
        <Select
          label="Filter by"
          value={filterType}
          onChange={(v) => onFilterTypeChange(v as GroupByOption | "")}
          options={filterDimensionOptions}
        />
      </div>

      {filterType && availableFilterValues.length > 0 && (
        <div className="flex flex-1 flex-wrap items-start gap-2">
          <span className="mt-1.5 text-xs text-gray-500">
            {fidesMode && filterType === "dataCategories"
              ? "Fides Data Group"
              : formatDimensionLabel(filterType)}
            :
          </span>

          {availableFilterValues.map((val) => {
            const secondaryLabels =
              fidesMode && filterType === "dataCategories"
                ? fidesGroupMap.get(val) ?? []
                : [];

            return (
              <div key={val} className="flex flex-col">
                <FilterCheckbox
                  label={formatLabel(val)}
                  checked={filters.includes(val)}
                  onChange={() => onToggleFilter(val)}
                  colorSet={getColorForValue(val, chipColorDimension)}
                />
                {secondaryLabels.length > 0 && (
                  <span className="ml-4 mt-0.5 max-w-48 text-[10px] leading-tight text-gray-600">
                    {secondaryLabels.join(", ")}
                  </span>
                )}
              </div>
            );
          })}

          {filters.length > 0 && (
            <Button variant="ghost" onClick={onClearFilters} className="ml-1 mt-0.5">
              <X size={12} aria-hidden="true" />
              <span>Clear</span>
            </Button>
          )}

          {fidesMode && filterType === "dataCategories" && (
            <a
              href={FIDESLANG_DOCS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 flex items-center gap-1 text-[10px] text-gray-500 transition-colors hover:text-gray-300"
            >
              Learn more
              <ExternalLink size={10} aria-hidden="true" />
            </a>
          )}
        </div>
      )}

      {/* Toggle pills */}
      <div className="ml-auto flex shrink-0 items-center gap-2">
        {dataCategoriesActive && (
          <button
            onClick={() => onFidesModeChange(!fidesMode)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              fidesMode
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-gray-700 bg-gray-800/50 text-gray-500"
            }`}
          >
            {fidesMode ? (
              <Layers size={13} aria-hidden="true" />
            ) : (
              <List size={13} aria-hidden="true" />
            )}
            Fides Data Group
          </button>
        )}

        <button
          onClick={() => onShowLinesChange(!showLines)}
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
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
    </div>
  );
}
