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
}: UseFilteredSystemsParams): UseFilteredSystemsResult {
  const groups = useMemo(
    () =>
      groupAndFilterSystems(
        systems,
        groupBy,
        filterType || null,
        filters
      ),
    [systems, groupBy, filterType, filters]
  );

  const availableFilterValues = useMemo(
    () => (filterType ? getUniqueValues(systems, filterType) : []),
    [systems, filterType]
  );

  return { groups, availableFilterValues };
}
