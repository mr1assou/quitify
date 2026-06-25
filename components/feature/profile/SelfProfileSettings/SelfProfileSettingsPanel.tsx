import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Switch, Text, View } from "react-native";

import {
  ResetJourneyModals,
  type ResetJourneyModalState,
} from "@/components/feature/profile/ResetJourneyModals";
import { HabitSettingsModal } from "@/components/feature/profile/HabitSettingsModal";
import { ThemeSwitcher } from "@/components/feature/profile/ThemeSwitcher";
import { ListGroup, type ListRow } from "@/components/ui/ListGroup";
import { useTheme } from "@/context/ThemeContext";
import { useResetJourney } from "@/hooks/auth/useResetJourney";
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
  onPremiumChange: (value: boolean) => void;
};

export function SelfProfileSettings({
  profile,
  isPremium,
  accountEmail,
  isSignedIn,
  onSignOut,
  onPremiumChange,
}: Props) {
  const { colors } = useTheme();
  const resetJourney = useResetJourney();
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
      <ListGroup rows={programRows} />

      {isSignedIn ? (
        <ListGroup
          rows={[
            {
              id: "logout",
              icon: "log-out-outline",
              label: "Log out",
              destructive: true,
              onPress: onSignOut,
            },
          ]}
        />
      ) : null}

      <View className="rounded-3xl bg-section p-4 dark:bg-d-surface">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-3">
            <Text className="text-base font-bold text-foreground dark:text-d-text">Premium</Text>
            <Text className="mt-1 text-xs text-muted-foreground dark:text-d-muted">
              Ad-free, advanced stats, exclusive rewards.
            </Text>
          </View>
          <Switch
            value={isPremium}
            onValueChange={onPremiumChange}
            trackColor={{ true: colors.primary, false: colors.secondary }}
            thumbColor={colors.white}
          />
        </View>
      </View>

      {!isPremium ? (
        <Pressable onPress={() => safeRouter.push("/paywall")} className="active:opacity-70">
          <View className="rounded-3xl bg-primary p-4">
            <View className="flex-row items-center">
              <Ionicons name="diamond" size={20} color={colors.white} />
              <Text className="ml-2 text-base font-bold text-white">Unlock Premium</Text>
            </View>
            <Text className="mt-1 text-xs text-white opacity-80">
              See the full $3.99/month offer.
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
