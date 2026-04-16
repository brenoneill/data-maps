import { useState, useCallback } from "react";
import { useQueryStates, parseAsString, parseAsArrayOf } from "nuqs";
import type { GroupByOption, ViewMode } from "@/types";

const VALID_GROUP_BY: GroupByOption[] = [
  "systemType",
  "dataUse",
  "dataCategories",
];

const VALID_VIEW_MODES: ViewMode[] = ["board", "list"];

const SHOW_LINES_KEY = "data-maps:showLines";
const FIDES_MODE_KEY = "data-maps:fidesMode";
const VIEW_MODE_KEY = "data-maps:viewMode";

function readLocalBool(key: string, fallback: boolean): boolean {
  try {
    const stored = localStorage.getItem(key);
    return stored === null ? fallback : stored === "true";
  } catch {
    return fallback;
  }
}

function readLocalString<T extends string>(key: string, fallback: T, valid: T[]): T {
  try {
    const stored = localStorage.getItem(key);
    return stored !== null && valid.includes(stored as T) ? (stored as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch { /* storage full or unavailable */ }
}

/**
 * URL-backed dashboard state via nuqs for shareable filter/group state.
 * UI preferences (viewMode, fidesMode, showLines) persist in localStorage.
 */
export function useDashboardState() {
  const [state, setState] = useQueryStates({
    groupBy: parseAsString.withDefault("systemType"),
    filterType: parseAsString.withDefault(""),
    filters: parseAsArrayOf(parseAsString, ",").withDefault([]),
  });

  const [showLines, setShowLinesRaw] = useState(() => readLocalBool(SHOW_LINES_KEY, true));
  const [fidesMode, setFidesModeRaw] = useState(() => readLocalBool(FIDES_MODE_KEY, false));
  const [viewMode, setViewModeRaw] = useState<ViewMode>(() =>
    readLocalString(VIEW_MODE_KEY, "board", VALID_VIEW_MODES)
  );

  const setShowLines = useCallback((value: boolean) => {
    setShowLinesRaw(value);
    writeLocal(SHOW_LINES_KEY, String(value));
  }, []);

  const setFidesMode = useCallback((on: boolean) => {
    setFidesModeRaw(on);
    writeLocal(FIDES_MODE_KEY, String(on));
    setState({ filters: [] });
  }, [setState]);

  const setViewMode = useCallback((value: ViewMode) => {
    setViewModeRaw(value);
    writeLocal(VIEW_MODE_KEY, value);
  }, []);

  const groupBy = VALID_GROUP_BY.includes(state.groupBy as GroupByOption)
    ? (state.groupBy as GroupByOption)
    : "systemType";

  const filterType = state.filterType as GroupByOption | "";

  const setGroupBy = useCallback((value: GroupByOption) => {
    setState({ groupBy: value, filterType: "", filters: [] });
    setFidesModeRaw(false);
    writeLocal(FIDES_MODE_KEY, "false");
  }, [setState]);

  const setFilterType = useCallback((value: GroupByOption | "") => {
    setState({ filterType: value, filters: [] });
    setFidesModeRaw(false);
    writeLocal(FIDES_MODE_KEY, "false");
  }, [setState]);

  const toggleFilter = useCallback((value: string) => {
    const current = state.filters;
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setState({ filters: next });
  }, [state.filters, setState]);

  const clearFilters = useCallback(() => {
    setState({ filters: [] });
  }, [setState]);

  return {
    groupBy,
    filterType,
    filters: state.filters,
    fidesMode,
    showLines,
    viewMode,
    setGroupBy,
    setFilterType,
    setFidesMode,
    toggleFilter,
    clearFilters,
    setShowLines,
    setViewMode,
  };
}
