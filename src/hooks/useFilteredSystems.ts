import { useMemo } from "react";
import type { System, GroupBySelection, GroupedSystems, DimensionFilters, AvailableFilterValues } from "@/types";
import {
  groupAndFilterSystems,
  getUniqueValues,
} from "@/helpers/groupSystems";

interface UseFilteredSystemsParams {
  systems: System[];
  groupBy: GroupBySelection;
  dimensionFilters: DimensionFilters;
  fidesMode: boolean;
}

interface UseFilteredSystemsResult {
  groups: GroupedSystems[];
  availableValues: AvailableFilterValues;
}

export function useFilteredSystems({
  systems,
  groupBy,
  dimensionFilters,
  fidesMode,
}: UseFilteredSystemsParams): UseFilteredSystemsResult {
  const groups = useMemo(
    () =>
      groupAndFilterSystems(
        systems,
        groupBy,
        dimensionFilters,
        fidesMode
      ),
    [systems, groupBy, dimensionFilters, fidesMode]
  );

  const availableValues = useMemo<AvailableFilterValues>(
    () => ({
      systemType: getUniqueValues(systems, "systemType", fidesMode),
      dataUse: getUniqueValues(systems, "dataUse", fidesMode),
      dataCategories: getUniqueValues(systems, "dataCategories", fidesMode),
      identifiability: getUniqueValues(systems, "identifiability"),
    }),
    [systems, fidesMode]
  );

  return { groups, availableValues };
}
