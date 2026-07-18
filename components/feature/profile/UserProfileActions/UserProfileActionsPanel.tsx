import { useApp } from "@/context/AppContext";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";

import { isSupportRole } from "@/constants/auth/userRoles";
import { useCommunity } from "@/context/CommunityContext";
import { useTheme } from "@/context/ThemeContext";
import {
  blockUser,
  fetchUserModerationStatus,
  unblockUser,
} from "@/services/users/userProfileApi";
import type { CommunityUser } from "@/types/community/community";
import type { PlayerProfile } from "@/types/profile/playerProfile";
import { safeRouter } from "@/utils/app/safeRouter";
import { dbAuthorId } from "@/utils/community/presence";
import { resolveProfileUserId } from "@/utils/profile/communityProfileLinks";

type Props = {
  profile: PlayerProfile;
};

function profileToCommunityUser(
  profile: PlayerProfile,
  peerUserId: number,
): CommunityUser {
  return {
    id: dbAuthorId(peerUserId),
    name: profile.name,
    handle: profile.name,
    bio: profile.bio,
    smokeFreeDays: profile.smokeFreeDays,
    badgeId: profile.badgeId,
    countryFlag: profile.countryFlag,
    avatarRank: profile.rank || 1,
    leaderboardRank: profile.rank,
    avatarUrl: profile.avatarUrl,
    isOnline: profile.isOnline,
  };
}

export function UserProfileActions({ profile }: Props) {
  const { colors } = useTheme();
  const { state: appState } = useApp();
  const { state, loadChatThreads, upsertAuthor } = useCommunity();
  const [accountStatus, setAccountStatus] = useState<"active" | "blocked">(
    profile.accountStatus ?? "active",
  );
  const [statusPending, setStatusPending] = useState(false);

  const isSupportStaff = isSupportRole(appState.account?.role);
  const profileUserId = resolveProfileUserId(profile, appState.account?.userId);

  // Prefetch threads so Message can jump straight to `/chat/<id>` like the chats list.
  useEffect(() => {
    if (profile.isCurrentUser) return;
    void loadChatThreads();
  }, [loadChatThreads, profile.isCurrentUser]);

  useEffect(() => {
    setAccountStatus(profile.accountStatus ?? "active");
  }, [profile.accountStatus, profile.id]);

  useEffect(() => {
    if (!isSupportStaff || profile.isCurrentUser) return;
    if (!profileUserId) return;

    let cancelled = false;
    void fetchUserModerationStatus(profileUserId)
      .then((result) => {
        if (!cancelled) setAccountStatus(result.status);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [
    isSupportStaff,
    profileUserId,
    profile.isCurrentUser,
  ]);

  const onMessage = () => {
    if (profile.isCurrentUser) return;

    const peerUserId = profileUserId;
    if (!peerUserId) {
      Alert.alert(
        "Can't start chat",
        "This profile is not linked to a messaging account yet.",
      );
      return;
    }

    const participantId = dbAuthorId(peerUserId);
    upsertAuthor(profileToCommunityUser(profile, peerUserId));

    const existing = state.threads.find(
      (thread) => thread.participantId === participantId,
    );

    // Same as chats tab: navigate immediately — never wait on the button.
    if (existing) {
      safeRouter.pushStack(`/chat/${existing.id}`);
      return;
    }

    safeRouter.pushStack(`/chat-by-user/${peerUserId}`);
  };

  const onToggleBlock = () => {
    if (profile.isCurrentUser || statusPending) return;

    const peerUserId = profileUserId;
    if (!peerUserId) {
      Alert.alert("Can't update user", "This profile is not linked to an account.");
      return;
    }

    const isBlocked = accountStatus === "blocked";
    Alert.alert(
      `${isBlocked ? "Unblock" : "Block"} ${profile.name}?`,
      isBlocked
        ? "This user will be able to sign in to the app again."
        : "This user will no longer be able to sign in to the app.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: isBlocked ? "Unblock" : "Block",
          style: isBlocked ? "default" : "destructive",
          onPress: () => {
            setStatusPending(true);
            const request = isBlocked ? unblockUser(peerUserId) : blockUser(peerUserId);
            void request
              .then(() => {
                const nextStatus = isBlocked ? "active" : "blocked";
                setAccountStatus(nextStatus);
                Alert.alert(
                  isBlocked ? "User unblocked" : "User blocked",
                  `${profile.name} has been ${isBlocked ? "unblocked" : "blocked"}.`,
                );
              })
              .catch((error: unknown) => {
                Alert.alert(
                  `Could not ${isBlocked ? "unblock" : "block"} user`,
                  error instanceof Error ? error.message : "Please try again.",
                );
              })
              .finally(() => setStatusPending(false));
          },
        },
      ],
    );
  };

  return (
    <View className="flex-row gap-3">
      <Pressable
        onPress={onMessage}
        className="flex-1 flex-row items-center justify-center rounded-full bg-primary py-3 active:opacity-80"
      >
        <Ionicons name="chatbubble-ellipses" size={18} color={colors.white} />
        <Text className="ml-2 text-sm font-bold text-white">Message</Text>
      </Pressable>

      {isSupportStaff ? (
        <Pressable
          onPress={onToggleBlock}
          disabled={statusPending}
          className={`flex-1 flex-row items-center justify-center rounded-full py-3 active:opacity-80 disabled:opacity-60 ${
            accountStatus === "blocked" ? "bg-primary" : "bg-alert"
          }`}
        >
          {statusPending ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <>
              <Ionicons
                name={accountStatus === "blocked" ? "lock-open-outline" : "ban"}
                size={18}
                color={colors.white}
              />
              <Text className="ml-2 text-sm font-bold text-white">
                {accountStatus === "blocked" ? "Unblock" : "Block"}
              </Text>
            </>
          )}
        </Pressable>
      ) : null}
    </View>
  );
}
