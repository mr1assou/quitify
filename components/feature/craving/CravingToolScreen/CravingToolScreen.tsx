import { router } from "expo-router";
import { useCallback, type ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { CravingSessionHeader } from "@/components/feature/craving/CravingSessionHeader";
import { useCravingTool } from "@/hooks/i18n/useCravingTools";
import type { CravingToolId } from "@/constants/craving/cravingTools";

type Props = {
  toolId: CravingToolId;
  title?: string;
  children: ReactNode;
};

/** Full-screen shell for a craving tool (standard app background). */
export function CravingToolScreen({ toolId, title, children }: Props) {
  const tool = useCravingTool(toolId);
  const close = useCallback(() => router.back(), []);

  return (
    <SafeAreaView
      className="flex-1 bg-background dark:bg-d-bg"
      edges={["top", "bottom"]}
    >
      <CravingSessionHeader
        title={title ?? tool.label}
        showBack
        onBack={close}
        onClose={close}
      />
      {children}
    </SafeAreaView>
  );
}
