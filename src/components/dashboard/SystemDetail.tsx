import type { System } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { getColorForValue } from "@/helpers/colors";
import { formatLabel } from "@/helpers/formatLabel";
import {
  resolveSystem,
  getSystemDependencies,
  getSystemDependents,
} from "@/helpers/systemLookup";
import { Database, Globe, Shield, ArrowDown, ArrowUp, GitFork } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SystemDetailProps {
  system: System;
  onSeeGraph?: (system: System) => void;
}

export function SystemDetail({ system, onSeeGraph }: SystemDetailProps) {
  const resolved = resolveSystem(system.fides_key) ?? system;
  const hasDeps =
    getSystemDependencies(resolved.fides_key).length > 0 ||
    getSystemDependents(resolved.fides_key).length > 0;

  return (
    <div className="space-y-6 py-2">
      {/* System info */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Badge
            colorSet={getColorForValue(resolved.system_type, "systemType")}
          >
            {resolved.system_type}
          </Badge>
          <span className="text-xs text-gray-500">{resolved.fides_key}</span>
        </div>
        <p className="text-sm leading-relaxed text-gray-400">
          {resolved.description}
        </p>
      </section>

      {/* Privacy Declarations */}
      {resolved.privacy_declarations.length > 0 && (
        <section>
          <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <Shield size={14} aria-hidden="true" />
            Privacy Declarations
          </h3>
          <div className="space-y-3">
            {resolved.privacy_declarations.map((decl, idx) => (
              <div
                key={`${decl.data_use}-${idx}`}
                className="rounded-lg border border-gray-800 bg-gray-900 p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-200">
                    {decl.name}
                  </span>
                  <Badge
                    colorSet={getColorForValue(decl.data_use, "dataUse")}
                  >
                    {formatLabel(decl.data_use)}
                  </Badge>
                </div>

                <div className="mb-2">
                  <span className="mb-1 flex items-center gap-1.5 text-xs text-gray-500">
                    <Database size={11} aria-hidden="true" />
                    Categories
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {decl.data_categories.map((cat) => (
                      <Badge
                        key={cat}
                        colorSet={getColorForValue(cat, "dataCategories")}
                      >
                        {formatLabel(cat)}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="mb-1 flex items-center gap-1.5 text-xs text-gray-500">
                    <Globe size={11} aria-hidden="true" />
                    Subjects
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {decl.data_subjects.map((sub) => (
                      <span
                        key={sub}
                        className="rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-400"
                      >
                        {formatLabel(sub)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      {/* Dependencies */}
      {getSystemDependencies(resolved.fides_key).length > 0 && (
        <section>
          <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400/70">
            <ArrowDown size={14} aria-hidden="true" />
            Dependencies
          </h3>
          <div className="space-y-2">
            {getSystemDependencies(resolved.fides_key).map((dep) => (
              <div
                key={dep.fides_key}
                className="flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900 px-3 py-2"
              >
                <span className="text-sm font-medium text-gray-200">
                  {dep.name}
                </span>
                <Badge
                  colorSet={getColorForValue(dep.system_type, "systemType")}
                >
                  {dep.system_type}
                </Badge>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Dependents */}
      {getSystemDependents(resolved.fides_key).length > 0 && (
        <section>
          <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-400/70">
            <ArrowUp size={14} aria-hidden="true" />
            Dependents
          </h3>
          <div className="space-y-2">
            {getSystemDependents(resolved.fides_key).map((dep) => (
              <div
                key={dep.fides_key}
                className="flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900 px-3 py-2"
              >
                <span className="text-sm font-medium text-gray-200">
                  {dep.name}
                </span>
                <Badge
                  colorSet={getColorForValue(dep.system_type, "systemType")}
                >
                  {dep.system_type}
                </Badge>
              </div>
            ))}
          </div>
        </section>
      )}

      {hasDeps && onSeeGraph && (
        <Button
          variant="secondary"
          onClick={() => onSeeGraph(resolved)}
        >
          <GitFork size={14} aria-hidden="true" />
          <span>See Dependency Graph</span>
        </Button>
      )}
    </div>
  );
}
