import { ScrollView, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

import { CravingTimer } from "@/components/feature/craving/CravingTimer";
import { TapGame } from "@/components/feature/craving/TapGame";
import { Button } from "@/components/ui/Button";
import {
  CRAVING_TAP_TARGET,
  CRAVING_TIMER_SECONDS,
} from "@/constants/cravingSession";
import { useCravingCountdown } from "@/hooks/useCravingCountdown";
import { useCravingTipCycle } from "@/hooks/useCravingTipCycle";

import { CravingSupportIntro } from "./CravingSupportIntro";
import { CravingTipSection } from "./CravingTipSection";

type Props = {
  onFinished: () => void;
};

export function CravingSupportPhase({ onFinished }: Props) {
  const countdown = useCravingCountdown({ totalSeconds: CRAVING_TIMER_SECONDS });
  const { tip, shuffle } = useCravingTipCycle();

  return (
    <ScrollView
      contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View className="gap-8 pt-4">
        <CravingSupportIntro />

        <Animated.View entering={FadeInUp.delay(80).duration(400)} className="items-center">
          <CravingTimer
            totalSeconds={countdown.totalSeconds}
            remainingSeconds={countdown.remainingSeconds}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(160).duration(400)}>
          <CravingTipSection tip={tip} onShuffle={shuffle} />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(240).duration(400)}>
          <TapGame target={CRAVING_TAP_TARGET} />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(320).duration(400)}>
          <Button
            label="I'm through — log it"
            size="lg"
            fullWidth
            onPress={onFinished}
          />
        </Animated.View>
      </View>
    </ScrollView>
  );
}
