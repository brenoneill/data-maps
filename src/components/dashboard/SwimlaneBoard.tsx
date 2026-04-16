import { useCallback, useRef } from "react";
import type { GroupByOption, GroupedSystems, System } from "@/types";
import { useDependencyHighlight } from "@/hooks/useDependencyHighlight";
import type { CardState, HoverInfo } from "@/hooks/useDependencyHighlight";
import { useCardRegistry } from "@/hooks/useCardRegistry";
import { Swimlane } from "./Swimlane";
import { DependencyLines } from "./DependencyLines";
import { ExternalLink } from "lucide-react";
import { FIDESLANG_DOCS_URL } from "@/helpers/constants";

interface SwimlaneBoardProps {
  groups: GroupedSystems[];
  groupBy: GroupByOption;
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
    <div className="flex h-full flex-col overflow-hidden">
      {isFidesGrouping && (
        <div className="flex items-center gap-3 px-6 pt-4 pb-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
            Grouped by Fides Data Group
          </span>
          <a
            href={FIDESLANG_DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] text-gray-500 transition-colors hover:text-gray-300"
          >
            Learn more about Fides Data Groups
            <ExternalLink size={10} aria-hidden="true" />
          </a>
        </div>
      )}
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
