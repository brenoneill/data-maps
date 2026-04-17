import { Select } from "@/components/ui/Select";
import { FilterCheckbox } from "@/components/ui/FilterCheckbox";
import { Button } from "@/components/ui/Button";
import { SentenceFilter } from "./SentenceFilter";
import { formatLabel, formatDimensionLabel } from "@/helpers/formatLabel";
import { getColorForValue } from "@/helpers/colors";
import type { FilterDimension, GroupBySelection, ViewMode, FilterMode, DimensionFilters, AvailableFilterValues } from "@/types";
import { useState, useRef, useCallback, useEffect } from "react";
import {
  X,
  ExternalLink,
  Columns3,
  LayoutList,
  MessageSquareText,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { FIDESLANG_DOCS_URL } from "@/helpers/constants";
import { ShareMenu } from "./ShareMenu";

interface FilterBarProps {
  groupBy: GroupBySelection;
  dimensionFilters: DimensionFilters;
  fidesMode: boolean;
  availableValues: AvailableFilterValues;
  fidesGroupMap: Map<string, string[]>;
  viewMode: ViewMode;
  filterMode: FilterMode;
  systemNames: string[];
  onGroupByChange: (value: GroupBySelection) => void;
  onToggleFilter: (dimension: FilterDimension, value: string) => void;
  onClearFilters: () => void;
  onViewModeChange: (value: ViewMode) => void;
  onFilterModeChange: (value: FilterMode) => void;
}

const GROUP_BY_OPTIONS = [
  { value: "none", label: "None" },
  { value: "systemType", label: "System Type" },
  { value: "dataUse", label: "Data Use" },
  { value: "dataCategories", label: "Data Categories" },
];

const DIMENSION_ORDER: FilterDimension[] = [
  "systemType",
  "dataUse",
  "dataCategories",
];

const FILTERS_EXPANDED_KEY = "data-maps:filtersExpanded";

export function FilterBar({
  groupBy,
  dimensionFilters,
  fidesMode,
  availableValues,
  fidesGroupMap,
  viewMode,
  filterMode,
  systemNames,
  onGroupByChange,
  onToggleFilter,
  onClearFilters,
  onViewModeChange,
  onFilterModeChange,
}: FilterBarProps) {
  const [expanded, setExpanded] = useState(() => {
    try {
      return localStorage.getItem(FILTERS_EXPANDED_KEY) !== "false";
    } catch {
      return true;
    }
  });

  const [overflowVisible, setOverflowVisible] = useState(expanded);

  useEffect(() => {
    if (expanded) {
      const timer = setTimeout(() => setOverflowVisible(true), 200);
      return () => clearTimeout(timer);
    }
    setOverflowVisible(false);
  }, [expanded]);

  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | undefined>(undefined);

  const measureHeight = useCallback(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, []);

  useEffect(measureHeight, [
    measureHeight,
    filterMode,
    dimensionFilters,
    availableValues,
    fidesMode,
  ]);

  const toggleExpanded = () => {
    const next = !expanded;
    setExpanded(next);
    try {
      localStorage.setItem(FILTERS_EXPANDED_KEY, String(next));
    } catch { /* storage unavailable */ }
  };

  const hasAnyFilters =
    dimensionFilters.systemType.length > 0 ||
    dimensionFilters.dataUse.length > 0 ||
    dimensionFilters.dataCategories.length > 0 ||
    dimensionFilters.identifiability.length > 0;

  return (
    <div className="flex shrink-0 flex-col border-b border-gray-800 bg-gray-950">
      {/* Top row: Group by + toggle pills + collapse toggle */}
      <div className="flex flex-wrap items-end gap-4 px-6 py-4">
        <div className="w-44">
          <Select
            label="Group by"
            data-cy="group-by-select"
            value={groupBy}
            onChange={(v) => onGroupByChange(v as GroupBySelection)}
            options={GROUP_BY_OPTIONS}
          />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <div className="flex items-center gap-2">
            <div
              className="flex overflow-hidden rounded-full border border-gray-700"
              role="radiogroup"
              aria-label="Filter mode"
            >
              <button
                data-cy="filter-mode-checkbox"
                role="radio"
                aria-checked={filterMode === "checkbox"}
                aria-label="Checkbox filters"
                onClick={() => { onFilterModeChange("checkbox"); setExpanded(true); }}
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
                data-cy="filter-mode-sentence"
                role="radio"
                aria-checked={filterMode === "sentence"}
                aria-label="Sentence filter"
                onClick={() => { onFilterModeChange("sentence"); setExpanded(true); }}
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

            <button
              data-cy="toggle-filters"
              aria-expanded={expanded}
              aria-label={expanded ? "Collapse filters" : "Expand filters"}
              onClick={toggleExpanded}
              className="relative flex items-center gap-1.5 rounded-full border border-gray-700 bg-gray-800/50 px-3 py-1.5 text-xs font-medium text-gray-400 transition-colors hover:bg-gray-700 hover:text-gray-200"
            >
              <ChevronDown
                size={13}
                aria-hidden="true"
                className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
              />
              <span>{`${expanded ? "Hide" : "Show"} Filters`}</span>
            </button>
          </div>

          <div className="mx-1 h-5 w-px bg-gray-700" aria-hidden="true" />

          {/* View mode toggle */}
          <div
            className="flex overflow-hidden rounded-full border border-gray-700"
            role="radiogroup"
            aria-label="View mode"
          >
            <button
              data-cy="view-mode-board"
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
              data-cy="view-mode-list"
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

          <ShareMenu
            dimensionFilters={dimensionFilters}
            systemNames={systemNames}
          />
        </div>
      </div>

      {/* Collapsed summary — clickable to re-expand */}
      {!expanded && hasAnyFilters && (
        <button
          data-cy="collapsed-filter-summary"
          onClick={toggleExpanded}
          className="flex items-center gap-2 border-t border-gray-800/60 px-6 py-2 text-left text-xs text-gray-400 transition-colors hover:bg-gray-900 hover:text-gray-200"
        >
          <SlidersHorizontal size={12} className="shrink-0 text-gray-500" aria-hidden="true" />
          <span className="truncate">
            <CollapsedFilterSummary dimensionFilters={dimensionFilters} />
          </span>
          <ChevronDown size={12} className="ml-auto shrink-0 text-gray-600" aria-hidden="true" />
        </button>
      )}

      {/* Collapsible filter row */}
      <div
        data-cy="filter-panel"
        className={`transition-[max-height] duration-200 ease-in-out ${overflowVisible ? "overflow-visible" : "overflow-hidden"}`}
        style={{ maxHeight: expanded ? contentHeight ?? "none" : 0 }}
      >
        <div ref={contentRef} className="px-6 pb-4">
          {filterMode === "sentence" ? (
            <div className="flex items-center gap-2">
              <SentenceFilter
                dimensionFilters={dimensionFilters}
                availableValues={availableValues}
                onToggleFilter={onToggleFilter}
              />
              {hasAnyFilters && (
                <Button data-cy="clear-filters" variant="ghost" onClick={onClearFilters} className="ml-1">
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
      </div>
    </div>
  );
}

const SUMMARY_DIMENSIONS: FilterDimension[] = [
  "systemType",
  "dataUse",
  "dataCategories",
  "identifiability",
];

function CollapsedFilterSummary({
  dimensionFilters,
}: {
  dimensionFilters: DimensionFilters;
}) {
  const segments: string[] = [];

  for (const dim of SUMMARY_DIMENSIONS) {
    const selected = dimensionFilters[dim];
    if (selected.length === 0) continue;
    const label = formatDimensionLabel(dim);
    const values = selected.map(formatLabel).join(", ");
    segments.push(`${label}: ${values}`);
  }

  return <>{segments.join("  ·  ")}</>;
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
  availableValues: AvailableFilterValues;
  fidesMode: boolean;
  fidesGroupMap: Map<string, string[]>;
  hasAnyFilters: boolean;
  onToggleFilter: (dimension: FilterDimension, value: string) => void;
  onClearFilters: () => void;
}) {
  const identifiabilityValues = availableValues.identifiability;
  const identifiabilitySelected = dimensionFilters.identifiability;

  return (
    <div className="flex flex-col gap-2">
      {DIMENSION_ORDER.map((dim) => {
        const values = availableValues[dim];
        if (values.length === 0) return null;

        const selected = dimensionFilters[dim];
        const isFidesCategories = fidesMode && dim === "dataCategories";
        const colorDimension = isFidesCategories ? ("fidesGroup" as const) : dim;
        const isDataCategories = dim === "dataCategories";

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

            {isDataCategories && identifiabilityValues.length > 0 && (
              <>
                <div className="mx-1 mt-1 h-5 w-px bg-gray-700" aria-hidden="true" />
                <span className="mt-1.5 shrink-0 text-xs text-gray-500">
                  {formatDimensionLabel("identifiability")}:
                </span>
                {identifiabilityValues.map((val) => (
                  <FilterCheckbox
                    key={val}
                    label={formatLabel(val)}
                    checked={identifiabilitySelected.includes(val)}
                    onChange={() => onToggleFilter("identifiability", val)}
                    colorSet={getColorForValue(val, "identifiability")}
                  />
                ))}
              </>
            )}
          </div>
        );
      })}

      {hasAnyFilters && (
        <div>
          <Button data-cy="clear-filters" variant="ghost" onClick={onClearFilters}>
            <X size={12} aria-hidden="true" />
            <span>Clear all filters</span>
          </Button>
        </div>
      )}
    </div>
  );
}
