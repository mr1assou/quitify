import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { useNow } from "@/hooks/useNow";
import type { PlayerProfile } from "@/types/playerProfile";
import type { ProfileStreak } from "@/types/profileStreak";
import { formatNumber } from "@/utils/format";
import { formatCurrentStreak, formatStreakDuration, getStreakElapsedMs } from "@/utils/streak";

type Props = {
  profile: PlayerProfile;
  streak?: ProfileStreak;
};

export function UserProfileStatsGrid({ profile, streak }: Props) {
  const { colors } = useTheme();
  const now = useNow(streak ? 1000 : 60_000);

  const currentStreakLabel = useMemo(() => {
    if (streak) return formatCurrentStreak(streak.streakStart, now);
    return `${profile.smokeFreeDays}d`;
  }, [profile.smokeFreeDays, streak, now]);

  const bestStreakLabel = useMemo(() => {
    if (streak) {
      const currentDurationMs = getStreakElapsedMs(streak.streakStart, now);
      const bestDurationMs = Math.max(streak.maxDurationMs ?? 0, currentDurationMs);
      return formatStreakDuration(bestDurationMs, now);
    }
    return `${profile.bestSmokeFreeDays}d`;
  }, [profile.bestSmokeFreeDays, streak, now]);

  return (
    <View className="gap-3">
      <View className="flex-row gap-3">
        <StatTile
          icon="globe"
          tint={colors.accent}
          label="Global rank"
          value={`#${formatNumber(profile.rank)}`}
        />
        <StatTile
          icon="flash"
          tint={colors.primary}
          label="Freedom points"
          value={formatNumber(profile.freedomPoints)}
        />
      </View>

      <View className="flex-row gap-3">
        <StatTile
          icon="leaf"
          tint={colors.secondary}
          label="Current streak"
          value={currentStreakLabel}
        />
        <StatTile
          icon="trophy"
          tint={colors.accent}
          label="Best streak"
          value={bestStreakLabel}
        />
      </View>
    </View>
  );
}

function StatTile({
  icon,
  tint,
  label,
  value,
  hint,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  tint: string;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <View className="flex-1 rounded-3xl bg-section p-3 dark:bg-d-surface">
      <View
        style={{ backgroundColor: tint }}
        className="mb-2 h-8 w-8 items-center justify-center rounded-xl"
      >
        <Ionicons name={icon} size={16} color="#fff" />
      </View>
      <Text className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground dark:text-d-muted">
        {label}
      </Text>
      <Text
        className="mt-1 text-lg font-bold tabular-nums text-foreground dark:text-d-text"
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.75}
      >
        {value}
      </Text>
      {hint ? (
        <Text className="mt-0.5 text-[10px] text-muted-foreground dark:text-d-muted">{hint}</Text>
      ) : null}
    </View>
  );
}
