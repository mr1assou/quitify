import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { Card } from "@/components/ui/Card";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { usePremiumGate } from "@/hooks/premium/usePremiumGate";

type Props = {
  title: string;
  description: string;
};

export function PremiumLockedSection({ title, description }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { requirePremium } = usePremiumGate();

  return (
    <Pressable onPress={requirePremium} className="active:opacity-90">
      <Card variant="section">
        <View className="flex-row items-start">
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-2xl bg-primary/15">
            <Ionicons name="lock-closed" size={18} color={colors.primary} />
          </View>
          <View className="flex-1">
            <Text className="text-xs font-semibold uppercase tracking-widest text-primary">
              {t("premium.lockedBadge")}
            </Text>
            <Text className="mt-1 text-base font-bold text-foreground dark:text-d-text">
              {title}
            </Text>
            <Text className="mt-1 text-sm text-muted-foreground dark:text-d-muted">
              {description}
            </Text>
            <Text className="mt-3 text-sm font-semibold text-primary">
              {t("premium.unlockCta")}
            </Text>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}
