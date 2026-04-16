import { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getColorForValue } from "@/helpers/colors";
import { formatLabel } from "@/helpers/formatLabel";
import { getSystemDependents } from "@/helpers/systemLookup";
import { useSlideout } from "@/context/SlideoutContext";
import type { System } from "@/types";
import { ChevronRight, ArrowDown, ArrowUp } from "lucide-react";

interface SystemRowProps {
  system: System;
}

export function SystemRow({ system }: SystemRowProps) {
  const { openSlideout } = useSlideout();

  const depCount = system.system_dependencies.length;
  const dependentCount = useMemo(
    () => getSystemDependents(system.fides_key).length,
    [system.fides_key]
  );

  const allCategories = useMemo(
    () => [...new Set(system.privacy_declarations.flatMap((d) => d.data_categories))],
    [system.privacy_declarations]
  );

  return (
    <Card
      data-cy="system-row"
      interactive
      onClick={() => openSlideout(system)}
      className="group flex items-center gap-4 px-4 py-3"
    >
      <Badge
        colorSet={getColorForValue(system.system_type, "systemType")}
        className="shrink-0"
      >
        {system.system_type}
      </Badge>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <h3 className="truncate text-sm font-medium text-gray-100">
            {system.name}
          </h3>
          <span className="hidden shrink-0 text-xs text-gray-600 sm:inline">
            {system.fides_key}
          </span>
        </div>
        <p className="mt-0.5 truncate text-xs text-gray-500">
          {system.description}
        </p>
      </div>

      {/* Data category pills */}
      {allCategories.length > 0 && (
        <div className="ml-auto flex shrink-0 flex-wrap justify-end gap-1">
          {allCategories.map((cat) => (
            <Badge
              key={cat}
              colorSet={getColorForValue(cat, "dataCategories")}
              className="text-[10px]"
            >
              {formatLabel(cat)}
            </Badge>
          ))}
        </div>
      )}

      {/* Dependency / Dependent counts */}
      <div className="flex shrink-0 items-center gap-3">
        {depCount > 0 && (
          <span className="flex items-center gap-1 text-xs text-blue-400">
            <ArrowDown size={11} aria-hidden="true" />
            {depCount}
            <span className="sr-only">
              {depCount === 1 ? "dependency" : "dependencies"}
            </span>
          </span>
        )}
        {dependentCount > 0 && (
          <span className="flex items-center gap-1 text-xs text-violet-400">
            <ArrowUp size={11} aria-hidden="true" />
            {dependentCount}
            <span className="sr-only">
              {dependentCount === 1 ? "dependent" : "dependents"}
            </span>
          </span>
        )}
      </div>

      <ChevronRight
        size={14}
        aria-hidden="true"
        className="shrink-0 text-gray-600 transition-colors group-hover:text-gray-400"
      />
    </Card>
  );
}
