import { useState, useCallback } from "react";
import { useQueryStates, parseAsString, parseAsArrayOf } from "nuqs";
import type { GroupByOption } from "@/types";

const VALID_GROUP_BY: GroupByOption[] = [
  "systemType",
  "dataUse",
  "dataCategories",
];

const SHOW_LINES_KEY = "data-maps:showLines";

function readShowLines(): boolean {
  try {
    const stored = localStorage.getItem(SHOW_LINES_KEY);
    return stored === null ? true : stored === "true";
  } catch {
    return true;
  }
}

/**
 * URL-backed dashboard state via nuqs.
 * Produces shareable links that preserve the exact view.
 */
export function useDashboardState() {
  const [state, setState] = useQueryStates({
    groupBy: parseAsString.withDefault("systemType"),
    filterType: parseAsString.withDefault(""),
    filters: parseAsArrayOf(parseAsString, ",").withDefault([]),
  });

  const [showLines, setShowLinesState] = useState(readShowLines);

  const setShowLines = useCallback((value: boolean) => {
    setShowLinesState(value);
    try {
      localStorage.setItem(SHOW_LINES_KEY, String(value));
    } catch { /* storage full or unavailable */ }
  }, []);

  const groupBy = VALID_GROUP_BY.includes(state.groupBy as GroupByOption)
    ? (state.groupBy as GroupByOption)
    : "systemType";

  const filterType = state.filterType as GroupByOption | "";

  const setGroupBy = (value: GroupByOption) => {
    setState({ groupBy: value, filterType: "", filters: [] });
  };

  const setFilterType = (value: GroupByOption | "") => {
    setState({ filterType: value, filters: [] });
  };

  const toggleFilter = (value: string) => {
    const current = state.filters;
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setState({ filters: next });
  };

  const clearFilters = () => {
    setState({ filters: [] });
  };

  return {
    groupBy,
    filterType,
    filters: state.filters,
    showLines,
    setGroupBy,
    setFilterType,
    toggleFilter,
    clearFilters,
    setShowLines,
  };
}
