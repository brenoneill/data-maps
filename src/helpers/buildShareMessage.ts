import { formatLabel } from "@/helpers/formatLabel";
import type { DimensionFilters } from "@/types";

/**
 * Builds a natural-language summary of the current filtered view for sharing.
 *
 * @param dimensionFilters - Active filter selections per dimension
 * @param systemNames - Deduplicated names of systems visible after filtering
 * @returns Human-readable summary string
 */
export function buildShareMessage(
  dimensionFilters: DimensionFilters,
  systemNames: string[]
): string {
  const { systemType, dataCategories, dataUse } = dimensionFilters;

  const systemTypeFragment =
    systemType.length > 0
      ? formatList(systemType.map(formatLabel))
      : null;

  const dataCategoryFragment =
    dataCategories.length > 0
      ? formatList(dataCategories.map(formatLabel))
      : null;

  const dataUseFragment =
    dataUse.length > 0 ? formatList(dataUse.map(formatLabel)) : null;

  const typeClause = systemTypeFragment
    ? `${systemTypeFragment} systems`
    : "systems";

  const collectClause = dataCategoryFragment
    ? ` that collect ${dataCategoryFragment} data`
    : "";

  const purposeClause = dataUseFragment ? ` for ${dataUseFragment}` : "";

  const systemList =
    systemNames.length > 0 ? `:\n${systemNames.join(", ")}` : ".";

  return `Here is a list of all the ${typeClause} we use${collectClause}${purposeClause}${systemList}`;
}

function formatList(items: string[]): string {
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}
