export interface PrivacyDeclaration {
  data_categories: string[];
  data_subjects: string[];
  data_use: string;
  name: string;
}

export interface System {
  description: string;
  fides_key: string;
  name: string;
  privacy_declarations: PrivacyDeclaration[];
  system_dependencies: string[];
  system_type: string;
}

export type GroupByOption = "systemType" | "dataUse" | "dataCategories";

/** All filterable dimensions — a superset of GroupByOption. */
export type FilterDimension = GroupByOption | "identifiability";

/** GroupByOption plus a "none" option that shows all systems in a single flat group. */
export type GroupBySelection = GroupByOption | "none";

export type ViewMode = "board" | "list";

export type FilterMode = "checkbox" | "sentence";

export interface DimensionFilters {
  systemType: string[];
  dataUse: string[];
  dataCategories: string[];
  identifiability: string[];
}

export interface AvailableFilterValues {
  systemType: string[];
  dataUse: string[];
  dataCategories: string[];
  identifiability: string[];
}

export interface GroupedSystems {
  key: string;
  label: string;
  systems: System[];
}

export interface AlertItem {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}
