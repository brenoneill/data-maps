import { MultiSelect } from "@/components/ui/MultiSelect";
import { formatLabel } from "@/helpers/formatLabel";
import type { FilterDimension, DimensionFilters, AvailableFilterValues } from "@/types";

interface SentenceFilterProps {
  dimensionFilters: DimensionFilters;
  availableValues: AvailableFilterValues;
  fidesMode: boolean;
  fidesGroupMap: Map<string, string[]>;
  onToggleFilter: (dimension: FilterDimension, value: string) => void;
}

function buildOptions(values: string[]) {
  return values.map((v) => ({ value: v, label: formatLabel(v) }));
}

/**
 * Natural-language sentence builder with inline multi-select dropdowns
 * for all three filter dimensions.
 */
export function SentenceFilter({
  dimensionFilters,
  availableValues,
  fidesMode,
  fidesGroupMap,
  onToggleFilter,
}: SentenceFilterProps) {
  const systemTypeOptions = buildOptions(availableValues.systemType);
  const dataUseOptions = buildOptions(availableValues.dataUse);
  const identifiabilityValues = new Set(availableValues.identifiability);

  const dataCombinedOptions = [
    ...buildOptions(availableValues.identifiability),
    ...buildOptions(availableValues.dataCategories).map((opt, i) =>
      i === 0 ? { ...opt, divider: true } : opt
    ),
  ];

  const dataCombinedValues = [
    ...dimensionFilters.identifiability,
    ...dimensionFilters.dataCategories,
  ];

  const handleDataToggle = (val: string) => {
    onToggleFilter(identifiabilityValues.has(val) ? "identifiability" : "dataCategories", val);
  };

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-gray-400">
      <span>Show me all</span>

      <MultiSelect
        values={dimensionFilters.systemType}
        onChange={(val) => onToggleFilter("systemType", val)}
        options={systemTypeOptions}
        placeholder="any system type"
        inline
      />

      <span>that collect</span>

      <MultiSelect
        values={dataCombinedValues}
        onChange={handleDataToggle}
        options={dataCombinedOptions}
        placeholder="any data"
        inline
      />

      <span>for</span>

      <MultiSelect
        values={dimensionFilters.dataUse}
        onChange={(val) => onToggleFilter("dataUse", val)}
        options={dataUseOptions}
        placeholder="any purpose"
        inline
      />
    </div>
  );
}

function FidesHint({
  availableGroups,
  selectedGroups,
  fidesGroupMap,
}: {
  availableGroups: string[];
  selectedGroups: string[];
  fidesGroupMap: Map<string, string[]>;
}) {
  const groups = selectedGroups.length > 0 ? selectedGroups : availableGroups;
  const allCategories = groups.flatMap(
    (g) => fidesGroupMap.get(g) ?? []
  );
  if (allCategories.length === 0) return null;

  return (
    <span className="text-[10px] text-gray-600">
      ({allCategories.join(", ")})
    </span>
  );
}
