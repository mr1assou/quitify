import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { BadgeArt } from "@/components/feature/progress/BadgeArt";
import { LeaderboardAvatar } from "@/components/feature/progress/LeaderboardAvatar";
import { useCommunity } from "@/context/CommunityContext";
import { useTheme } from "@/context/ThemeContext";
import { useIsPremium } from "@/hooks/auth/useIsPremium";
import { usePremiumGate } from "@/hooks/premium/usePremiumGate";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import type { LeaderboardEntry } from "@/types/leaderboard/leaderboard";
import { safeRouter } from "@/utils/app/safeRouter";
import { dbAuthorId } from "@/utils/community/presence";
import { communityUserFromLeaderboardEntry } from "@/utils/leaderboard/communityUserFromLeaderboardEntry";
import { rememberLeaderboardEntry } from "@/utils/leaderboard/leaderboardProfilePeekCache";
import { navigateToSelfPlayerProfile } from "@/utils/profile/navigateToUserProfile";
import { getBadgeName } from "@/utils/progress/badges";
import { formatNumber } from "@/utils/shared/format";

type Props = {
  entry: LeaderboardEntry;
  showDivider?: boolean;
  /** Extra pulse after Spot my rank (on top of the always-on YOU row style). */
  emphasized?: boolean;
};

function RankLabel({ rank, isSelf }: { rank: number; isSelf?: boolean }) {
  if (rank === 1) {
    return (
      <View className="mr-2 w-7 items-center rounded-full bg-accent/12 py-0.5">
        <Text className="text-sm font-bold tabular-nums text-accent">{rank}</Text>
      </View>
    );
  }

  if (rank <= 3) {
    return (
      <View className="mr-2 w-7 items-center rounded-full bg-accent/15 py-0.5 dark:bg-primary/25">
        <Text className="text-xs font-bold tabular-nums text-primary dark:text-d-text">
          {rank}
        </Text>
      </View>
    );
  }

  return (
    <Text
      className={`mr-2 w-7 text-center text-xs font-semibold tabular-nums ${
        isSelf
          ? "text-primary"
          : "text-muted-foreground dark:text-d-muted"
      }`}
    >
      {rank}
    </Text>
  );
}

export function LeaderboardRow({ entry, showDivider, emphasized = false }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { upsertAuthor } = useCommunity();
  const isPremium = useIsPremium();
  const { requirePremium } = usePremiumGate();
  const badgeName = getBadgeName(entry.badgeId);
  const hideFp = !isPremium;
  const isSelf = entry.isCurrentUser;

  const openProfile = () => {
    if (entry.isCurrentUser) {
      navigateToSelfPlayerProfile();
      return;
    }

    rememberLeaderboardEntry(entry);

    // Prefer stable user id — rank lookup breaks when leaderboard silently refreshes to page 1.
    if (entry.userId != null) {
      const author = communityUserFromLeaderboardEntry(entry);
      if (author) upsertAuthor(author);
      safeRouter.push(`/player/community/${dbAuthorId(entry.userId)}`);
      return;
    }

    safeRouter.push(`/player/${entry.rank}`);
  };

  const fpBlock = (
    <View className="items-end pl-2">
      <View className="flex-row items-center gap-1.5">
        <View className="h-6 w-6 items-center justify-center rounded-full bg-accent">
          <Ionicons
            name={hideFp ? "lock-closed" : "flash"}
            size={12}
            color={colors.white}
          />
        </View>
        <Text
          className={`text-sm font-bold tabular-nums ${
            hideFp
              ? "text-muted-foreground dark:text-d-muted"
              : "text-foreground dark:text-d-text"
          }`}
        >
          {hideFp ? "—" : formatNumber(entry.xp)}
        </Text>
      </View>
      <Text className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground dark:text-d-muted">
        FP
      </Text>
    </View>
  );

  return (
    <View
      className={
        isSelf
          ? emphasized
            ? "rounded-2xl border border-primary/50 bg-primary/20 dark:border-primary/60 dark:bg-primary/30"
            : "rounded-2xl border border-primary/35 bg-primary/12 dark:border-primary/45 dark:bg-primary/18"
          : undefined
      }
    >
      {showDivider && !isSelf ? (
        <View className="ml-28 h-px bg-border/40 dark:bg-d-border" />
      ) : null}
      <Pressable
        onPress={openProfile}
        className="flex-row items-center px-3 py-3 active:opacity-80"
        accessibilityRole="button"
        accessibilityLabel={
          isSelf ? t("achievements.yourRankLabel") : `View ${entry.name}'s profile`
        }
      >
        <RankLabel rank={entry.rank} isSelf={isSelf} />

        <LeaderboardAvatar
          name={entry.name}
          isCurrentUser={entry.isCurrentUser}
          rank={entry.rank}
          countryFlag={entry.countryFlag}
          imageUrl={entry.imageUrl}
          isOnline={entry.isOnline}
        />

        <View className="ml-3 min-w-0 flex-1">
          <View className="flex-row items-center gap-2">
            <Text
              className={`flex-shrink text-base font-semibold ${
                isSelf
                  ? "text-primary"
                  : "text-foreground dark:text-d-text"
              }`}
              numberOfLines={1}
            >
              {entry.name}
            </Text>
            {isSelf ? (
              <View className="rounded-full bg-primary px-2 py-0.5">
                <Text className="text-[10px] font-bold uppercase text-white">You</Text>
              </View>
            ) : null}
          </View>
          <View className="mt-1.5 flex-row items-center gap-2">
            <BadgeArt badgeId={entry.badgeId} size={28} />
            <Text
              className="flex-1 text-xs font-semibold text-muted-foreground dark:text-d-muted"
              numberOfLines={1}
            >
              {badgeName}
            </Text>
          </View>
        </View>

        {hideFp ? (
          <Pressable
            onPress={requirePremium}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={t("profile.vipFeatureTap", {
              label: t("profile.freedomPoints"),
            })}
            className="active:opacity-80"
          >
            {fpBlock}
          </Pressable>
        ) : (
          fpBlock
        )}
      </Pressable>
    </View>
  );
}
