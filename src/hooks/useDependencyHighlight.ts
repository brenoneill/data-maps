import { useCallback, useMemo, useState } from "react";
import type { System } from "@/types";

export type CardState = "idle" | "active" | "related" | "dimmed";
export type HoverMode = "all" | "deps" | "dependents";
export type HoverInfo = { key: string; mode: HoverMode } | null;

export function useDependencyHighlight(systems: System[]) {
  const [hoverInfo, setHoverInfo] = useState<HoverInfo>(null);

  const relatedKeys = useMemo(() => {
    if (!hoverInfo) return null;

    const hovered = systems.find((s) => s.fides_key === hoverInfo.key);
    if (!hovered) return null;

    const keys = new Set<string>();
    keys.add(hoverInfo.key);

    if (hoverInfo.mode === "all" || hoverInfo.mode === "deps") {
      for (const depKey of hovered.system_dependencies) {
        keys.add(depKey);
      }
    }

    if (hoverInfo.mode === "all" || hoverInfo.mode === "dependents") {
      for (const system of systems) {
        if (system.system_dependencies.includes(hoverInfo.key)) {
          keys.add(system.fides_key);
        }
      }
    }

    return keys;
  }, [hoverInfo, systems]);

  const getCardState = useCallback(
    (fidesKey: string): CardState => {
      if (!hoverInfo) return "idle";
      if (fidesKey === hoverInfo.key) return "active";
      if (relatedKeys?.has(fidesKey)) return "related";
      return "dimmed";
    },
    [hoverInfo, relatedKeys]
  );

  return {
    hoverInfo,
    setHoverInfo,
    getCardState,
  };
}
