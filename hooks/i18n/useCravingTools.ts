import { useMemo } from "react";

import {
  CRAVING_TOOLS,
  type CravingTool,
  type CravingToolId,
} from "@/constants/craving/cravingTools";
import { useTranslation } from "@/hooks/i18n/useTranslation";

const CRAVING_TOOL_KEYS: Record<
  CravingToolId,
  { label: "tipsLabel" | "motivationLabel" | "relaxLabel" | "gamesLabel" | "savedLabel"; description: "tipsDescription" | "motivationDescription" | "relaxDescription" | "gamesDescription" | "savedDescription" }
> = {
  tips: { label: "tipsLabel", description: "tipsDescription" },
  "motivation-cards": { label: "motivationLabel", description: "motivationDescription" },
  "relax-sound": { label: "relaxLabel", description: "relaxDescription" },
  games: { label: "gamesLabel", description: "gamesDescription" },
  saved: { label: "savedLabel", description: "savedDescription" },
};

export function useCravingTools(): readonly CravingTool[] {
  const { t } = useTranslation();

  return useMemo(
    () =>
      CRAVING_TOOLS.map((tool) => {
        const keys = CRAVING_TOOL_KEYS[tool.id];
        return {
          ...tool,
          label: t(`craving.${keys.label}`),
          description: t(`craving.${keys.description}`),
        };
      }),
    [t],
  );
}

export function useCravingTool(id: CravingToolId): CravingTool {
  const tools = useCravingTools();
  const tool = tools.find((item) => item.id === id);
  if (!tool) throw new Error(`Unknown craving tool: ${id}`);
  return tool;
}
