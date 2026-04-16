import { useMemo } from "react";
import { useDashboardState } from "@/hooks/useDashboardState";
import { useFilteredSystems } from "@/hooks/useFilteredSystems";
import { useSlideout } from "@/context/SlideoutContext";
import { getAllSystems } from "@/helpers/systemLookup";
import { getFidesGroupCategoryMap } from "@/helpers/groupSystems";
import { FilterBar } from "./FilterBar";
import { SwimlaneBoard } from "./SwimlaneBoard";
import { SlideoutPanel } from "@/components/layout/SlideoutPanel";
import { SystemDetail } from "./SystemDetail";

const systems = getAllSystems();

export function DashboardPage() {
  const {
    groupBy,
    filterType,
    filters,
    fidesMode,
    showLines,
    setGroupBy,
    setFilterType,
    setFidesMode,
    toggleFilter,
    clearFilters,
    setShowLines,
  } = useDashboardState();

  const { groups, availableFilterValues } = useFilteredSystems({
    systems,
    groupBy,
    filterType,
    filters,
    fidesMode,
  });

  const { isOpen, activeSystem, closeSlideout } = useSlideout();

  const dataCategoriesActive =
    groupBy === "dataCategories" || filterType === "dataCategories";

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
        filterType={filterType}
        filters={filters}
        fidesMode={fidesMode}
        availableFilterValues={availableFilterValues}
        fidesGroupMap={fidesGroupMap}
        showLines={showLines}
        onGroupByChange={setGroupBy}
        onFilterTypeChange={setFilterType}
        onFidesModeChange={setFidesMode}
        onToggleFilter={toggleFilter}
        onClearFilters={clearFilters}
        onShowLinesChange={setShowLines}
      />
      <SwimlaneBoard
        groups={groups}
        groupBy={groupBy}
        fidesMode={fidesMode}
        fidesGroupMap={fidesGroupMap}
        allSystems={systems}
        showLines={showLines}
      />

      <SlideoutPanel
        isOpen={isOpen}
        onClose={closeSlideout}
        title={activeSystem?.name ?? ""}
      >
        {activeSystem && <SystemDetail system={activeSystem} />}
      </SlideoutPanel>
    </div>
  );
}
