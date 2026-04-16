import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import type { AlertItem } from "@/types";

interface AlertProps {
  alert: AlertItem;
  onDismiss: (id: string) => void;
}

const iconMap = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const styleMap = {
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  error: "border-red-500/30 bg-red-500/10 text-red-400",
  info: "border-blue-500/30 bg-blue-500/10 text-blue-400",
};

export function Alert({ alert, onDismiss }: AlertProps) {
  const Icon = iconMap[alert.type];

  return (
    <div
      role="alert"
      className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg ${styleMap[alert.type]}`}
    >
      <Icon size={16} aria-hidden="true" />
      <span className="flex-1">{alert.message}</span>
      <button
        onClick={() => onDismiss(alert.id)}
        className="rounded-md p-0.5 hover:bg-white/10 transition-colors"
      >
        <X size={14} aria-hidden="true" />
        <span className="sr-only">Dismiss alert</span>
      </button>
    </div>
  );
}
