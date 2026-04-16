import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import {
  X,
  Link2,
  Link2Off,
  Layers,
  List,
  ExternalLink,
  Columns3,
  LayoutList,
  MessageSquareText,
  SlidersHorizontal,
} from "lucide-react";
import { Fragment } from "react";
import type { ViewMode, FilterMode } from "@/types";
import { FIDESLANG_DOCS_URL } from "@/helpers/constants";

interface PreferencesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  showLines: boolean;
  fidesMode: boolean;
  viewMode: ViewMode;
  filterMode: FilterMode;
  onShowLinesChange: (value: boolean) => void;
  onFidesModeChange: (on: boolean) => void;
  onViewModeChange: (value: ViewMode) => void;
  onFilterModeChange: (value: FilterMode) => void;
}

function ToggleRow({
  label,
  description,
  enabled,
  onToggle,
  activeIcon,
  inactiveIcon,
  activeColor = "blue",
  children,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  activeIcon: React.ReactNode;
  inactiveIcon: React.ReactNode;
  activeColor?: "blue" | "emerald";
  children?: React.ReactNode;
}) {
  const colorMap = {
    blue: {
      track: "bg-blue-600",
      icon: "text-blue-400",
    },
    emerald: {
      track: "bg-emerald-600",
      icon: "text-emerald-400",
    },
  };
  const colors = colorMap[activeColor];

  return (
    <div className="rounded-lg px-3 py-3 transition-colors hover:bg-gray-800/50">
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-3 text-left"
      >
        <span className={`shrink-0 ${enabled ? colors.icon : "text-gray-500"}`}>
          {enabled ? activeIcon : inactiveIcon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-200">{label}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
        <div
          role="switch"
          aria-checked={enabled}
          aria-label={label}
          className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${enabled ? colors.track : "bg-gray-700"}`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${enabled ? "translate-x-4" : "translate-x-0"}`}
          />
        </div>
      </button>
      {children}
    </div>
  );
}

function SegmentedControl<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string; icon: React.ReactNode }[];
}) {
  return (
    <div className="px-3 py-3">
      <p className="mb-2 text-xs font-medium text-gray-500">{label}</p>
      <div
        className="flex overflow-hidden rounded-lg border border-gray-700"
        role="radiogroup"
        aria-label={label}
      >
        {options.map((opt, i) => (
          <button
            key={opt.value}
            role="radio"
            aria-checked={value === opt.value}
            aria-label={opt.label}
            onClick={() => onChange(opt.value)}
            className={`flex flex-1 items-center justify-center gap-2 px-3 py-2 text-xs font-medium transition-colors ${
              i > 0 ? "border-l border-gray-700" : ""
            } ${
              value === opt.value
                ? "bg-gray-700 text-gray-100"
                : "bg-gray-800/50 text-gray-500 hover:text-gray-400"
            }`}
          >
            {opt.icon}
            <span>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function PreferencesPanel({
  isOpen,
  onClose,
  showLines,
  fidesMode,
  viewMode,
  filterMode,
  onShowLinesChange,
  onFidesModeChange,
  onViewModeChange,
  onFilterModeChange,
}: PreferencesPanelProps) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
        </TransitionChild>

        <div className="fixed inset-0 flex justify-end">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="ease-in duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <DialogPanel className="flex w-full max-w-sm flex-col border-l border-gray-800 bg-gray-925 shadow-2xl">
              <div className="flex shrink-0 items-center justify-between px-6 pt-6 pb-4">
                <DialogTitle className="text-lg font-semibold text-gray-100">
                  Preferences
                </DialogTitle>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-800 hover:text-gray-300"
                >
                  <X size={18} aria-hidden="true" />
                  <span className="sr-only">Close preferences</span>
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-6">
                {/* Display section */}
                <div className="mb-2 px-3 pt-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Display
                  </h3>
                </div>

                <ToggleRow
                  label="Show Dependencies"
                  description="Draw dependency lines between systems on the board"
                  enabled={showLines}
                  onToggle={() => onShowLinesChange(!showLines)}
                  activeIcon={<Link2 size={16} aria-hidden="true" />}
                  inactiveIcon={<Link2Off size={16} aria-hidden="true" />}
                />

                <ToggleRow
                  label="Fides Data Group"
                  description="Rolls up individual data categories into their parent Fides taxonomy group, simplifying filters and swimlane headers."
                  enabled={fidesMode}
                  onToggle={() => onFidesModeChange(!fidesMode)}
                  activeIcon={<Layers size={16} aria-hidden="true" />}
                  inactiveIcon={<List size={16} aria-hidden="true" />}
                  activeColor="emerald"
                >
                  <a
                    href={FIDESLANG_DOCS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 ml-7 flex items-center gap-1 text-xs text-gray-500 transition-colors hover:text-gray-300"
                  >
                    Learn more about Fides data groups
                    <ExternalLink size={11} aria-hidden="true" />
                  </a>
                </ToggleRow>

                <div className="my-3 border-t border-gray-800" />

                {/* Layout section */}
                <div className="mb-2 px-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Layout
                  </h3>
                </div>

                <SegmentedControl
                  label="View Mode"
                  value={viewMode}
                  onChange={onViewModeChange}
                  options={[
                    {
                      value: "board" as ViewMode,
                      label: "Board",
                      icon: <Columns3 size={13} aria-hidden="true" />,
                    },
                    {
                      value: "list" as ViewMode,
                      label: "List",
                      icon: <LayoutList size={13} aria-hidden="true" />,
                    },
                  ]}
                />

                <SegmentedControl
                  label="Filter Mode"
                  value={filterMode}
                  onChange={onFilterModeChange}
                  options={[
                    {
                      value: "checkbox" as FilterMode,
                      label: "Filters",
                      icon: <SlidersHorizontal size={13} aria-hidden="true" />,
                    },
                    {
                      value: "sentence" as FilterMode,
                      label: "Query",
                      icon: <MessageSquareText size={13} aria-hidden="true" />,
                    },
                  ]}
                />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
