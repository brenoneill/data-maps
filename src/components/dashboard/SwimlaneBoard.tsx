import { useRef } from "react";
import type { GroupByOption, GroupedSystems, System } from "@/types";
import { useDependencyHighlight } from "@/hooks/useDependencyHighlight";
import { useCardRegistry } from "@/hooks/useCardRegistry";
import { Swimlane } from "./Swimlane";
import { DependencyLines } from "./DependencyLines";

interface SwimlaneBoardProps {
  groups: GroupedSystems[];
  groupBy: GroupByOption;
  allSystems: System[];
  showLines: boolean;
  onOpenDeps: (system: System) => void;
}

export function SwimlaneBoard({
  groups,
  groupBy,
  allSystems,
  showLines,
  onOpenDeps,
}: SwimlaneBoardProps) {
  const boardRef = useRef<HTMLDivElement | null>(null);
  const { hoverInfo, setHoverInfo, getCardState } =
    useDependencyHighlight(allSystems);
  const { cardRefs, registerCard } = useCardRegistry();

  return (
    <div ref={boardRef} className="relative flex h-full gap-4 overflow-x-auto p-6">
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
          registerCard={registerCard}
          getCardState={getCardState}
          onHoverChange={setHoverInfo}
          onOpenDeps={onOpenDeps}
        />
      ))}
    </div>
  );
}
