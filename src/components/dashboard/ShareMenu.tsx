import { useState, useRef, useEffect, useCallback } from "react";
import { Share2, Link, FileText, Check } from "lucide-react";
import { useAlerts } from "@/context/AlertContext";
import { buildShareMessage } from "@/helpers/buildShareMessage";
import type { DimensionFilters } from "@/types";

interface ShareMenuProps {
  dimensionFilters: DimensionFilters;
  systemNames: string[];
}

type CopiedAction = "link" | "summary" | null;

export function ShareMenu({ dimensionFilters, systemNames }: ShareMenuProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<CopiedAction>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { addAlert } = useAlerts();

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(null), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  const copyToClipboard = useCallback(
    async (text: string, action: CopiedAction, label: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(action);
        addAlert("success", `${label} copied to clipboard`);
      } catch {
        addAlert("error", "Failed to copy to clipboard");
      }
      setOpen(false);
    },
    [addAlert]
  );

  const handleCopyLink = () =>
    copyToClipboard(window.location.href, "link", "Link");

  const handleCopySummary = () => {
    const message = buildShareMessage(dimensionFilters, systemNames);
    copyToClipboard(message, "summary", "Summary");
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        aria-label="Share"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 rounded-full border border-gray-700 bg-gray-800/50 px-3 py-1.5 text-xs font-medium text-gray-400 transition-colors hover:bg-gray-700 hover:text-gray-200"
      >
        <Share2 size={13} aria-hidden="true" />
        <span>Share</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-lg border border-gray-700 bg-gray-900 shadow-xl"
        >
          <MenuItem
            icon={copied === "link" ? Check : Link}
            label="Copy link"
            onClick={handleCopyLink}
          />
          <MenuItem
            icon={copied === "summary" ? Check : FileText}
            label="Copy summary"
            onClick={handleCopySummary}
          />
        </div>
      )}
    </div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Link;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-300 transition-colors hover:bg-gray-800 hover:text-gray-100"
    >
      <Icon size={14} aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}
