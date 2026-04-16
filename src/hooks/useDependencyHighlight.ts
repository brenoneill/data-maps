import { useCallback, useMemo, useState } from "react";
import type { System } from "@/types";

export type CardState =
  | "idle"
  | "active"
  | "related-dep"
  | "related-dependent"
  | "dimmed";
export type HoverMode = "all" | "deps" | "dependents";
export type HoverInfo = { key: string; mode: HoverMode } | null;

export function useDependencyHighlight(systems: System[]) {
  const [hoverInfo, setHoverInfo] = useState<HoverInfo>(null);

  const { depKeys, dependentKeys } = useMemo(() => {
    if (!hoverInfo) return { depKeys: null, dependentKeys: null };

    const hovered = systems.find((s) => s.fides_key === hoverInfo.key);
    if (!hovered) return { depKeys: null, dependentKeys: null };

    const deps = new Set<string>();
    const dependents = new Set<string>();

    if (hoverInfo.mode === "all" || hoverInfo.mode === "deps") {
      for (const depKey of hovered.system_dependencies) {
        deps.add(depKey);
      }
    }

    if (hoverInfo.mode === "all" || hoverInfo.mode === "dependents") {
      for (const system of systems) {
        if (system.system_dependencies.includes(hoverInfo.key)) {
          dependents.add(system.fides_key);
        }
      }
    }

    return { depKeys: deps, dependentKeys: dependents };
  }, [hoverInfo, systems]);

  const getCardState = useCallback(
    (fidesKey: string): CardState => {
      if (!hoverInfo) return "idle";
      if (fidesKey === hoverInfo.key) return "active";
      if (depKeys?.has(fidesKey)) return "related-dep";
      if (dependentKeys?.has(fidesKey)) return "related-dependent";
      return "dimmed";
    },
    [hoverInfo, depKeys, dependentKeys]
  );

  return {
    hoverInfo,
    setHoverInfo,
    getCardState,
  };
}
