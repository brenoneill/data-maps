import { useMemo } from "react";
import type { System, GroupBySelection, GroupedSystems, DimensionFilters } from "@/types";
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

interface AvailableValues {
  systemType: string[];
  dataUse: string[];
  dataCategories: string[];
}

interface UseFilteredSystemsResult {
  groups: GroupedSystems[];
  availableValues: AvailableValues;
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

  const availableValues = useMemo<AvailableValues>(
    () => ({
      systemType: getUniqueValues(systems, "systemType", fidesMode),
      dataUse: getUniqueValues(systems, "dataUse", fidesMode),
      dataCategories: getUniqueValues(systems, "dataCategories", fidesMode),
    }),
    [systems, fidesMode]
  );

  return { groups, availableValues };
}
