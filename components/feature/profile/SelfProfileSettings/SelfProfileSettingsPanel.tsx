import { Ionicons } from "@expo/vector-icons";
import { Pressable, Switch, Text, View } from "react-native";

import { ThemeSwitcher } from "@/components/feature/profile/ThemeSwitcher";
import { UnlockSuccessCard } from "@/components/feature/profile/UnlockSuccessCard";
import { ListGroup, type ListRow } from "@/components/ui/ListGroup";
import { useTheme } from "@/context/ThemeContext";
import type { UserProfile } from "@/types/profile";
import { formatDate } from "@/utils/format";
import { habitQuantityLabel } from "@/utils/profileConsumptionLabel";
import { safeRouter } from "@/utils/safeRouter";

type Props = {
  profile: UserProfile;
  streakDays: number;
  isPremium: boolean;
  accountEmail?: string;
  isSignedIn: boolean;
  onSignOut: () => void;
  onPremiumChange: (value: boolean) => void;
};

export function SelfProfileSettings({
  profile,
  streakDays,
  isPremium,
  accountEmail,
  isSignedIn,
  onSignOut,
  onPremiumChange,
}: Props) {
  const { colors } = useTheme();

  const accountRows: ListRow[] = isSignedIn
    ? [
        {
          id: "signed-in",
          icon: "person-circle-outline",
          label: accountEmail ?? "Signed in",
        },
        {
          id: "logout",
          icon: "log-out-outline",
          label: "Log out",
          destructive: true,
          onPress: onSignOut,
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
      id: "smoke",
      icon: "logo-no-smoking",
      label: habitQuantityLabel(profile),
    },
  ];

  return (
    <View className="gap-4">
      <ThemeSwitcher />
      <UnlockSuccessCard daysQuit={streakDays} />
      <ListGroup rows={accountRows} />
      <ListGroup rows={programRows} />

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
    </View>
  );
}
