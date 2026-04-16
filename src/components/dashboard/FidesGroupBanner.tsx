import { ExternalLink } from "lucide-react";
import { FIDESLANG_DOCS_URL } from "@/helpers/constants";

export function FidesGroupBanner() {
  return (
    <div className="flex items-center gap-3 px-6 pt-4 pb-1">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
        Grouped by Fides Data Group
      </span>
      <a
        href={FIDESLANG_DOCS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-[10px] text-gray-500 transition-colors hover:text-gray-300"
      >
        Learn more about Fides Data Groups
        <ExternalLink size={10} aria-hidden="true" />
      </a>
    </div>
  );
}
