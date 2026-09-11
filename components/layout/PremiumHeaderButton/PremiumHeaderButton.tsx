import { Image } from "expo-image";
import { Pressable } from "react-native";

import { VIP_IMAGE } from "@/constants/app/assets";
import { useTranslation } from "@/hooks/i18n/useTranslation";

type Props = {
  isPremium: boolean;
  onPress: () => void;
};

export function PremiumHeaderButton({ isPremium, onPress }: Props) {
  const { t } = useTranslation();

  return (
    <Pressable
      accessibilityLabel={isPremium ? t("profile.vipMember") : t("layout.upgradeVip")}
      onPress={onPress}
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
