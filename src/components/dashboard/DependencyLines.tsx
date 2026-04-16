import { useCallback, useEffect, useRef, useState } from "react";
import type { System } from "@/types";
import type { HoverInfo } from "@/hooks/useDependencyHighlight";

interface Edge {
  sourceKey: string;
  targetKey: string;
}

interface LinePosition {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  sourceKey: string;
  targetKey: string;
}

interface DependencyLinesProps {
  systems: System[];
  hoverInfo: HoverInfo;
  cardRefs: React.RefObject<Map<string, Set<HTMLElement>>>;
  boardRef: React.RefObject<HTMLElement | null>;
}

function buildEdges(systems: System[]): Edge[] {
  const validKeys = new Set(systems.map((s) => s.fides_key));
  const edges: Edge[] = [];

  for (const system of systems) {
    for (const dep of system.system_dependencies) {
      if (validKeys.has(dep)) {
        edges.push({ sourceKey: system.fides_key, targetKey: dep });
      }
    }
  }

  return edges;
}

function computeLinePositions(
  edges: Edge[],
  cardRefs: Map<string, Set<HTMLElement>>,
  boardEl: HTMLElement
): LinePosition[] {
  const boardRect = boardEl.getBoundingClientRect();
  const lines: LinePosition[] = [];

  for (const edge of edges) {
    const sourceEls = cardRefs.get(edge.sourceKey);
    const targetEls = cardRefs.get(edge.targetKey);
    if (!sourceEls || !targetEls) continue;

    for (const sourceEl of sourceEls) {
      if (!sourceEl.isConnected) continue;
      const sourceRect = sourceEl.getBoundingClientRect();

      for (const targetEl of targetEls) {
        if (!targetEl.isConnected) continue;
        const targetRect = targetEl.getBoundingClientRect();

        const sourceOnLeft = sourceRect.right < targetRect.left;

        let x1: number, y1: number, x2: number, y2: number;

        if (sourceOnLeft) {
          x1 = sourceRect.right - boardRect.left + boardEl.scrollLeft;
          y1 =
            sourceRect.top +
            sourceRect.height / 2 -
            boardRect.top +
            boardEl.scrollTop;
          x2 = targetRect.left - boardRect.left + boardEl.scrollLeft;
          y2 =
            targetRect.top +
            targetRect.height / 2 -
            boardRect.top +
            boardEl.scrollTop;
        } else {
          x1 = sourceRect.left - boardRect.left + boardEl.scrollLeft;
          y1 =
            sourceRect.top +
            sourceRect.height / 2 -
            boardRect.top +
            boardEl.scrollTop;
          x2 = targetRect.right - boardRect.left + boardEl.scrollLeft;
          y2 =
            targetRect.top +
            targetRect.height / 2 -
            boardRect.top +
            boardEl.scrollTop;
        }

        lines.push({
          id: `${edge.sourceKey}-${edge.targetKey}-${lines.length}`,
          x1,
          y1,
          x2,
          y2,
          sourceKey: edge.sourceKey,
          targetKey: edge.targetKey,
        });
      }
    }
  }

  return lines;
}

export function DependencyLines({
  systems,
  hoverInfo,
  cardRefs,
  boardRef,
}: DependencyLinesProps) {
  const [lines, setLines] = useState<LinePosition[]>([]);
  const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });
  const edgesRef = useRef<Edge[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    edgesRef.current = buildEdges(systems);
  }, [systems]);

  const recalculate = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const boardEl = boardRef.current;
      if (!boardEl || !cardRefs.current) return;

      setSvgSize({
        width: boardEl.scrollWidth,
        height: boardEl.scrollHeight,
      });

      const positions = computeLinePositions(
        edgesRef.current,
        cardRefs.current,
        boardEl
      );
      setLines(positions);
    });
  }, [boardRef, cardRefs]);

  // Recalculate on hover changes
  useEffect(() => {
    recalculate();
  }, [hoverInfo, recalculate]);

  // Recalculate on scroll and resize
  useEffect(() => {
    const boardEl = boardRef.current;
    if (!boardEl) return;

    const laneColumns = boardEl.querySelectorAll("[data-swimlane-column]");

    boardEl.addEventListener("scroll", recalculate, { passive: true });
    laneColumns.forEach((col) =>
      col.addEventListener("scroll", recalculate, { passive: true })
    );

    const resizeObserver = new ResizeObserver(recalculate);
    resizeObserver.observe(boardEl);

    // Initial calculation after a frame to let layout settle
    requestAnimationFrame(recalculate);

    return () => {
      boardEl.removeEventListener("scroll", recalculate);
      laneColumns.forEach((col) =>
        col.removeEventListener("scroll", recalculate)
      );
      resizeObserver.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [boardRef, recalculate, systems]);

  if (lines.length === 0) return null;

  return (
    <svg
      className="pointer-events-none absolute left-0 top-0"
      width={svgSize.width}
      height={svgSize.height}
      aria-hidden="true"
    >
      {lines.map((line) => {
        let lineType: "none" | "dep" | "dependent" = "none";
        if (hoverInfo) {
          const { key, mode } = hoverInfo;
          if (mode === "all") {
            if (line.sourceKey === key) lineType = "dep";
            else if (line.targetKey === key) lineType = "dependent";
          } else if (mode === "deps" && line.sourceKey === key) {
            lineType = "dep";
          } else if (mode === "dependents" && line.targetKey === key) {
            lineType = "dependent";
          }
        }

        const isHovering = hoverInfo !== null;
        const isRelated = lineType !== "none";

        const dx = (line.x2 - line.x1) * 0.4;
        const path = `M ${line.x1} ${line.y1} C ${line.x1 + dx} ${line.y1}, ${line.x2 - dx} ${line.y2}, ${line.x2} ${line.y2}`;

        let opacity: number;
        let strokeDasharray: string | undefined;

        if (!isHovering) {
          opacity = 0.12;
          strokeDasharray = "6 4";
        } else if (isRelated) {
          opacity = 0.6;
          strokeDasharray = undefined;
        } else {
          opacity = 0;
          strokeDasharray = "6 4";
        }

        const strokeColor =
          lineType === "dep"
            ? "#60a5fa"
            : lineType === "dependent"
              ? "#a78bfa"
              : undefined;

        return (
          <path
            key={line.id}
            d={path}
            fill="none"
            stroke={strokeColor ?? "currentColor"}
            strokeWidth={1.5}
            strokeDasharray={strokeDasharray}
            className={`${strokeColor ? "" : "text-gray-400"} transition-opacity duration-200`}
            style={{ opacity }}
          />
        );
      })}
    </svg>
  );
}
