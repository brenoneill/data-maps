const DATA_CATEGORY_LABELS: Record<string, string> = {
  "user.derived.identifiable.device.cookie_id": "Cookie ID",
  "user.derived.identifiable.device.ip_address": "IP Address",
  "user.derived.identifiable.location": "Location",
  "user.provided.identifiable.contact.email": "Email",
  "user.provided.identifiable.financial": "Financial",
};

const DATA_USE_LABELS: Record<string, string> = {
  "advertising.third_party": "Third Party Advertising",
  "advertising.first_party": "First Party Advertising",
  "improve.system": "System Improvement",
  "provide.system": "System Operations",
  "provide.system.operations.support": "Operations Support",
};

function titleCase(str: string): string {
  return str
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Converts a dot-notation taxonomy value into a human-readable label.
 *
 * @param value - Raw taxonomy string (e.g. "user.provided.identifiable.contact.email")
 * @returns Readable label (e.g. "Email")
 */
export function formatLabel(value: string): string {
  if (DATA_CATEGORY_LABELS[value]) return DATA_CATEGORY_LABELS[value];
  if (DATA_USE_LABELS[value]) return DATA_USE_LABELS[value];

  const segments = value.split(".");
  const lastSegment = segments[segments.length - 1];
  return titleCase(lastSegment);
}

/**
 * Converts a GroupByOption or FilterDimension key to a display name.
 */
export function formatDimensionLabel(
  dimension: string
): string {
  const map: Record<string, string> = {
    systemType: "System Type",
    dataUse: "Data Use",
    dataCategories: "Data Categories",
  };
  return map[dimension] ?? dimension;
}
