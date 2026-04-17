import type { System, FilterDimension, GroupBySelection, GroupedSystems, DimensionFilters } from "@/types";
import { formatLabel } from "./formatLabel";
import { classifyCategory, extractIdentifiability } from "./categoryClassification";

/**
 * Extracts unique values for a given dimension from all systems.
 * When dimension is "dataCategories" and fidesMode is true, returns
 * Fides Group names instead of raw category strings.
 *
 * @param systems - Array of systems to extract values from
 * @param dimension - The dimension to extract unique values for
 * @param fidesMode - When true and dimension is dataCategories, use Fides Group grouping
 * @returns Sorted array of unique string values
 */
export function getUniqueValues(
  systems: System[],
  dimension: FilterDimension,
  fidesMode = false
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
            values.add(fidesMode ? classifyCategory(cat) : cat);
          }
        }
        break;
      case "identifiability":
        for (const decl of system.privacy_declarations) {
          for (const cat of decl.data_categories) {
            const id = extractIdentifiability(cat);
            if (id !== "unknown") values.add(id);
          }
        }
        break;
    }
  }

  return Array.from(values).sort();
}

/**
 * Builds a map from Fides Group name to the formatted category labels that belong to it.
 *
 * @param systems - Array of systems to scan
 * @returns Map where keys are Fides Group names and values are formatted category labels
 */
export function getFidesGroupCategoryMap(
  systems: System[]
): Map<string, string[]> {
  const groupMap = new Map<string, Set<string>>();

  for (const system of systems) {
    for (const decl of system.privacy_declarations) {
      for (const cat of decl.data_categories) {
        const group = classifyCategory(cat);
        if (!groupMap.has(group)) {
          groupMap.set(group, new Set());
        }
        groupMap.get(group)!.add(formatLabel(cat));
      }
    }
  }

  const result = new Map<string, string[]>();
  for (const [group, labels] of groupMap) {
    result.set(group, Array.from(labels).sort());
  }
  return result;
}

function systemMatchesFilter(
  system: System,
  dimension: FilterDimension,
  filterValues: string[],
  fidesMode: boolean
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
      if (fidesMode) {
        return system.privacy_declarations.some((d) =>
          d.data_categories.some((c) =>
            filterValues.includes(classifyCategory(c))
          )
        );
      }
      return system.privacy_declarations.some((d) =>
        d.data_categories.some((c) => filterValues.includes(c))
      );
    case "identifiability":
      return system.privacy_declarations.some((d) =>
        d.data_categories.some((c) =>
          filterValues.includes(extractIdentifiability(c))
        )
      );
    default:
      return true;
  }
}

const DIMENSIONS: FilterDimension[] = ["systemType", "dataUse", "dataCategories", "identifiability"];

/**
 * Groups systems into swimlane buckets by the selected dimension,
 * then filters them by all active dimension filters (AND across dimensions, OR within).
 *
 * @param systems - All systems to group
 * @param groupBy - The dimension to group by
 * @param dimensionFilters - Per-dimension filter value arrays
 * @param fidesMode - When true and a dataCategories dimension is involved, use Fides Group logic
 * @returns Array of grouped systems
 */
export function groupAndFilterSystems(
  systems: System[],
  groupBy: GroupBySelection,
  dimensionFilters: DimensionFilters,
  fidesMode = false
): GroupedSystems[] {
  let filtered = systems;

  for (const dim of DIMENSIONS) {
    const values = dimensionFilters[dim];
    if (values.length > 0) {
      filtered = filtered.filter((s) =>
        systemMatchesFilter(s, dim, values, fidesMode)
      );
    }
  }

  if (groupBy === "none") {
    return [{ key: "all", label: "All Systems", systems: filtered }];
  }

  const groupKeys = getUniqueValues(systems, groupBy, fidesMode);
  const groups: GroupedSystems[] = [];

  for (const key of groupKeys) {
    const matchingSystems = filtered.filter((system) => {
      switch (groupBy) {
        case "systemType":
          return system.system_type === key;
        case "dataUse":
          return system.privacy_declarations.some((d) => d.data_use === key);
        case "dataCategories":
          if (fidesMode) {
            return system.privacy_declarations.some((d) =>
              d.data_categories.some(
                (c) => classifyCategory(c) === key
              )
            );
          }
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
