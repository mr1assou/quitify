import type { Ionicons } from "@expo/vector-icons";

/** Generic numeric option for dropdowns / select fields. */
export type DropdownOption = {
  value: number;
  label: string;
};

/** Row contract for the `ListGroup` UI component. */
export type ListRow = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  badge?: string;
  destructive?: boolean;
  onPress?: () => void;
};

/** A step in the onboarding "Analyzing your information" loader. */
export type AnalyzingTask = {
  id: string;
  label: string;
  /** Per-task duration in ms. */
  durationMs: number;
  icon: keyof typeof Ionicons.glyphMap;
};
