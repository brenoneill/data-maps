import { useCallback, useRef } from "react";
import type { GroupBySelection, GroupedSystems, System } from "@/types";
import { useDependencyHighlight } from "@/hooks/useDependencyHighlight";
import type { CardState, HoverInfo } from "@/hooks/useDependencyHighlight";
import { useCardRegistry } from "@/hooks/useCardRegistry";
import { Swimlane } from "./Swimlane";
import { DependencyLines } from "./DependencyLines";
import { FidesGroupBanner } from "./FidesGroupBanner";

interface SwimlaneBoardProps {
  groups: GroupedSystems[];
  groupBy: GroupBySelection;
  fidesMode: boolean;
  fidesGroupMap: Map<string, string[]>;
  allSystems: System[];
  showLines: boolean;
}

export function SwimlaneBoard({
  groups,
  groupBy,
  fidesMode,
  fidesGroupMap,
  allSystems,
  showLines,
}: SwimlaneBoardProps) {
  const boardRef = useRef<HTMLDivElement | null>(null);
  const { hoverInfo, setHoverInfo, getCardState } =
    useDependencyHighlight(allSystems);
  const { cardRefs, registerCard } = useCardRegistry();

  const gatedGetCardState = useCallback(
    (fidesKey: string): CardState => (showLines ? getCardState(fidesKey) : "idle"),
    [showLines, getCardState]
  );

  const gatedSetHoverInfo = useCallback(
    (info: HoverInfo) => { if (showLines) setHoverInfo(info); },
    [showLines, setHoverInfo]
  );

  const isFidesGrouping = groupBy === "dataCategories" && fidesMode;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {isFidesGrouping && <FidesGroupBanner />}
      <div
        data-cy="swimlane-board"
        ref={boardRef}
        className="relative flex min-h-0 flex-1 gap-4 overflow-x-hidden overflow-y-hidden p-6"
      >
        {showLines && (
          <DependencyLines
            systems={allSystems}
            hoverInfo={hoverInfo}
            cardRefs={cardRefs}
            boardRef={boardRef}
          />
        )}
        {groups.map((group) => (
          <Swimlane
            key={group.key}
            group={group}
            groupBy={groupBy}
            colorDimension={isFidesGrouping ? "fidesGroup" : undefined}
            secondaryText={
              isFidesGrouping
                ? (fidesGroupMap.get(group.key) ?? []).join(", ")
                : undefined
            }
            registerCard={registerCard}
            getCardState={gatedGetCardState}
            onHoverChange={gatedSetHoverInfo}
          />
        ))}
      </div>
    </div>
  );
}
