import { useCallback } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getColorForValue } from "@/helpers/colors";
import { formatLabel } from "@/helpers/formatLabel";
import { getSystemDependents } from "@/helpers/systemLookup";
import type { System } from "@/types";
import type { CardState, HoverInfo } from "@/hooks/useDependencyHighlight";
import { useSlideout } from "@/context/SlideoutContext";
import { ChevronRight, ArrowDown, ArrowUp } from "lucide-react";

const cardStateStyles: Record<CardState, string> = {
  idle: "",
  active: "ring-1 ring-blue-500/40",
  "related-dep": "ring-1 ring-blue-400/30",
  "related-dependent": "ring-1 ring-violet-400/30",
  dimmed: "opacity-30",
};

interface SystemCardProps {
  system: System;
  registerCard: (fidesKey: string) => (el: HTMLElement | null) => void;
  cardState: CardState;
  onHoverChange: (info: HoverInfo) => void;
}

export function SystemCard({
  system,
  registerCard,
  cardState,
  onHoverChange,
}: SystemCardProps) {
  const { openSlideout } = useSlideout();

  const refCallback = useCallback(
    (el: HTMLElement | null) => {
      registerCard(system.fides_key)(el);
    },
    [registerCard, system.fides_key]
  );

  const allDataUses = [
    ...new Set(system.privacy_declarations.map((d) => d.data_use)),
  ];
  const allCategories = [
    ...new Set(system.privacy_declarations.flatMap((d) => d.data_categories)),
  ];

  const depCount = system.system_dependencies.length;
  const dependentCount = getSystemDependents(system.fides_key).length;
  const hasConnections = depCount > 0 || dependentCount > 0;

  return (
    <Card
      ref={refCallback}
      interactive
      onClick={() => openSlideout(system)}
      onMouseEnter={() =>
        onHoverChange({ key: system.fides_key, mode: "all" })
      }
      onMouseLeave={() => onHoverChange(null)}
      className={`group p-4 transition-opacity duration-200 ${cardStateStyles[cardState]}`}
    >
      {/* System type pill */}
      <div className="mb-3">
        <Badge colorSet={getColorForValue(system.system_type, "systemType")}>
          {system.system_type}
        </Badge>
      </div>

      {/* Header row */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-medium text-gray-100">
            {system.name}
          </h3>
          <p className="mt-0.5 truncate text-xs text-gray-500">
            {system.fides_key}
          </p>
        </div>
        <ChevronRight
          size={14}
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-gray-600 transition-colors group-hover:text-gray-400"
        />
      </div>

      {/* Description */}
      <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-gray-400">
        {system.description}
      </p>

      {/* Data Uses */}
      {allDataUses.length > 0 && (
        <div className="mb-3">
          <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-gray-500">
            Data Use
          </span>
          <div className="flex flex-wrap gap-1">
            {allDataUses.map((use) => (
              <Badge key={use} colorSet={getColorForValue(use, "dataUse")}>
                {formatLabel(use)}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Data Categories */}
      {allCategories.length > 0 && (
        <div className="mb-2">
          <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-gray-500">
            Data Categories
          </span>
          <div className="flex flex-wrap gap-1">
            {allCategories.map((cat) => (
              <Badge
                key={cat}
                colorSet={getColorForValue(cat, "dataCategories")}
              >
                {formatLabel(cat)}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Dependency / Dependent counts */}
      {hasConnections && (
        <div className="mt-3 flex items-center gap-3 border-t border-gray-800 pt-2">
          {depCount > 0 && (
            <span
              onMouseEnter={() =>
                onHoverChange({ key: system.fides_key, mode: "deps" })
              }
              onMouseLeave={() =>
                onHoverChange({ key: system.fides_key, mode: "all" })
              }
              className="flex items-center gap-1 rounded px-1 py-0.5 text-xs text-blue-400"
            >
              <ArrowDown size={11} aria-hidden="true" />
              {depCount}
            </span>
          )}
          {dependentCount > 0 && (
            <span
              onMouseEnter={() =>
                onHoverChange({ key: system.fides_key, mode: "dependents" })
              }
              onMouseLeave={() =>
                onHoverChange({ key: system.fides_key, mode: "all" })
              }
              className="flex items-center gap-1 rounded px-1 py-0.5 text-xs text-violet-400"
            >
              <ArrowUp size={11} aria-hidden="true" />
              {dependentCount}
            </span>
          )}
        </div>
      )}
    </Card>
  );
}
