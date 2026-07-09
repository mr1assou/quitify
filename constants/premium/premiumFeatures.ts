import type { CravingToolId } from "@/constants/craving/cravingTools";

/** Craving tools fully gated behind VIP — none currently; per-item locks used instead. */
export const PREMIUM_CRAVING_TOOL_IDS = new Set<CravingToolId>();

export function isPremiumCravingTool(toolId: CravingToolId): boolean {
  return PREMIUM_CRAVING_TOOL_IDS.has(toolId);
}
