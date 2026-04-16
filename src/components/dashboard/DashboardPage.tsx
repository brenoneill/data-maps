import { useMemo } from "react";
import { useDashboardState } from "@/hooks/useDashboardState";
import { useFilteredSystems } from "@/hooks/useFilteredSystems";
import { useSlideout } from "@/context/SlideoutContext";
import { FilterBar } from "./FilterBar";
import { SwimlaneBoard } from "./SwimlaneBoard";
import { SlideoutPanel } from "@/components/layout/SlideoutPanel";
import { SystemDetail } from "./SystemDetail";
import rawData from "../../../sample_data.json";
import type { System } from "@/types";

export function DashboardPage() {
  const systems: System[] = useMemo(() => {
    const seen = new Set<string>();
    return (rawData as System[]).filter((s) => {
      if (seen.has(s.fides_key)) return false;
      seen.add(s.fides_key);
      return true;
    });
  }, []);

  const {
    groupBy,
    filterType,
    filters,
    setGroupBy,
    setFilterType,
    toggleFilter,
    clearFilters,
  } = useDashboardState();

  const { groups, availableFilterValues } = useFilteredSystems({
    systems,
    groupBy,
    filterType,
    filters,
  });

  const { isOpen, activeSystem, closeSlideout } = useSlideout();

  return (
    <div className="flex h-full flex-col">
      <FilterBar
        groupBy={groupBy}
        filterType={filterType}
        filters={filters}
        availableFilterValues={availableFilterValues}
        onGroupByChange={setGroupBy}
        onFilterTypeChange={setFilterType}
        onToggleFilter={toggleFilter}
        onClearFilters={clearFilters}
      />
      <SwimlaneBoard groups={groups} groupBy={groupBy} />

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
