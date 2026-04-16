import { Map, Settings } from "lucide-react";
import { usePreferences } from "@/context/PreferencesContext";

export function Header() {
  const { openPreferences } = usePreferences();

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-gray-800 bg-gray-950 px-6">
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
          <Map size={14} aria-hidden="true" className="text-white" />
        </div>
        <h1 className="text-sm font-semibold tracking-tight text-gray-100">
          Data Maps
        </h1>
      </div>
      <span className="text-xs text-gray-600">|</span>
      <span className="text-xs text-gray-500">System Overview</span>

      <button
        onClick={openPreferences}
        className="ml-auto rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-800 hover:text-gray-300"
        aria-label="Open preferences"
      >
        <Settings size={18} aria-hidden="true" />
      </button>
    </header>
  );
}
