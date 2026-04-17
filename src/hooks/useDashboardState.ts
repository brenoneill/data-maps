import { useState, useCallback, useMemo } from "react";
import { useQueryStates, parseAsString, parseAsArrayOf } from "nuqs";
import type { FilterDimension, GroupBySelection, ViewMode, FilterMode, DimensionFilters } from "@/types";

const VALID_GROUP_BY: GroupBySelection[] = [
  "none",
  "systemType",
  "dataUse",
  "dataCategories",
];

const VALID_VIEW_MODES: ViewMode[] = ["board", "list"];
const VALID_FILTER_MODES: FilterMode[] = ["checkbox", "sentence"];

const SHOW_LINES_KEY = "data-maps:showLines";
const FIDES_MODE_KEY = "data-maps:fidesMode";
const VIEW_MODE_KEY = "data-maps:viewMode";
const FILTER_MODE_KEY = "data-maps:filterMode";

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
 * UI preferences (viewMode, fidesMode, showLines, filterMode) persist in localStorage.
 *
 * Filter state uses per-dimension URL params so all three dimensions
 * (systemType, dataUse, dataCategories) can be active simultaneously.
 */
export function useDashboardState() {
  const [state, setState] = useQueryStates({
    groupBy: parseAsString.withDefault("systemType"),
    st: parseAsArrayOf(parseAsString, ",").withDefault([]),
    du: parseAsArrayOf(parseAsString, ",").withDefault([]),
    dc: parseAsArrayOf(parseAsString, ",").withDefault([]),
    id: parseAsArrayOf(parseAsString, ",").withDefault([]),
  });

  const [showLines, setShowLinesRaw] = useState(() => readLocalBool(SHOW_LINES_KEY, true));
  const [fidesMode, setFidesModeRaw] = useState(() => readLocalBool(FIDES_MODE_KEY, false));
  const [viewMode, setViewModeRaw] = useState<ViewMode>(() =>
    readLocalString(VIEW_MODE_KEY, "board", VALID_VIEW_MODES)
  );
  const [filterMode, setFilterModeRaw] = useState<FilterMode>(() =>
    readLocalString(FILTER_MODE_KEY, "checkbox", VALID_FILTER_MODES)
  );

  const setShowLines = useCallback((value: boolean) => {
    setShowLinesRaw(value);
    writeLocal(SHOW_LINES_KEY, String(value));
  }, []);

  const setFidesMode = useCallback((on: boolean) => {
    setFidesModeRaw(on);
    writeLocal(FIDES_MODE_KEY, String(on));
    setState({ dc: [] });
  }, [setState]);

  const setViewMode = useCallback((value: ViewMode) => {
    setViewModeRaw(value);
    writeLocal(VIEW_MODE_KEY, value);
  }, []);

  const setFilterMode = useCallback((value: FilterMode) => {
    setFilterModeRaw(value);
    writeLocal(FILTER_MODE_KEY, value);
  }, []);

  const groupBy = VALID_GROUP_BY.includes(state.groupBy as GroupBySelection)
    ? (state.groupBy as GroupBySelection)
    : "systemType";

  const dimensionFilters: DimensionFilters = useMemo(
    () => ({
      systemType: state.st,
      dataUse: state.du,
      dataCategories: state.dc,
      identifiability: state.id,
    }),
    [state.st, state.du, state.dc, state.id]
  );

  const setGroupBy = useCallback((value: GroupBySelection) => {
    setState({ groupBy: value, st: [], du: [], dc: [], id: [] });
    setFidesModeRaw(false);
    writeLocal(FIDES_MODE_KEY, "false");
  }, [setState]);

  const toggleFilter = useCallback((dimension: FilterDimension, value: string) => {
    const paramKey = { systemType: "st", dataUse: "du", dataCategories: "dc", identifiability: "id" }[dimension] as "st" | "du" | "dc" | "id";
    const current = state[paramKey];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setState({ [paramKey]: next });
  }, [state.st, state.du, state.dc, state.id, setState]);

  const clearFilters = useCallback(() => {
    setState({ st: [], du: [], dc: [], id: [] });
  }, [setState]);

  return {
    groupBy,
    dimensionFilters,
    fidesMode,
    showLines,
    viewMode,
    filterMode,
    setGroupBy,
    setFidesMode,
    toggleFilter,
    clearFilters,
    setShowLines,
    setViewMode,
    setFilterMode,
  };
}
