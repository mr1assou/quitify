import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useMemo } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
  type ImageSourcePropType,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppScreenBackground } from "@/components/layout/AppScreenBackground";
import { Button } from "@/components/ui/Button";
import { getThemeColors } from "@/constants/app/theme";
import { usePaywallPlans } from "@/hooks/paywall/usePaywallPlans";
import { useApp } from "@/context/AppContext";
import { computeMonthlyCigaretteSpend } from "@/utils/paywall/monthlyCigaretteSpend";
import { safeRouter } from "@/utils/app/safeRouter";
import { formatCurrency } from "@/utils/shared/format";
import { markPostPaywallFlowComplete } from "@/utils/onboarding/postSignupFlowStorage";

const SHEET_HEIGHT_RATIO = 0.7;

const QUITIFY_LOGO = require("../assets/images/logo.webp") as ImageSourcePropType;

const PAYWALL_COLORS = getThemeColors("dark");

type ComparisonBoxProps = {
  title: string;
  amount: string;
  period: string;
  icon?: keyof typeof Ionicons.glyphMap;
  logoSource?: ImageSourcePropType;
};

function ComparisonBox({
  title,
  amount,
  period,
  icon,
  logoSource,
}: ComparisonBoxProps) {
  return (
    <View className="flex-1 rounded-2xl border border-d-border bg-d-surface/95 px-3 py-4 shadow-sm">
      <View className="mb-3 h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-d-accent-soft">
        {logoSource ? (
          <Image source={logoSource} style={{ width: 28, height: 28 }} contentFit="contain" />
        ) : (
          <Ionicons name={icon ?? "cash"} size={20} color={PAYWALL_COLORS.accent} />
        )}
      </View>
      <Text className="text-xs font-semibold text-d-muted">{title}</Text>
      <Text
        className="mt-2 text-xl font-extrabold leading-6 tabular-nums text-d-text"
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.75}
      >
        {amount}
      </Text>
      <Text className="mt-0.5 text-xs text-d-muted">{period}</Text>
    </View>
  );
}

export default function PaywallComparison() {
  const { state } = useApp();
  const { plans } = usePaywallPlans();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const profile = state.profile;
  const sheetHeight = windowHeight * SHEET_HEIGHT_RATIO;

  const monthlyCigaretteSpend = useMemo(
    () =>
      computeMonthlyCigaretteSpend({
        cigarettesPerDay: profile.cigarettesPerDay,
        cigarettesPerPack: profile.cigarettesPerPack,
        packCost: profile.packCost,
      }),
    [profile.cigarettesPerDay, profile.cigarettesPerPack, profile.packCost],
  );

  const cigaretteDisplay = formatCurrency(
    monthlyCigaretteSpend,
    profile.currency || "USD",
  );
  const quitifyDisplay =
    plans.find((plan) => plan.id === "yearly")?.rightPrice ??
    formatCurrency(4.17, "USD");

  const dismiss = () => {
    void markPostPaywallFlowComplete();
    safeRouter.back();
  };

  return (
    <View className="flex-1 justify-end">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Dismiss comparison"
        className="absolute inset-0 bg-black/45"
        onPress={dismiss}
      />

      <View
        className="overflow-hidden rounded-t-3xl"
        style={{ height: sheetHeight }}
      >
        <AppScreenBackground isDark showOrbs={false} />

        <View className="flex-row items-center justify-end px-4 pt-3">
            <Pressable
              onPress={dismiss}
              className="h-10 w-10 items-center justify-center rounded-full bg-d-surface/85 active:opacity-70"
            >
              <Ionicons name="close" size={20} color={PAYWALL_COLORS.foreground} />
            </Pressable>
          </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingBottom: Math.max(insets.bottom, 16) + 16,
            }}
            showsVerticalScrollIndicator={false}
          >
            <Text className="text-3xl font-extrabold leading-tight text-d-text">
              Your money, your choice
            </Text>
            <Text className="mt-2 text-sm leading-5 text-d-muted">
              What you spend on cigarettes each month vs Quitify.
            </Text>

            <View className="mt-6 flex-row gap-3">
              <ComparisonBox
                icon="cash"
                title="Cigarettes"
                amount={cigaretteDisplay}
                period="/month"
              />
              <ComparisonBox
                logoSource={QUITIFY_LOGO}
                title="Quitify VIP"
                amount={quitifyDisplay}
                period="/month"
              />
            </View>

            <View className="mt-5">
              <Button label="Continue" size="md" fullWidth onPress={dismiss} />
            </View>
          </ScrollView>
      </View>
    </View>
  );
}
