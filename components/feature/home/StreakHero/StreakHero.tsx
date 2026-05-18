import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { useTheme } from "@/context/ThemeContext";
import { useNow } from "@/hooks/useNow";
import { formatLifeGained, formatNumber } from "@/utils/format";

type Props = {
  streakStart: number;
  moneySaved: number;
  cigarettesAvoided: number;
  lifeMinutesGained: number;
  currencySymbol: string;
};

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

export function StreakHero({
  streakStart,
  moneySaved,
  cigarettesAvoided,
  lifeMinutesGained,
  currencySymbol,
}: Props) {
  const { colors } = useTheme();
  const now = useNow(1000);

  const ms = Math.max(0, now - streakStart);
  const totalSec = Math.floor(ms / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  const moneyDisplay = `${currencySymbol}${moneySaved.toLocaleString(undefined, {
    minimumFractionDigits: moneySaved < 100 ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;

  return (
    <Animated.View entering={FadeIn.duration(450)} className="items-center">
      <Text className="text-sm font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
        Current streak
      </Text>

      <View className="mt-4 flex-row items-end">
        <Unit value={pad(days)} label="days" />
        <Separator />
        <Unit value={pad(hours)} label="hours" />
        <Separator />
        <Unit value={pad(minutes)} label="minutes" />
        <Separator />
        <Unit value={pad(seconds)} label="seconds" muted />
      </View>

      <View className="mt-8 w-full gap-3">
        <View className="flex-row gap-3">
          <StatPill
            icon="cash"
            tint={colors.primary}
            value={moneyDisplay}
            label="saved"
          />
          <StatPill
            icon="ban"
            tint={colors.alert}
            value={formatNumber(cigarettesAvoided)}
            label="cigs avoided"
          />
        </View>
        <StatPill
          icon="heart"
          tint={colors.accent}
          value={formatLifeGained(lifeMinutesGained)}
          label="life gained"
          fullWidth
        />
      </View>
    </Animated.View>
  );
}

function Unit({
  value,
  label,
  muted = false,
}: {
  value: string;
  label: string;
  muted?: boolean;
}) {
  return (
    <View className="items-center px-1.5">
      <Text
        className={`text-5xl font-bold tabular-nums ${
          muted
            ? "text-muted-foreground dark:text-d-muted"
            : "text-foreground dark:text-d-text"
        }`}
      >
        {value}
      </Text>
      <Text className="mt-1.5 text-xs uppercase tracking-widest text-muted-foreground dark:text-d-muted">
        {label}
      </Text>
    </View>
  );
}

function Separator() {
  return (
    <Text className="mx-0.5 -translate-y-2.5 text-4xl font-bold text-muted-foreground dark:text-d-muted">
      :
    </Text>
  );
}

function StatPill({
  icon,
  tint,
  value,
  label,
  fullWidth = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  tint: string;
  value: string;
  label: string;
  fullWidth?: boolean;
}) {
  return (
    <View
      className={`flex-row items-center rounded-3xl bg-section p-4 dark:bg-d-surface ${
        fullWidth ? "w-full" : "flex-1"
      }`}
    >
      <View
        style={{ backgroundColor: tint }}
        className="mr-3 h-11 w-11 items-center justify-center rounded-2xl"
      >
        <Ionicons name={icon} size={22} color="#fff" />
      </View>
      <View className="flex-1 min-w-0">
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
