import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import {
  ResetJourneyModals,
  type ResetJourneyModalState,
} from "@/components/feature/profile/ResetJourneyModals";
import { HabitSettingsModal } from "@/components/feature/profile/HabitSettingsModal";
import { UsernameEditModal } from "@/components/feature/profile/UsernameEditModal";
import { PushNotificationsToggle } from "@/components/feature/profile/PushNotificationsToggle";
import { LanguageSwitcher } from "@/components/feature/profile/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/feature/profile/ThemeSwitcher";
import { ListGroup, type ListRow } from "@/components/ui/ListGroup";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { useResetJourney } from "@/hooks/auth/useResetJourney";
import { usePaywallPlans } from "@/hooks/paywall/usePaywallPlans";
import { usePushNotificationsSettings } from "@/hooks/push/usePushNotificationsSettings";
import type { QuitDateApiPayload } from "@/types/onboarding/quitStartDate";
import type { UserProfile } from "@/types/profile/profile";
import { PAYWALL_SOURCE } from "@/constants/analytics/paywall";
import { openPaywall } from "@/utils/analytics/openPaywall";
import { safeRouter } from "@/utils/app/safeRouter";
import { shareApp } from "@/utils/app/shareApp";
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
  const { t } = useTranslation();
  const resetJourney = useResetJourney();
  const pushSettings = usePushNotificationsSettings();
  const { plans } = usePaywallPlans();
  const [resetModal, setResetModal] = useState<ResetJourneyModalState | null>(null);
  const [habitModalOpen, setHabitModalOpen] = useState(false);
  const [usernameModalOpen, setUsernameModalOpen] = useState(false);

  const displayUsername = profile.name?.trim() || t("settings.notSet");
  const yearlyPlan = plans.find((plan) => plan.id === "yearly");
  const vipMonthlyPrice = yearlyPlan?.rightPrice ?? "$4.17";

  const accountRows: ListRow[] = isSignedIn
    ? [
        {
          id: "username",
          icon: "at-outline",
          label: t("settings.username"),
          value: displayUsername,
          onPress: () => setUsernameModalOpen(true),
        },
        {
          id: "signed-in",
          icon: "person-circle-outline",
          label: accountEmail ?? t("settings.signedIn"),
        },
        {
          id: "reset-journey",
          icon: "refresh-outline",
          label: t("settings.resetJourney"),
          onPress: () => setResetModal({ type: "confirm" }),
        },
      ]
    : [
        {
          id: "signup",
          icon: "cloud-upload-outline",
          label: t("settings.saveProgress"),
          onPress: () => safeRouter.push("/signup"),
        },
      ];

  const programRows: ListRow[] = [
    {
      id: "quit-date",
      icon: "calendar-outline",
      label: t("settings.quitDate"),
      value: formatDate(profile.quitDate),
    },
    {
      id: "habits",
      icon: "logo-no-smoking",
      label: t("settings.smokingSettings"),
      onPress: isSignedIn ? () => setHabitModalOpen(true) : undefined,
    },
  ];

  const handleConfirmReset = (quitDate: QuitDateApiPayload) => {
    setResetModal({ type: "resetting" });
    void resetJourney(quitDate)
      .then(() => setResetModal(null))
      .catch((error: unknown) => {
        const message =
          error instanceof Error ? error.message : t("settings.resetErrorMessage");
        setResetModal({
          type: "error",
          title: t("settings.resetErrorTitle"),
          message,
        });
      });
  };

  return (
    <View className="gap-4">
      <ThemeSwitcher />
      <LanguageSwitcher />
      <ListGroup rows={accountRows} />
      {isSignedIn ? (
        <PushNotificationsToggle
          enabled={pushSettings.enabled}
          disabled={pushSettings.busy}
          loading={!pushSettings.ready}
          onValueChange={(value) => void pushSettings.setNotificationsEnabled(value)}
        />
      ) : null}
      <ListGroup rows={programRows} />

      <ListGroup
        rows={[
          {
            id: "share-app",
            icon: "share-social-outline",
            label: t("settings.shareApp"),
            onPress: () => void shareApp(),
          },
          {
            id: "talk-to-support",
            icon: "chatbubbles-outline",
            label: t("settings.talkToSupport"),
            onPress: () =>
              safeRouter.push({ pathname: "/chats", params: { section: "support" } }),
          },
          ...(isSignedIn
            ? [
                {
                  id: "logout",
                  icon: "log-out-outline" as const,
                  label: t("settings.logout"),
                  destructive: true,
                  onPress: onSignOut,
                },
              ]
            : []),
        ]}
      />

      {!isPremium ? (
        <Pressable onPress={() => openPaywall(PAYWALL_SOURCE.profile)} className="active:opacity-70">
          <View className="rounded-3xl bg-primary p-4">
            <View className="flex-row items-center">
              <Ionicons name="diamond" size={20} color={colors.white} />
              <Text className="ml-2 text-base font-bold text-white">{t("settings.unlockVip")}</Text>
            </View>
            <Text className="mt-1 text-xs text-white opacity-80">
              {t("settings.vipOffer", { price: vipMonthlyPrice })}
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

      <UsernameEditModal
        visible={usernameModalOpen}
        profile={profile}
        onClose={() => setUsernameModalOpen(false)}
      />
    </View>
  );
}
