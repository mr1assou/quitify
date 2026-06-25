import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useMemo } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
  type ImageSourcePropType,
} from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { PAYWALL_PLANS_USD } from "@/constants/paywall/paywallPlans";
import { useApp } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";
import { computeMonthlyCigaretteSpend } from "@/utils/paywall/monthlyCigaretteSpend";
import { formatCurrency } from "@/utils/shared/format";

const SHEET_HEIGHT_RATIO = 0.7;

const QUITIFY_LOGO = require("../assets/images/logo.webp") as ImageSourcePropType;

const QUITIFY_MONTHLY_USD =
  PAYWALL_PLANS_USD.find((plan) => plan.id === "yearly")?.rightAmountUsd ?? 4.99;

function SheetBackground({ isDark, height }: { isDark: boolean; height: number }) {
  const { width } = useWindowDimensions();

  const top = isDark ? "#1A1410" : "#FFFBF7";
  const mid = isDark ? "#221810" : "#FFF4E8";
  const bottom = isDark ? "#121212" : "#FFE8D1";

  return (
    <Svg
      width={width}
      height={height}
      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <Defs>
        <LinearGradient id="comparisonGrad" x1="0" y1="0" x2="0.2" y2="1">
          <Stop offset="0" stopColor={top} stopOpacity={1} />
          <Stop offset="0.5" stopColor={mid} stopOpacity={1} />
          <Stop offset="1" stopColor={bottom} stopOpacity={1} />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width={width} height={height} fill="url(#comparisonGrad)" />
    </Svg>
  );
}

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
  const { colors } = useTheme();

  return (
    <View className="flex-1 rounded-2xl border border-border bg-white/90 px-3 py-4 shadow-sm dark:border-d-border dark:bg-d-surface">
      <View className="mb-3 h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-accent-soft dark:bg-d-accent-soft">
        {logoSource ? (
          <Image source={logoSource} style={{ width: 28, height: 28 }} contentFit="contain" />
        ) : (
          <Ionicons name={icon ?? "cash"} size={20} color={colors.accent} />
        )}
      </View>
      <Text className="text-xs font-semibold text-muted-foreground dark:text-d-muted">
        {title}
      </Text>
      <Text
        className="mt-2 text-xl font-extrabold leading-6 tabular-nums text-foreground dark:text-d-text"
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.75}
      >
        {amount}
      </Text>
      <Text className="mt-0.5 text-xs text-muted-foreground dark:text-d-muted">{period}</Text>
    </View>
  );
}

export default function PaywallComparison() {
  const { state } = useApp();
  const { colors, resolved } = useTheme();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const isDark = resolved === "dark";
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
  const quitifyDisplay = formatCurrency(QUITIFY_MONTHLY_USD, "USD");

  const dismiss = () => {
    router.back();
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
        <SheetBackground isDark={isDark} height={sheetHeight} />

        <View className="flex-row items-center justify-end px-4 pt-3">
          <Pressable
            onPress={dismiss}
            className="h-10 w-10 items-center justify-center rounded-full bg-white/60 active:opacity-70 dark:bg-d-surface/80"
          >
            <Ionicons name="close" size={20} color={colors.foreground} />
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
          <Text className="text-3xl font-extrabold leading-tight text-foreground dark:text-d-text">
            Your money, your choice
          </Text>
          <Text className="mt-2 text-sm leading-5 text-muted-foreground dark:text-d-muted">
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
              title="Quitify premium"
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
