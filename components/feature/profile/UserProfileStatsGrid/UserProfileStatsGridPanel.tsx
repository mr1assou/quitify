import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";

import { useIsPremium } from "@/hooks/auth/useIsPremium";
import { usePremiumGate } from "@/hooks/premium/usePremiumGate";
import { useTheme } from "@/context/ThemeContext";
import type { PlayerProfile } from "@/types/profile/playerProfile";
import type { ProfileStreak } from "@/types/profile/profileStreak";
import { formatNumber } from "@/utils/shared/format";
import { formatCurrentStreak, formatStreakDuration, getStreakElapsedMs, MS_DAY } from "@/utils/streak";

type Props = {
  profile: PlayerProfile;
  streak?: ProfileStreak;
};

export function UserProfileStatsGrid({ profile, streak }: Props) {
  const { colors } = useTheme();
  const isPremium = useIsPremium();
  const { requirePremium } = usePremiumGate();
  const lockStreakStats = !profile.isCurrentUser && !isPremium;

  /** Snapshot at open — streak tiles stay fixed (no live countdown). */
  const snapshotNow = useMemo(() => Date.now(), []);

  const currentStreakLabel = useMemo(() => {
    if (streak) {
      const elapsedMs = getStreakElapsedMs(streak.streakStart, snapshotNow);
      return formatCurrentStreak(streak.streakStart, snapshotNow, {
        includeSeconds: elapsedMs > 0 && elapsedMs < MS_DAY,
      });
    }
    return `${profile.smokeFreeDays}d`;
  }, [profile.smokeFreeDays, snapshotNow, streak]);

  const bestStreakLabel = useMemo(() => {
    if (streak) {
      const bestMs = streak.maxDurationMs ?? 0;
      const formatOpts = {
        includeSeconds: bestMs > 0 && bestMs < MS_DAY,
      };
      if (bestMs > 0) {
        return formatStreakDuration(bestMs, snapshotNow, formatOpts);
      }
      return formatCurrentStreak(streak.streakStart, snapshotNow, formatOpts);
    }
    if (profile.bestSmokeFreeDays > 0) {
      return `${profile.bestSmokeFreeDays}d`;
    }
    return profile.smokeFreeDays > 0 ? `${profile.smokeFreeDays}d` : "0min";
  }, [profile.bestSmokeFreeDays, profile.smokeFreeDays, snapshotNow, streak]);

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
          locked={lockStreakStats}
          onLockedPress={requirePremium}
        />
        <StatTile
          icon="trophy"
          tint={colors.accent}
          label="Best streak"
          value={bestStreakLabel}
          locked={lockStreakStats}
          onLockedPress={requirePremium}
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
  locked = false,
  onLockedPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  tint: string;
  label: string;
  value: string;
  hint?: string;
  locked?: boolean;
  onLockedPress?: () => void;
}) {
  const card = (
    <View className="rounded-3xl bg-section p-3 dark:bg-d-surface">
      <View className="relative">
        <View
          style={{ backgroundColor: tint }}
          className="mb-2 h-8 w-8 items-center justify-center rounded-xl"
        >
          <Ionicons name={icon} size={16} color="#fff" />
        </View>
        {locked ? (
          <View className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full bg-primary">
            <Ionicons name="lock-closed" size={10} color="#fff" />
          </View>
        ) : null}
      </View>
      <Text className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground dark:text-d-muted">
        {label}
      </Text>
      <Text
        className={`mt-1 text-lg font-bold tabular-nums ${
          locked ? "text-muted-foreground dark:text-d-muted" : "text-foreground dark:text-d-text"
        }`}
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.75}
      >
        {locked ? "—" : value}
      </Text>
      {hint ? (
        <Text className="mt-0.5 text-[10px] text-muted-foreground dark:text-d-muted">{hint}</Text>
      ) : null}
    </View>
  );

  return (
    <View className="flex-1">
      {locked ? (
        <Pressable
          onPress={onLockedPress}
          accessibilityRole="button"
          accessibilityLabel={`${label}, VIP feature. Tap to unlock.`}
          className="active:opacity-90"
        >
          {card}
        </Pressable>
      ) : (
        card
      )}
    </View>
  );
}
