import { Image, View, useWindowDimensions } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

import { MangaSpeechBubble } from "@/components/feature/craving/MangaSpeechBubble";
import { CRAVING_STRONG_IMAGE } from "@/constants/assets";
import { useCravingMotivationMessage } from "@/hooks/useCravingMotivationMessage";

const AnimatedImage = Animated.createAnimatedComponent(Image);

/** Hero illustration with a manga-style motivation bubble near the head. */
export function CravingStrongHero() {
  const { width } = useWindowDimensions();
  const size = Math.round(Math.min(width * 0.85, 360));
  const message = useCravingMotivationMessage();

  return (
    <View style={{ width: size, alignItems: "center" }}>
      <MangaSpeechBubble
        message={message}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 2,
          paddingHorizontal: 4,
        }}
      />

      <AnimatedImage
        source={CRAVING_STRONG_IMAGE}
        accessibilityLabel="Strong craving"
        entering={FadeInUp.duration(550).springify().damping(16).stiffness(140)}
        style={{ width: size, height: size, marginTop: size * 0.14 }}
        resizeMode="contain"
      />
    </View>
  );
}
