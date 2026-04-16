import { useMemo } from "react";
import { useDashboardState } from "@/hooks/useDashboardState";
import { useFilteredSystems } from "@/hooks/useFilteredSystems";
import { useSlideout } from "@/context/SlideoutContext";
import { usePreferences } from "@/context/PreferencesContext";
import { getAllSystems } from "@/helpers/systemLookup";
import { getFidesGroupCategoryMap } from "@/helpers/groupSystems";
import { FilterBar } from "./FilterBar";
import { SwimlaneBoard } from "./SwimlaneBoard";
import { GroupedListView } from "./GroupedListView";
import { SlideoutPanel } from "@/components/layout/SlideoutPanel";
import { PreferencesPanel } from "@/components/layout/PreferencesPanel";
import { SystemDetail } from "./SystemDetail";

const systems = getAllSystems();

export function DashboardPage() {
  const {
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
  } = useDashboardState();

  const { groups, availableValues } = useFilteredSystems({
    systems,
    groupBy,
    dimensionFilters,
    fidesMode,
  });

  const { isOpen, activeSystem, closeSlideout } = useSlideout();
  const {
    isOpen: prefsOpen,
    closePreferences,
  } = usePreferences();

  const dataCategoriesActive =
    groupBy === "dataCategories" || dimensionFilters.dataCategories.length > 0;

  const fidesGroupMap = useMemo(
    () =>
      dataCategoriesActive && fidesMode
        ? getFidesGroupCategoryMap(systems)
        : new Map<string, string[]>(),
    [dataCategoriesActive, fidesMode]
  );

  return (
    <div className="flex h-full flex-col">
      <FilterBar
        groupBy={groupBy}
        dimensionFilters={dimensionFilters}
        fidesMode={fidesMode}
        availableValues={availableValues}
        fidesGroupMap={fidesGroupMap}
        viewMode={viewMode}
        filterMode={filterMode}
        onGroupByChange={setGroupBy}
        onToggleFilter={toggleFilter}
        onClearFilters={clearFilters}
        onViewModeChange={setViewMode}
        onFilterModeChange={setFilterMode}
      />
      {viewMode === "board" ? (
        <SwimlaneBoard
          groups={groups}
          groupBy={groupBy}
          fidesMode={fidesMode}
          fidesGroupMap={fidesGroupMap}
          allSystems={systems}
          showLines={showLines}
        />
      ) : (
        <GroupedListView
          groups={groups}
          groupBy={groupBy}
          fidesMode={fidesMode}
          fidesGroupMap={fidesGroupMap}
        />
      )}

      <SlideoutPanel
        isOpen={isOpen}
        onClose={closeSlideout}
        title={activeSystem?.name ?? ""}
      >
        {activeSystem && <SystemDetail system={activeSystem} />}
      </SlideoutPanel>

      <PreferencesPanel
        isOpen={prefsOpen}
        onClose={closePreferences}
        showLines={showLines}
        fidesMode={fidesMode}
        viewMode={viewMode}
        filterMode={filterMode}
        onShowLinesChange={setShowLines}
        onFidesModeChange={setFidesMode}
        onViewModeChange={setViewMode}
        onFilterModeChange={setFilterMode}
      />
    </div>
  );
}
