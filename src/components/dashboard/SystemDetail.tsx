import type { System } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { getColorForValue } from "@/helpers/colors";
import { formatLabel } from "@/helpers/formatLabel";
import { Database, Globe, Shield, Link2 } from "lucide-react";
import sampleData from "../../../sample_data.json";

interface SystemDetailProps {
  system: System;
}

function resolveSystemName(fidesKey: string): string {
  const match = (sampleData as System[]).find((s) => s.fides_key === fidesKey);
  return match?.name ?? fidesKey;
}

export function SystemDetail({ system }: SystemDetailProps) {
  return (
    <div className="space-y-6">
      {/* System info */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Badge
            colorSet={getColorForValue(system.system_type, "systemType")}
          >
            {system.system_type}
          </Badge>
          <span className="text-xs text-gray-500">{system.fides_key}</span>
        </div>
        <p className="text-sm leading-relaxed text-gray-400">
          {system.description}
        </p>
      </section>

      {/* Privacy Declarations */}
      {system.privacy_declarations.length > 0 && (
        <section>
          <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <Shield size={14} aria-hidden="true" />
            Privacy Declarations
          </h3>
          <div className="space-y-3">
            {system.privacy_declarations.map((decl, idx) => (
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

                {/* Categories */}
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

                {/* Subjects */}
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
      {system.system_dependencies.length > 0 && (
        <section>
          <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <Link2 size={14} aria-hidden="true" />
            Dependencies
          </h3>
          <div className="flex flex-wrap gap-2">
            {system.system_dependencies.map((dep) => (
              <span
                key={dep}
                className="inline-flex items-center rounded-lg border border-gray-800 bg-gray-900 px-3 py-1.5 text-xs text-gray-300"
              >
                {resolveSystemName(dep)}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
