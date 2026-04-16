import type { System, GroupByOption, GroupedSystems } from "@/types";
import { formatLabel } from "./formatLabel";

/**
 * Extracts unique values for a given dimension from all systems.
 */
export function getUniqueValues(
  systems: System[],
  dimension: GroupByOption
): string[] {
  const values = new Set<string>();

  for (const system of systems) {
    switch (dimension) {
      case "systemType":
        values.add(system.system_type);
        break;
      case "dataUse":
        for (const decl of system.privacy_declarations) {
          values.add(decl.data_use);
        }
        break;
      case "dataCategories":
        for (const decl of system.privacy_declarations) {
          for (const cat of decl.data_categories) {
            values.add(cat);
          }
        }
        break;
    }
  }

  return Array.from(values).sort();
}

/**
 * Checks whether a system matches at least one of the given filter values
 * for the specified dimension.
 */
function systemMatchesFilter(
  system: System,
  dimension: GroupByOption,
  filterValues: string[]
): boolean {
  if (filterValues.length === 0) return true;

  switch (dimension) {
    case "systemType":
      return filterValues.includes(system.system_type);
    case "dataUse":
      return system.privacy_declarations.some((d) =>
        filterValues.includes(d.data_use)
      );
    case "dataCategories":
      return system.privacy_declarations.some((d) =>
        d.data_categories.some((c) => filterValues.includes(c))
      );
    default:
      return true;
  }
}

/**
 * Groups systems into swimlane buckets by the selected dimension,
 * then filters them by the active filter dimension and values.
 */
export function groupAndFilterSystems(
  systems: System[],
  groupBy: GroupByOption,
  filterDimension: GroupByOption | null,
  filterValues: string[]
): GroupedSystems[] {
  const filtered =
    filterDimension && filterValues.length > 0
      ? systems.filter((s) =>
          systemMatchesFilter(s, filterDimension, filterValues)
        )
      : systems;

  const groupKeys = getUniqueValues(systems, groupBy);
  const groups: GroupedSystems[] = [];

  for (const key of groupKeys) {
    const matchingSystems = filtered.filter((system) => {
      switch (groupBy) {
        case "systemType":
          return system.system_type === key;
        case "dataUse":
          return system.privacy_declarations.some((d) => d.data_use === key);
        case "dataCategories":
          return system.privacy_declarations.some((d) =>
            d.data_categories.includes(key)
          );
        default:
          return false;
      }
    });

    groups.push({
      key,
      label: formatLabel(key),
      systems: matchingSystems,
    });
  }

  return groups;
}
