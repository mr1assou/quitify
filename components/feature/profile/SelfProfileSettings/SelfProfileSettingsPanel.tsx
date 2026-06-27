import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import {
  ResetJourneyModals,
  type ResetJourneyModalState,
} from "@/components/feature/profile/ResetJourneyModals";
import { HabitSettingsModal } from "@/components/feature/profile/HabitSettingsModal";
import { PushNotificationsToggle } from "@/components/feature/profile/PushNotificationsToggle";
import { ThemeSwitcher } from "@/components/feature/profile/ThemeSwitcher";
import { ListGroup, type ListRow } from "@/components/ui/ListGroup";
import { useTheme } from "@/context/ThemeContext";
import { useResetJourney } from "@/hooks/auth/useResetJourney";
import { usePushNotificationsSettings } from "@/hooks/push/usePushNotificationsSettings";
import type { QuitDateApiPayload } from "@/types/onboarding/quitStartDate";
import type { UserProfile } from "@/types/profile/profile";
import { safeRouter } from "@/utils/app/safeRouter";
import { formatDate } from "@/utils/shared/format";

type Props = {
  profile: UserProfile;
  isPremium: boolean;
  accountEmail?: string;
  isSignedIn: boolean;
  onSignOut: () => void;
};

export function SelfProfileSettings({
  profile,
  isPremium,
  accountEmail,
  isSignedIn,
  onSignOut,
}: Props) {
  const { colors } = useTheme();
  const resetJourney = useResetJourney();
  const pushSettings = usePushNotificationsSettings();
  const [resetModal, setResetModal] = useState<ResetJourneyModalState | null>(null);
  const [habitModalOpen, setHabitModalOpen] = useState(false);

  const accountRows: ListRow[] = isSignedIn
    ? [
        {
          id: "signed-in",
          icon: "person-circle-outline",
          label: accountEmail ?? "Signed in",
        },
        {
          id: "reset-journey",
          icon: "refresh-outline",
          label: "Reset my journey",
          onPress: () => setResetModal({ type: "confirm" }),
        },
      ]
    : [
        {
          id: "signup",
          icon: "cloud-upload-outline",
          label: "Save my progress",
          onPress: () => safeRouter.push("/signup"),
        },
      ];

  const programRows: ListRow[] = [
    {
      id: "quit-date",
      icon: "calendar-outline",
      label: "Quit date",
      value: formatDate(profile.quitDate),
    },
    {
      id: "habits",
      icon: "logo-no-smoking",
      label: "Smoking settings",
      onPress: isSignedIn ? () => setHabitModalOpen(true) : undefined,
    },
  ];

  const handleConfirmReset = (quitDate: QuitDateApiPayload) => {
    setResetModal({ type: "resetting" });
    void resetJourney(quitDate)
      .then(() => setResetModal(null))
      .catch((error: unknown) => {
        const message =
          error instanceof Error ? error.message : "Please try again in a moment.";
        setResetModal({
          type: "error",
          title: "Could not reset journey",
          message,
        });
      });
  };

  return (
    <View className="gap-4">
      <ThemeSwitcher />
      <ListGroup rows={accountRows} />
      {isSignedIn ? (
        <PushNotificationsToggle
          enabled={pushSettings.enabled}
          disabled={pushSettings.busy}
          onValueChange={(value) => void pushSettings.setNotificationsEnabled(value)}
        />
      ) : null}
      <ListGroup rows={programRows} />

      <ListGroup
        rows={[
          {
            id: "talk-to-support",
            icon: "chatbubbles-outline",
            label: "Talk to support",
            onPress: () =>
              safeRouter.push({ pathname: "/chats", params: { section: "support" } }),
          },
          ...(isSignedIn
            ? [
                {
                  id: "logout",
                  icon: "log-out-outline" as const,
                  label: "Log out",
                  destructive: true,
                  onPress: onSignOut,
                },
              ]
            : []),
        ]}
      />

      {!isPremium ? (
        <Pressable onPress={() => safeRouter.push("/paywall")} className="active:opacity-70">
          <View className="rounded-3xl bg-primary p-4">
            <View className="flex-row items-center">
              <Ionicons name="diamond" size={20} color={colors.white} />
              <Text className="ml-2 text-base font-bold text-white">Unlock VIP mode</Text>
            </View>
            <Text className="mt-1 text-xs text-white opacity-80">
              See the full $4.99/month offer.
            </Text>
          </View>
        </Pressable>
      ) : null}

      <ResetJourneyModals
        state={resetModal}
        onClose={() => setResetModal(null)}
        onConfirm={handleConfirmReset}
      />

      <HabitSettingsModal
        visible={habitModalOpen}
        profile={profile}
        onClose={() => setHabitModalOpen(false)}
      />
    </View>
  );
}
