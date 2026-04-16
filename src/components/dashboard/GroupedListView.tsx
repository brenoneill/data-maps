import type { GroupBySelection, GroupedSystems } from "@/types";
import { getColorForValue } from "@/helpers/colors";
import { EmptyState } from "@/components/ui/EmptyState";
import { SystemRow } from "./SystemRow";
import { FidesGroupBanner } from "./FidesGroupBanner";

interface GroupedListViewProps {
  groups: GroupedSystems[];
  groupBy: GroupBySelection;
  fidesMode: boolean;
  fidesGroupMap: Map<string, string[]>;
}

export function GroupedListView({
  groups,
  groupBy,
  fidesMode,
  fidesGroupMap,
}: GroupedListViewProps) {
  const isUngrouped = groupBy === "none";
  const isFidesGrouping = groupBy === "dataCategories" && fidesMode;

  return (
    <div data-cy="list-view" className="flex h-full flex-col overflow-hidden">
      {isFidesGrouping && <FidesGroupBanner />}

      <div className="flex flex-col gap-6 overflow-y-auto p-6">
        {groups.map((group) => {
          const colorSet = isUngrouped
            ? null
            : getColorForValue(
                group.key,
                (isFidesGrouping ? "fidesGroup" : groupBy) as Parameters<
                  typeof getColorForValue
                >[1]
              );

          const secondaryText = isFidesGrouping
            ? (fidesGroupMap.get(group.key) ?? []).join(", ")
            : undefined;

          return (
            <section key={group.key} aria-label={group.label}>
              {colorSet && (
                <div className="mb-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${colorSet.dot}`}
                      aria-hidden="true"
                    />
                    <h2 className={`text-sm font-semibold ${colorSet.text}`}>
                      {group.label}
                    </h2>
                    <span className="rounded-full bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-400">
                      {group.systems.length}
                    </span>
                  </div>
                  {secondaryText && (
                    <p className="mt-1 pl-[18px] text-[10px] leading-tight text-gray-500">
                      {secondaryText}
                    </p>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-2">
                {group.systems.length > 0 ? (
                  group.systems.map((system) => (
                    <SystemRow key={system.fides_key} system={system} />
                  ))
                ) : (
                  <EmptyState
                    title="No systems"
                    description="No systems match the current filters"
                  />
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
