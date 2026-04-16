import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getColorForValue } from "@/helpers/colors";
import { formatLabel } from "@/helpers/formatLabel";
import type { System } from "@/types";
import { useSlideout } from "@/context/SlideoutContext";
import { ChevronRight, Link2 } from "lucide-react";

interface SystemCardProps {
  system: System;
}

export function SystemCard({ system }: SystemCardProps) {
  const { openSlideout } = useSlideout();

  const allDataUses = [
    ...new Set(system.privacy_declarations.map((d) => d.data_use)),
  ];
  const allCategories = [
    ...new Set(system.privacy_declarations.flatMap((d) => d.data_categories)),
  ];

  return (
    <Card
      interactive
      onClick={() => openSlideout(system)}
      className="group p-4"
    >
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
        <div className="mb-2 flex flex-wrap gap-1">
          {allDataUses.map((use) => (
            <Badge key={use} colorSet={getColorForValue(use, "dataUse")}>
              {formatLabel(use)}
            </Badge>
          ))}
        </div>
      )}

      {/* Data Categories */}
      {allCategories.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {allCategories.map((cat) => (
            <Badge
              key={cat}
              colorSet={getColorForValue(cat, "dataCategories")}
            >
              {formatLabel(cat)}
            </Badge>
          ))}
        </div>
      )}

      {/* Dependencies count */}
      {system.system_dependencies.length > 0 && (
        <div className="mt-3 flex items-center gap-1 border-t border-gray-800 pt-2 text-xs text-gray-500">
          <Link2 size={12} aria-hidden="true" />
          <span>
            {system.system_dependencies.length} dependenc
            {system.system_dependencies.length === 1 ? "y" : "ies"}
          </span>
        </div>
      )}
    </Card>
  );
}
