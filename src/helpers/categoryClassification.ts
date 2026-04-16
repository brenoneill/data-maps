import { formatLabel } from "./formatLabel";

const FIDES_GROUP_MAP: Record<string, string> = {
  device: "Device",
  contact: "Contact",
  location: "Location",
  financial: "Financial",
  credentials: "Credentials",
  health: "Health",
  biometric: "Biometric",
  demographic: "Demographic",
  name: "Name",
  government_id: "Government ID",
  genetic: "Genetic",
  political_opinion: "Political Opinion",
  race: "Race",
  religious_belief: "Religious Belief",
  sexual_orientation: "Sexual Orientation",
};

/**
 * Extracts the Fides Group name from a raw Fideslang data category string.
 *
 * Path structure: user.{provided|derived}.{identifiable|nonidentifiable}.{group}.{specific?}
 *
 * @param raw - Full dot-notation category (e.g. "user.derived.identifiable.device.cookie_id")
 * @returns Fides Group display name (e.g. "Device")
 */
export function classifyCategory(raw: string): string {
  const segments = raw.split(".");

  let groupSegmentIndex = -1;
  for (let i = 0; i < segments.length; i++) {
    if (segments[i] === "identifiable" || segments[i] === "nonidentifiable") {
      groupSegmentIndex = i + 1;
      break;
    }
  }

  if (groupSegmentIndex >= 0 && groupSegmentIndex < segments.length) {
    const groupKey = segments[groupSegmentIndex];
    return FIDES_GROUP_MAP[groupKey] ?? formatLabel(groupKey);
  }

  return "Unknown";
}
