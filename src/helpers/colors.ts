export interface ColorSet {
  bg: string;
  border: string;
  text: string;
  dot: string;
}

const SYSTEM_TYPE_COLORS: Record<string, ColorSet> = {
  Application: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-400",
    dot: "bg-blue-400",
  },
  Service: {
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
    text: "text-violet-400",
    dot: "bg-violet-400",
  },
  Database: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    dot: "bg-amber-400",
  },
  Integration: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
  },
};

const DATA_USE_COLORS: Record<string, ColorSet> = {
  "advertising.third_party": {
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    text: "text-rose-400",
    dot: "bg-rose-400",
  },
  "advertising.first_party": {
    bg: "bg-pink-500/10",
    border: "border-pink-500/30",
    text: "text-pink-400",
    dot: "bg-pink-400",
  },
  "improve.system": {
    bg: "bg-sky-500/10",
    border: "border-sky-500/30",
    text: "text-sky-400",
    dot: "bg-sky-400",
  },
  "provide.system": {
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/30",
    text: "text-indigo-400",
    dot: "bg-indigo-400",
  },
  "provide.system.operations.support": {
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    text: "text-purple-400",
    dot: "bg-purple-400",
  },
};

const DATA_CATEGORY_COLORS: Record<string, ColorSet> = {
  "user.derived.identifiable.device.cookie_id": {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    text: "text-cyan-400",
    dot: "bg-cyan-400",
  },
  "user.derived.identifiable.device.ip_address": {
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    text: "text-orange-400",
    dot: "bg-orange-400",
  },
  "user.derived.identifiable.location": {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    text: "text-yellow-400",
    dot: "bg-yellow-400",
  },
  "user.provided.identifiable.contact.email": {
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    text: "text-green-400",
    dot: "bg-green-400",
  },
  "user.provided.identifiable.financial": {
    bg: "bg-pink-500/10",
    border: "border-pink-500/30",
    text: "text-pink-400",
    dot: "bg-pink-400",
  },
};

const FIDES_GROUP_COLORS: Record<string, ColorSet> = {
  Device: {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    text: "text-cyan-400",
    dot: "bg-cyan-400",
  },
  Contact: {
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    text: "text-green-400",
    dot: "bg-green-400",
  },
  Location: {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    text: "text-yellow-400",
    dot: "bg-yellow-400",
  },
  Financial: {
    bg: "bg-pink-500/10",
    border: "border-pink-500/30",
    text: "text-pink-400",
    dot: "bg-pink-400",
  },
};

const IDENTIFIABILITY_COLORS: Record<string, ColorSet> = {
  identifiable: {
    bg: "bg-teal-500/10",
    border: "border-teal-500/30",
    text: "text-teal-400",
    dot: "bg-teal-400",
  },
  nonidentifiable: {
    bg: "bg-slate-500/10",
    border: "border-slate-500/30",
    text: "text-slate-400",
    dot: "bg-slate-400",
  },
};

const DEFAULT_COLOR: ColorSet = {
  bg: "bg-gray-500/10",
  border: "border-gray-500/30",
  text: "text-gray-400",
  dot: "bg-gray-400",
};

type ColorDimension =
  | "systemType"
  | "dataUse"
  | "dataCategories"
  | "fidesGroup"
  | "identifiability";

export function getColorForValue(
  value: string,
  dimension: ColorDimension
): ColorSet {
  switch (dimension) {
    case "systemType":
      return SYSTEM_TYPE_COLORS[value] ?? DEFAULT_COLOR;
    case "dataUse":
      return DATA_USE_COLORS[value] ?? DEFAULT_COLOR;
    case "dataCategories":
      return DATA_CATEGORY_COLORS[value] ?? DEFAULT_COLOR;
    case "fidesGroup":
      return FIDES_GROUP_COLORS[value] ?? DEFAULT_COLOR;
    case "identifiability":
      return IDENTIFIABILITY_COLORS[value] ?? DEFAULT_COLOR;
    default:
      return DEFAULT_COLOR;
  }
}
