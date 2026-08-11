import { router } from "expo-router";
import { useCallback } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CravingOutcomePhase } from "@/components/feature/craving/CravingOutcomePhase";
import { CravingSessionHeader } from "@/components/feature/craving/CravingSessionHeader";
import { SlipSubmittingOverlay } from "@/components/feature/craving/SlipSubmittingOverlay";
import { useOutcomeBackHandler } from "@/hooks/app/useOutcomeBackHandler";
import { useSlipSubmit } from "@/hooks/stats/useSlipSubmit";
import { useTranslation } from "@/hooks/i18n/useTranslation";

export function SlipSupportFlow() {
  const { t } = useTranslation();
  const { submit, undo, isSubmitting } = useSlipSubmit();
  const { register } = useOutcomeBackHandler();

  const close = useCallback(() => router.back(), []);

  return (
    <SafeAreaView
      className="flex-1 bg-background dark:bg-d-bg"
      edges={["top", "bottom"]}
    >
      <CravingSessionHeader
        title={t("craving.slipTitle")}
        onClose={isSubmitting ? () => {} : close}
      />

      <View className="flex-1">
        <CravingOutcomePhase
          initialStage="smoked"
          contentTopClassName="pt-2"
          onSubmit={submit}
          onUndoSubmit={undo}
          onDone={close}
          onOutcomeBackChange={register}
          isSubmitting={isSubmitting}
        />
      </View>

      <SlipSubmittingOverlay visible={isSubmitting} />
    </SafeAreaView>
  );
}
