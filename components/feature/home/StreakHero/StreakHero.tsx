import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import type { ComponentProps } from "react";
import { useMemo } from "react";
import { Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import Svg, {
  Defs,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from "react-native-svg";

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
  const { t, locale } = useTranslation();
  const now = useNow(30_000);
  const streakLabel = useMemo(
    () =>
      formatCurrentStreak(streakStart, now, { includeSeconds: false }).replace(
        "min",
        "mn",
      ),
    [streakStart, now],
  );
  const streakSinceLabel = useMemo(
    () => formatDate(streakStart, locale),
    [streakStart, locale],
  );

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
        className="mt-4 px-1 text-center text-4xl font-bold leading-10 tabular-nums text-foreground dark:text-d-text"
        accessibilityLabel={`Current streak ${streakLabel}, attempt ${attemptNumber}`}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.5}
      >
        {streakLabel}
      </Text>

      <Text className="mt-1 text-center text-sm text-muted-foreground dark:text-d-muted">
        {t("home.since", { date: streakSinceLabel })}
      </Text>

      <View className="mt-8 w-full gap-3">
        <View className="relative w-full overflow-hidden rounded-3xl bg-primary px-5 py-4 shadow-sm">
          <ImpactCardBackground />
          <Text className="mb-2 px-1 text-base font-bold" style={{ color: "#3D3630" }}>
            {t("home.impactTitle")}
          </Text>

          <View>
            <ImpactRow
              icon="cash"
              value={moneyDisplay}
              label={t("home.saved")}
            />
            <ImpactDivider />
            <ImpactRow
              icon="smoking"
              iconSet="materialCommunity"
              value={formatNumber(cigarettesAvoided)}
              label={t("home.cigsAvoided")}
            />
            <ImpactDivider />
            <ImpactRow
              icon="heart"
              value={formatLifeGained(lifeMinutesGained)}
              label={t("home.lifeGained")}
            />
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

type IonName = ComponentProps<typeof Ionicons>["name"];
type MciName = ComponentProps<typeof MaterialCommunityIcons>["name"];

function ImpactRow({
  icon,
  iconSet = "ionicons",
  value,
  label,
}: {
  icon: IonName | MciName;
  iconSet?: "ionicons" | "materialCommunity";
  value: string;
  label: string;
}) {
  return (
    <View className="min-h-[58px] flex-row items-center gap-3 py-2">
      <View className="h-9 w-9 items-center justify-center rounded-xl bg-white">
        {iconSet === "materialCommunity" ? (
          <MaterialCommunityIcons name={icon as MciName} size={21} color="#3D3630" />
        ) : (
          <Ionicons name={icon as IonName} size={21} color="#3D3630" />
        )}
      </View>
      <Text
        className="min-w-0 flex-1 text-sm font-medium"
        style={{ color: "#3D3630", opacity: 0.85 }}
        numberOfLines={1}
      >
        {label}
      </Text>
      <Text
        className="max-w-[52%] shrink-0 text-right text-lg font-bold tabular-nums"
        style={{ color: "#3D3630" }}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
      >
        {value}
      </Text>
    </View>
  );
}

function ImpactDivider() {
  return <View className="h-px" style={{ backgroundColor: "rgba(61,54,48,0.18)" }} />;
}

function ImpactCardBackground() {
  return (
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 360 240"
      preserveAspectRatio="none"
      style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
      pointerEvents="none"
    >
      <Defs>
        <LinearGradient id="homeImpactCardGradient" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#FF9633" />
          <Stop offset="1" stopColor="#FF7A00" />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="360" height="240" fill="url(#homeImpactCardGradient)" />
      <Path
        d="M248 0C293 16 333 43 360 72V0H248Z"
        fill="#FFFFFF"
        fillOpacity={0.1}
      />
    </Svg>
  );
}

