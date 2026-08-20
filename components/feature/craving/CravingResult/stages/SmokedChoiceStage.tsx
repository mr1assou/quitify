import { useState } from "react";
import { Image, Text, View } from "react-native";
import Animated, { FadeInUp, ZoomIn } from "react-native-reanimated";

import { LapseConfirmModal } from "@/components/feature/craving/CravingResult/LapseConfirmModal";
import { Button } from "@/components/ui/Button";
import { SMOKED_QUESTION_IMAGE } from "@/constants/app/assets";
import { useTranslation } from "@/hooks/i18n/useTranslation";

const AnimatedImage = Animated.createAnimatedComponent(Image);

type Props = {
  heroSize: number;
  isSubmitting: boolean;
  onLapse: () => void;
  onRelapse: () => void;
};

export function SmokedChoiceStage({
  heroSize,
  isSubmitting,
  onLapse,
  onRelapse,
}: Props) {
  const { t } = useTranslation();
  const [lapseConfirmVisible, setLapseConfirmVisible] = useState(false);

  return (
    <View className="gap-4">
      <View className="items-center">
        <AnimatedImage
          source={SMOKED_QUESTION_IMAGE}
          accessibilityLabel={t("craving.slipChoiceA11y")}
          entering={ZoomIn.springify().damping(14).stiffness(120)}
          style={{ width: heroSize, height: heroSize }}
          resizeMode="contain"
        />
        <Animated.View entering={FadeInUp.delay(220).duration(400)} className="items-center">
          <Text className="mt-3 text-2xl font-bold text-foreground dark:text-d-text">
            {t("craving.slipWhatHappened")}
          </Text>
          <View className="mt-3 mx-2 rounded-2xl bg-section px-4 py-3 dark:bg-d-surface">
            <Text className="text-center text-sm font-medium leading-5 text-foreground dark:text-d-text">
              {t("craving.slipAuthenticHint")}
            </Text>
          </View>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInUp.delay(380).duration(400)} className="gap-3">
        <Button
          label={t("craving.slipLapse")}
          variant="primary"
          size="lg"
          fullWidth
          loading={isSubmitting}
          disabled={isSubmitting}
          onPress={() => setLapseConfirmVisible(true)}
        />
        <Button
          label={t("craving.slipRelapse")}
          variant="ghost"
          size="lg"
          fullWidth
          disabled={isSubmitting}
          onPress={onRelapse}
        />
      </Animated.View>

      <LapseConfirmModal
        visible={lapseConfirmVisible && !isSubmitting}
        onClose={() => setLapseConfirmVisible(false)}
        onConfirm={() => {
          setLapseConfirmVisible(false);
          onLapse();
        }}
      />
    </View>
  );
}
