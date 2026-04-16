import { MultiSelect } from "@/components/ui/MultiSelect";
import { formatLabel } from "@/helpers/formatLabel";
import type { GroupByOption, DimensionFilters } from "@/types";

interface SentenceFilterProps {
  dimensionFilters: DimensionFilters;
  availableValues: {
    systemType: string[];
    dataUse: string[];
    dataCategories: string[];
  };
  fidesMode: boolean;
  fidesGroupMap: Map<string, string[]>;
  onToggleFilter: (dimension: GroupByOption, value: string) => void;
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

  const dataCategoryOptions = buildOptions(availableValues.dataCategories);

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
        values={dimensionFilters.dataCategories}
        onChange={(val) => onToggleFilter("dataCategories", val)}
        options={dataCategoryOptions}
        placeholder="any data"
        inline
      />

      {fidesMode &&
        dimensionFilters.dataCategories.length > 0 && (
          <FidesHint
            selectedGroups={dimensionFilters.dataCategories}
            fidesGroupMap={fidesGroupMap}
          />
        )}

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
  selectedGroups,
  fidesGroupMap,
}: {
  selectedGroups: string[];
  fidesGroupMap: Map<string, string[]>;
}) {
  const allCategories = selectedGroups.flatMap(
    (g) => fidesGroupMap.get(g) ?? []
  );
  if (allCategories.length === 0) return null;

  return (
    <span className="text-[10px] text-gray-600">
      ({allCategories.join(", ")})
    </span>
  );
}
