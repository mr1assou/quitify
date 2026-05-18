import { router } from "expo-router";
import { useCallback, type ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { CravingSessionHeader } from "@/components/feature/craving/CravingSessionHeader";
import { getCravingTool, type CravingToolId } from "@/constants/cravingTools";

type Props = {
  toolId: CravingToolId;
  children: ReactNode;
};

/** Full-screen shell for a craving tool (standard app background). */
export function CravingToolScreen({ toolId, children }: Props) {
  const tool = getCravingTool(toolId);
  const close = useCallback(() => router.back(), []);

  return (
    <SafeAreaView
      className="flex-1 bg-background dark:bg-d-bg"
      edges={["top", "bottom"]}
    >
      <CravingSessionHeader
        title={tool.label}
        showBack
        onBack={close}
        onClose={close}
      />
      {children}
    </SafeAreaView>
  );
}
