import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import type { ComponentProps } from "react";
import { useMemo } from "react";
import { Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { useNow } from "@/hooks/shared/useNow";
import { formatCurrentStreak } from "@/utils/streak";
import { formatDate, formatLifeGained, formatNumber } from "@/utils/shared/format";

type Props = {
  streakStart: number;
  attemptNumber: number;
  moneySaved: number;
  cigarettesAvoided: number;
  lifeMinutesGained: number;
  currencySymbol: string;
};

export function StreakHero({
  streakStart,
  attemptNumber,
  moneySaved,
  cigarettesAvoided,
  lifeMinutesGained,
  currencySymbol,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const now = useNow(1000);
  const streakLabel = useMemo(
    () => formatCurrentStreak(streakStart, now),
    [streakStart, now],
  );
  const streakSinceLabel = useMemo(() => formatDate(streakStart), [streakStart]);

  const moneyDisplay = `${currencySymbol}${moneySaved.toLocaleString(undefined, {
    minimumFractionDigits: moneySaved < 100 ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;

  return (
    <Animated.View entering={FadeIn.duration(450)} className="items-center">
      <View className="flex-row flex-wrap items-center justify-center gap-2 px-2">
        <Text
          className="text-sm font-semibold uppercase tracking-wide text-muted-foreground dark:text-d-muted"
          numberOfLines={1}
        >
          {t("home.streakLabel")}
        </Text>
        <View className="rounded-full bg-elevated px-2.5 py-0.5 dark:bg-d-surface">
          <Text className="text-xs font-semibold text-foreground dark:text-d-text">
            {t("home.attempt", { n: attemptNumber })}
          </Text>
        </View>
      </View>

      <Text
        className="mt-4 px-1 text-center text-2xl font-bold leading-9 tabular-nums text-foreground dark:text-d-text"
        accessibilityLabel={`Current streak ${streakLabel}, attempt ${attemptNumber}`}
      >
        {streakLabel}
      </Text>

      <Text className="mt-1 text-center text-sm text-muted-foreground dark:text-d-muted">
        {t("home.since", { date: streakSinceLabel })}
      </Text>

      <View className="mt-8 w-full gap-3">
        <View className="flex-row gap-3">
          <StatPill
            icon="cash"
            tint={colors.primary}
            value={moneyDisplay}
            label={t("home.saved")}
          />
          <StatPill
            icon="smoking"
            iconSet="materialCommunity"
            tint={colors.primary}
            value={formatNumber(cigarettesAvoided)}
            label={t("home.cigsAvoided")}
          />
        </View>
        <StatPill
          icon="heart"
          tint={colors.accent}
          value={formatLifeGained(lifeMinutesGained)}
          label={t("home.lifeGained")}
          fullWidth
        />
      </View>
    </Animated.View>
  );
}

type IonName = ComponentProps<typeof Ionicons>["name"];
type MciName = ComponentProps<typeof MaterialCommunityIcons>["name"];

function StatPill({
  icon,
  iconSet = "ionicons",
  tint,
  value,
  label,
  fullWidth = false,
}: {
  icon: IonName | MciName;
  iconSet?: "ionicons" | "materialCommunity";
  tint: string;
  value: string;
  label: string;
  fullWidth?: boolean;
}) {
  return (
    <View
      className={`flex-row items-center rounded-3xl bg-elevated p-4 dark:bg-d-surface ${
        fullWidth ? "w-full" : "flex-1"
      }`}
    >
      <View
        style={{ backgroundColor: tint }}
        className="mr-3 h-11 w-11 items-center justify-center rounded-2xl"
      >
        {iconSet === "materialCommunity" ? (
          <MaterialCommunityIcons name={icon as MciName} size={22} color="#fff" />
        ) : (
          <Ionicons name={icon as IonName} size={22} color="#fff" />
        )}
      </View>
      <View className="min-w-0 flex-1">
        <Text
          className="text-xl font-bold text-foreground dark:text-d-text"
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.75}
        >
          {value}
        </Text>
        <Text className="mt-0.5 text-xs uppercase tracking-wider text-muted-foreground dark:text-d-muted">
          {label}
        </Text>
      </View>
    </View>
  );
}
