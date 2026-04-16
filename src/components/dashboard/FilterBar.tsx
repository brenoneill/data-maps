import { Select } from "@/components/ui/Select";
import { FilterCheckbox } from "@/components/ui/FilterCheckbox";
import { Button } from "@/components/ui/Button";
import { SentenceFilter } from "./SentenceFilter";
import { formatLabel, formatDimensionLabel } from "@/helpers/formatLabel";
import { getColorForValue } from "@/helpers/colors";
import type { GroupByOption, ViewMode, FilterMode, DimensionFilters } from "@/types";
import {
  X,
  Link2,
  Link2Off,
  ExternalLink,
  Layers,
  List,
  Columns3,
  LayoutList,
  MessageSquareText,
  SlidersHorizontal,
} from "lucide-react";
import { FIDESLANG_DOCS_URL } from "@/helpers/constants";

interface FilterBarProps {
  groupBy: GroupByOption;
  dimensionFilters: DimensionFilters;
  fidesMode: boolean;
  availableValues: {
    systemType: string[];
    dataUse: string[];
    dataCategories: string[];
  };
  fidesGroupMap: Map<string, string[]>;
  showLines: boolean;
  viewMode: ViewMode;
  filterMode: FilterMode;
  onGroupByChange: (value: GroupByOption) => void;
  onFidesModeChange: (on: boolean) => void;
  onToggleFilter: (dimension: GroupByOption, value: string) => void;
  onClearFilters: () => void;
  onShowLinesChange: (value: boolean) => void;
  onViewModeChange: (value: ViewMode) => void;
  onFilterModeChange: (value: FilterMode) => void;
}

const GROUP_BY_OPTIONS = [
  { value: "systemType", label: "System Type" },
  { value: "dataUse", label: "Data Use" },
  { value: "dataCategories", label: "Data Categories" },
];

const DIMENSION_ORDER: GroupByOption[] = [
  "systemType",
  "dataUse",
  "dataCategories",
];

export function FilterBar({
  groupBy,
  dimensionFilters,
  fidesMode,
  availableValues,
  fidesGroupMap,
  showLines,
  viewMode,
  filterMode,
  onGroupByChange,
  onFidesModeChange,
  onToggleFilter,
  onClearFilters,
  onShowLinesChange,
  onViewModeChange,
  onFilterModeChange,
}: FilterBarProps) {
  const dataCategoriesActive = groupBy === "dataCategories" || dimensionFilters.dataCategories.length > 0;
  const hasAnyFilters =
    dimensionFilters.systemType.length > 0 ||
    dimensionFilters.dataUse.length > 0 ||
    dimensionFilters.dataCategories.length > 0;

  return (
    <div className="flex shrink-0 flex-col gap-3 border-b border-gray-800 bg-gray-950 px-6 py-4">
      {/* Top row: Group by + toggle pills */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="w-44">
          <Select
            label="Group by"
            value={groupBy}
            onChange={(v) => onGroupByChange(v as GroupByOption)}
            options={GROUP_BY_OPTIONS}
          />
        </div>

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

          {viewMode === "board" && (
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
          )}

          {/* Filter mode toggle */}
          <div
            className="flex overflow-hidden rounded-full border border-gray-700"
            role="radiogroup"
            aria-label="Filter mode"
          >
            <button
              role="radio"
              aria-checked={filterMode === "checkbox"}
              aria-label="Checkbox filters"
              onClick={() => onFilterModeChange("checkbox")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                filterMode === "checkbox"
                  ? "bg-gray-700 text-gray-100"
                  : "bg-gray-800/50 text-gray-500 hover:text-gray-400"
              }`}
            >
              <SlidersHorizontal size={13} aria-hidden="true" />
              <span>Filters</span>
            </button>
            <button
              role="radio"
              aria-checked={filterMode === "sentence"}
              aria-label="Sentence filter"
              onClick={() => onFilterModeChange("sentence")}
              className={`flex items-center gap-1.5 border-l border-gray-700 px-3 py-1.5 text-xs font-medium transition-colors ${
                filterMode === "sentence"
                  ? "bg-gray-700 text-gray-100"
                  : "bg-gray-800/50 text-gray-500 hover:text-gray-400"
              }`}
            >
              <MessageSquareText size={13} aria-hidden="true" />
              <span>Query</span>
            </button>
          </div>

          {/* View mode toggle */}
          <div
            className="flex overflow-hidden rounded-full border border-gray-700"
            role="radiogroup"
            aria-label="View mode"
          >
            <button
              role="radio"
              aria-checked={viewMode === "board"}
              aria-label="Board view"
              onClick={() => onViewModeChange("board")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                viewMode === "board"
                  ? "bg-gray-700 text-gray-100"
                  : "bg-gray-800/50 text-gray-500 hover:text-gray-400"
              }`}
            >
              <Columns3 size={13} aria-hidden="true" />
              <span>Board</span>
            </button>
            <button
              role="radio"
              aria-checked={viewMode === "list"}
              aria-label="List view"
              onClick={() => onViewModeChange("list")}
              className={`flex items-center gap-1.5 border-l border-gray-700 px-3 py-1.5 text-xs font-medium transition-colors ${
                viewMode === "list"
                  ? "bg-gray-700 text-gray-100"
                  : "bg-gray-800/50 text-gray-500 hover:text-gray-400"
              }`}
            >
              <LayoutList size={13} aria-hidden="true" />
              <span>List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter row: either checkboxes or sentence builder */}
      {filterMode === "sentence" ? (
        <div className="flex items-center gap-2">
          <SentenceFilter
            dimensionFilters={dimensionFilters}
            availableValues={availableValues}
            fidesMode={fidesMode}
            fidesGroupMap={fidesGroupMap}
            onToggleFilter={onToggleFilter}
          />
          {hasAnyFilters && (
            <Button variant="ghost" onClick={onClearFilters} className="ml-1">
              <X size={12} aria-hidden="true" />
              <span>Clear</span>
            </Button>
          )}
        </div>
      ) : (
        <CheckboxFilters
          dimensionFilters={dimensionFilters}
          availableValues={availableValues}
          fidesMode={fidesMode}
          fidesGroupMap={fidesGroupMap}
          hasAnyFilters={hasAnyFilters}
          onToggleFilter={onToggleFilter}
          onClearFilters={onClearFilters}
        />
      )}
    </div>
  );
}

