import { useState, useCallback } from "react";
import { useDashboardState } from "@/hooks/useDashboardState";
import { useFilteredSystems } from "@/hooks/useFilteredSystems";
import { useSlideout } from "@/context/SlideoutContext";
import { getAllSystems } from "@/helpers/systemLookup";
import type { System } from "@/types";
import { FilterBar } from "./FilterBar";
import { SwimlaneBoard } from "./SwimlaneBoard";
import { SlideoutPanel } from "@/components/layout/SlideoutPanel";
import { SystemDetail } from "./SystemDetail";
import { DependencyModal } from "./DependencyModal";

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

  const { isOpen, activeSystem, openSlideout, closeSlideout } = useSlideout();

  const [depSystem, setDepSystem] = useState<System | null>(null);
  const [depModalOpen, setDepModalOpen] = useState(false);

  const openDepModal = useCallback((system: System) => {
    setDepSystem(system);
    setDepModalOpen(true);
  }, []);

  const closeDepModal = useCallback(() => {
    setDepModalOpen(false);
    setTimeout(() => setDepSystem(null), 200);
  }, []);

  const handleModalSeeMore = useCallback(
    (system: System) => {
      setDepModalOpen(false);
      setTimeout(() => {
        setDepSystem(null);
        openSlideout(system);
      }, 200);
    },
    [openSlideout]
  );

  const handleSlideoutSeeGraph = useCallback(
    (system: System) => {
      closeSlideout();
      setTimeout(() => openDepModal(system), 300);
    },
    [closeSlideout, openDepModal]
  );

  return (
    <div className="flex h-full flex-col">
      <FilterBar
        groupBy={groupBy}
        filterType={filterType}
        filters={filters}
        fidesMode={fidesMode}
        availableFilterValues={availableFilterValues}
        systems={systems}
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
        allSystems={systems}
        showLines={showLines}
        onOpenDeps={openDepModal}
      />

      <SlideoutPanel
        isOpen={isOpen}
        onClose={closeSlideout}
        title={activeSystem?.name ?? ""}
      >
        {activeSystem && (
          <SystemDetail
            system={activeSystem}
            onSeeGraph={handleSlideoutSeeGraph}
          />
        )}
      </SlideoutPanel>

      <DependencyModal
        system={depSystem}
        isOpen={depModalOpen}
        onClose={closeDepModal}
        onSeeMore={handleModalSeeMore}
      />
    </div>
  );
}
