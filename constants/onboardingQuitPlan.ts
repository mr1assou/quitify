import type { QuitMethodOption, QuitStartPresetOption } from "@/types/onboarding";
import type { DropdownOption, StringDropdownOption } from "@/types/ui";

export type { QuitMethod, QuitStartPreset } from "@/types/onboarding";

export const QUIT_METHOD_OPTIONS: readonly QuitMethodOption[] = [
  {
    id: "cold_turkey",
    label: "Cold turkey",
    hint: "Stop all at once on your quit date",
  },
  {
    id: "gradual",
    label: "Gradual",
    hint: "Reduce step by step until you reach zero",
  },
] as const;

export const QUIT_START_PRESET_OPTIONS: readonly QuitStartPresetOption[] = [
  { id: "now", label: "Now", hint: "Start today" },
  { id: "custom", label: "Custom", hint: "Choose your own quit day" },
] as const;

export const QUIT_METHOD_DROPDOWN_OPTIONS: StringDropdownOption[] =
  QUIT_METHOD_OPTIONS.map((o) => ({ value: o.id, label: o.label }));

export const QUIT_START_DROPDOWN_OPTIONS: StringDropdownOption[] =
  QUIT_START_PRESET_OPTIONS.map((o) => ({ value: o.id, label: o.label }));

export function quitMethodHint(id: string | undefined): string | undefined {
  return QUIT_METHOD_OPTIONS.find((o) => o.id === id)?.hint;
}

export function quitStartPresetHint(id: string | undefined): string | undefined {
  return QUIT_START_PRESET_OPTIONS.find((o) => o.id === id)?.hint;
}

/** Quit date row: preset dropdown + inline custom date fields. */
export const QUIT_DATE_CONTROL_HEIGHT = 48;
export const QUIT_DATE_PRESET_WIDTH_WHEN_CUSTOM = 100;

/** Years available for a custom quit date (today through ~18 months ahead). */
export function quitStartYearOptions(now = new Date()): DropdownOption[] {
  const cy = now.getFullYear();
  const out: DropdownOption[] = [];
  for (let y = cy; y <= cy + 1; y += 1) {
    out.push({ value: y, label: String(y) });
  }
  return out;
}
