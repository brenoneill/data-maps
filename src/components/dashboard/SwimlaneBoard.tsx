import type { GroupByOption, GroupedSystems } from "@/types";
import { Swimlane } from "./Swimlane";

interface SwimlaneBoardProps {
  groups: GroupedSystems[];
  groupBy: GroupByOption;
}

export function SwimlaneBoard({ groups, groupBy }: SwimlaneBoardProps) {
  return (
    <div className="flex h-full gap-4 overflow-x-auto p-6">
      {groups.map((group) => (
        <Swimlane key={group.key} group={group} groupBy={groupBy} />
      ))}
    </div>
  );
}
