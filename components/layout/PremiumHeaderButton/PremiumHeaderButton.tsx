import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { Pressable } from "react-native";

import { VIP_IMAGE } from "@/constants/assets";

type Props = {
  isPremium: boolean;
  onPress: () => void;
};

export function PremiumHeaderButton({ isPremium, onPress }: Props) {
  return (
    <Pressable
      accessibilityLabel={isPremium ? "Premium member" : "Upgrade to VIP"}
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      className="h-11 items-center justify-center active:opacity-80"
      style={{ opacity: isPremium ? 1 : 0.92 }}
    >
      <Image
        source={VIP_IMAGE}
        style={{ width: 54, height: 30 }}
        contentFit="contain"
        accessibilityLabel="VIP"
      />
    </Pressable>
  );
}
