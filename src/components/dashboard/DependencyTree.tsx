import type { System } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { getColorForValue } from "@/helpers/colors";
import {
  resolveSystem,
  getSystemDependencies,
  getSystemDependents,
} from "@/helpers/systemLookup";
import { ArrowDown, ArrowUp } from "lucide-react";

interface DependencyTreeProps {
  fidesKey: string;
}

const NODE_W = 112;
const NODE_H = 56;
const CENTER_W = 128;
const CENTER_H = 64;

export function RadialNodeCard({
  system,
  isCenter,
}: {
  system: System;
  isCenter: boolean;
}) {
  const colorSet = getColorForValue(system.system_type, "systemType");
  const w = isCenter ? CENTER_W : NODE_W;

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-lg border px-2 py-1.5 text-center ${
        isCenter
          ? "border-blue-500/50 bg-gray-900 shadow-lg shadow-blue-500/10"
          : `${colorSet.border} bg-gray-900`
      }`}
      style={{ width: w, minHeight: isCenter ? CENTER_H : NODE_H }}
    >
      <Badge colorSet={colorSet} className="mb-1">
        {system.system_type}
      </Badge>
      <p
        className={`font-medium leading-tight text-gray-200 ${
          isCenter ? "text-[11px]" : "text-[10px]"
        }`}
      >
        {system.name}
      </p>
    </div>
  );
}

function computeLayout(count: number) {
  const radius = count <= 3 ? 140 : count <= 5 ? 160 : 180;
  const padding = 40;
  const size = (radius + NODE_W / 2 + padding) * 2;
  const cx = size / 2;
  const cy = size / 2;

  return { radius, size, cx, cy };
}

function getNodePosition(
  index: number,
  total: number,
  cx: number,
  cy: number,
  radius: number
) {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
}

export function RadialGraph({
  rootSystem,
  systems,
}: {
  rootSystem: System;
  systems: System[];
}) {
  const { radius, size, cx, cy } = computeLayout(systems.length);

  return (
    <div className="flex items-center justify-center overflow-auto py-2">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="max-h-[420px] max-w-full"
        aria-hidden="true"
      >
        {systems.map((sys, i) => {
          const pos = getNodePosition(i, systems.length, cx, cy, radius);
          return (
            <line
              key={`line-${sys.fides_key}`}
              x1={cx}
              y1={cy}
              x2={pos.x}
              y2={pos.y}
              stroke="currentColor"
              strokeWidth={1}
              strokeDasharray="4 3"
              className="text-gray-700"
            />
          );
        })}

        {systems.map((sys, i) => {
          const pos = getNodePosition(i, systems.length, cx, cy, radius);
          return (
            <foreignObject
              key={`node-${sys.fides_key}`}
              x={pos.x - NODE_W / 2}
              y={pos.y - NODE_H / 2}
              width={NODE_W}
              height={NODE_H}
              overflow="visible"
            >
              <RadialNodeCard system={sys} isCenter={false} />
            </foreignObject>
          );
        })}

        <foreignObject
          x={cx - CENTER_W / 2}
          y={cy - CENTER_H / 2}
          width={CENTER_W}
          height={CENTER_H}
          overflow="visible"
        >
          <RadialNodeCard system={rootSystem} isCenter />
        </foreignObject>
      </svg>
    </div>
  );
}

export function DependencyTree({ fidesKey }: DependencyTreeProps) {
  const rootSystem = resolveSystem(fidesKey);

  if (!rootSystem) {
    return <p className="pt-4 text-xs text-gray-500">System not found</p>;
  }

  const deps = getSystemDependencies(fidesKey);
  const dependents = getSystemDependents(fidesKey);

  return (
    <div className="space-y-6">
      {/* Outgoing: systems this one depends on */}
      <section>
        <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          <ArrowDown size={14} aria-hidden="true" />
          Dependencies
        </h4>
        {deps.length > 0 ? (
          <RadialGraph rootSystem={rootSystem} systems={deps} />
        ) : (
          <p className="py-4 text-center text-xs text-gray-600">None</p>
        )}
      </section>

      {/* Incoming: systems that depend on this one */}
      <section>
        <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          <ArrowUp size={14} aria-hidden="true" />
          Dependents
        </h4>
        {dependents.length > 0 ? (
          <RadialGraph rootSystem={rootSystem} systems={dependents} />
        ) : (
          <p className="py-4 text-center text-xs text-gray-600">None</p>
        )}
      </section>
    </div>
  );
}