function CheckboxFilters({
  dimensionFilters,
  availableValues,
  fidesMode,
  fidesGroupMap,
  hasAnyFilters,
  onToggleFilter,
  onClearFilters,
}: {
  dimensionFilters: DimensionFilters;
  availableValues: {
    systemType: string[];
    dataUse: string[];
    dataCategories: string[];
  };
  fidesMode: boolean;
  fidesGroupMap: Map<string, string[]>;
  hasAnyFilters: boolean;
  onToggleFilter: (dimension: GroupByOption, value: string) => void;
  onClearFilters: () => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {DIMENSION_ORDER.map((dim) => {
        const values = availableValues[dim];
        if (values.length === 0) return null;

        const selected = dimensionFilters[dim];
        const isFidesCategories = fidesMode && dim === "dataCategories";
        const colorDimension = isFidesCategories ? ("fidesGroup" as const) : dim;

        return (
          <div key={dim} className="flex flex-wrap items-start gap-2">
            <span className="mt-1.5 shrink-0 text-xs text-gray-500">
              {isFidesCategories
                ? "Fides Data Group"
                : formatDimensionLabel(dim)}
              :
            </span>

            {values.map((val) => {
              const secondaryLabels =
                isFidesCategories ? fidesGroupMap.get(val) ?? [] : [];

              return (
                <div key={val} className="flex flex-col">
                  <FilterCheckbox
                    label={formatLabel(val)}
                    checked={selected.includes(val)}
                    onChange={() => onToggleFilter(dim, val)}
                    colorSet={getColorForValue(val, colorDimension)}
                  />
                  {secondaryLabels.length > 0 && (
                    <span className="ml-4 mt-0.5 max-w-48 text-[10px] leading-tight text-gray-600">
                      {secondaryLabels.join(", ")}
                    </span>
                  )}
                </div>
              );
            })}

            {isFidesCategories && (
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
        );
      })}

      {hasAnyFilters && (
        <div>
          <Button variant="ghost" onClick={onClearFilters}>
            <X size={12} aria-hidden="true" />
            <span>Clear all filters</span>
          </Button>
        </div>
      )}
    </div>
  );
}
