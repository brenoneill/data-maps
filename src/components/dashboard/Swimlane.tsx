import type { GroupBySelection, GroupedSystems } from "@/types";
import type { CardState, HoverInfo } from "@/hooks/useDependencyHighlight";
import { getColorForValue } from "@/helpers/colors";
import { SystemCard } from "./SystemCard";
import { EmptyState } from "@/components/ui/EmptyState";

interface SwimlaneProps {
  group: GroupedSystems;
  groupBy: GroupBySelection;
  colorDimension?: string;
  secondaryText?: string;
  registerCard: (fidesKey: string) => (el: HTMLElement | null) => void;
  getCardState: (fidesKey: string) => CardState;
  onHoverChange: (info: HoverInfo) => void;
}

export function Swimlane({
  group,
  groupBy,
  colorDimension,
  secondaryText,
  registerCard,
  getCardState,
  onHoverChange,
}: SwimlaneProps) {
  const isUngrouped = groupBy === "none";
  const colorSet = isUngrouped
    ? null
    : getColorForValue(
        group.key,
        (colorDimension ?? groupBy) as Parameters<typeof getColorForValue>[1]
      );

  return (
    <div data-cy="swimlane" className={`flex shrink-0 flex-col ${isUngrouped ? "w-full" : "w-80"}`}>
      {colorSet && (
        <div className="mb-3 px-1">
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

      <div
        data-swimlane-column
        className={`flex-1 overflow-y-auto rounded-xl border border-gray-800/50 bg-gray-925 p-3 ${
          isUngrouped
            ? "grid auto-rows-[1fr] grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-3"
            : "flex flex-col gap-3"
        }`}
      >
        {group.systems.length > 0 ? (
          group.systems.map((system) => (
            <SystemCard
              key={system.fides_key}
              system={system}
              registerCard={registerCard}
              cardState={getCardState(system.fides_key)}
              onHoverChange={onHoverChange}
            />
          ))
        ) : (
          <EmptyState
            title="No systems"
            description="No systems match the current filters"
          />
        )}
      </div>
    </div>
  );
}
