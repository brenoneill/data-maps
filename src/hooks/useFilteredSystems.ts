import { useMemo } from "react";
import type { System, GroupByOption, GroupedSystems } from "@/types";
import {
  groupAndFilterSystems,
  getUniqueValues,
} from "@/helpers/groupSystems";

interface UseFilteredSystemsParams {
  systems: System[];
  groupBy: GroupByOption;
  filterType: GroupByOption | "";
  filters: string[];
  fidesMode: boolean;
}

interface UseFilteredSystemsResult {
  groups: GroupedSystems[];
  availableFilterValues: string[];
}

export function useFilteredSystems({
  systems,
  groupBy,
  filterType,
  filters,
  fidesMode,
}: UseFilteredSystemsParams): UseFilteredSystemsResult {
  const groups = useMemo(
    () =>
      groupAndFilterSystems(
        systems,
        groupBy,
        filterType || null,
        filters,
        fidesMode
      ),
    [systems, groupBy, filterType, filters, fidesMode]
  );

  const availableFilterValues = useMemo(
    () => (filterType ? getUniqueValues(systems, filterType, fidesMode) : []),
    [systems, filterType, fidesMode]
  );

  return { groups, availableFilterValues };
}
