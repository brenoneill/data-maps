import { useState, useCallback } from "react";
import { useQueryStates, parseAsString, parseAsArrayOf } from "nuqs";
import type { GroupByOption } from "@/types";

const VALID_GROUP_BY: GroupByOption[] = [
  "systemType",
  "dataUse",
  "dataCategories",
];

const SHOW_LINES_KEY = "data-maps:showLines";

function readLocalBool(key: string, fallback: boolean): boolean {
  try {
    const stored = localStorage.getItem(key);
    return stored === null ? fallback : stored === "true";
  } catch {
    return fallback;
  }
}

function writeLocalBool(key: string, value: boolean) {
  try {
    localStorage.setItem(key, String(value));
  } catch { /* storage full or unavailable */ }
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
    fidesMode: parseAsString.withDefault("off"),
  });

  const [showLines, setShowLinesRaw] = useState(() => readLocalBool(SHOW_LINES_KEY, true));

  const setShowLines = useCallback((value: boolean) => {
    setShowLinesRaw(value);
    writeLocalBool(SHOW_LINES_KEY, value);
  }, []);

  const groupBy = VALID_GROUP_BY.includes(state.groupBy as GroupByOption)
    ? (state.groupBy as GroupByOption)
    : "systemType";

  const filterType = state.filterType as GroupByOption | "";
  const fidesMode = state.fidesMode === "on";

  const setGroupBy = (value: GroupByOption) => {
    setState({ groupBy: value, filterType: "", filters: [], fidesMode: "off" });
  };

  const setFilterType = (value: GroupByOption | "") => {
    setState({ filterType: value, filters: [], fidesMode: "off" });
  };

  const setFidesMode = (on: boolean) => {
    setState({ fidesMode: on ? "on" : "off", filters: [] });
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
    fidesMode,
    showLines,
    setGroupBy,
    setFilterType,
    setFidesMode,
    toggleFilter,
    clearFilters,
    setShowLines,
  };
}
