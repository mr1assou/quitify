import { Ionicons } from "@expo/vector-icons";
import { safeRouter } from "@/utils/safeRouter";
import { Pressable, ScrollView, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ProfileHeader } from "@/components/feature/profile/ProfileHeader";
import { ThemeSwitcher } from "@/components/feature/profile/ThemeSwitcher";
import { UnlockSuccessCard } from "@/components/feature/profile/UnlockSuccessCard";
import { ListGroup, type ListRow } from "@/components/ui/ListGroup";
import { useApp } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";
import { useStats } from "@/hooks/useStats";
import { formatDate } from "@/utils/format";
import { habitQuantityLabel } from "@/utils/profileConsumptionLabel";

export default function ProfileModal() {
  const { state, setPremium, setAccount, reset } = useApp();
  const { colors } = useTheme();
  const stats = useStats();
  const profile = state.profile;
  if (!profile) return null;

  const accountRows: ListRow[] = state.account
    ? [
        {
          id: "signed-in",
          icon: "person-circle-outline",
          label: state.account.email,
        },
        {
          id: "logout",
          icon: "log-out-outline",
          label: "Log out",
          destructive: true,
          onPress: () => setAccount(null),
        },
      ]
    : [
        {
          id: "signup",
          icon: "cloud-upload-outline",
          label: "Save my progress",
          onPress: () => router.push("/signup"),
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
    {
      id: "reset",
      icon: "power-outline",
      label: "Reset my journey",
      destructive: true,
      onPress: () => {
        reset();
        safeRouter.replace("/onboarding");
      },
    },
  ];

  return (
    <SafeAreaView
      className="flex-1 bg-background dark:bg-d-bg"
      edges={["top", "bottom"]}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="flex-row items-center justify-between px-4 pt-2">
          <Pressable
            onPress={() => safeRouter.back()}
            className="h-11 w-11 items-center justify-center rounded-full bg-section active:opacity-70 dark:bg-d-surface"
          >
            <Ionicons name="close" size={22} color={colors.foreground} />
          </Pressable>
          <View className="h-11 w-11" />
        </View>

        <View className="mt-2">
          <ProfileHeader name={state.account?.name} isPremium={state.isPremium} />
        </View>

        <View className="mt-8 gap-4 px-6">
          <ThemeSwitcher />

          <UnlockSuccessCard daysQuit={stats?.streakDays ?? 0} />

          <ListGroup rows={accountRows} />
          <ListGroup rows={programRows} />

          <View className="rounded-3xl bg-section p-4 dark:bg-d-surface">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-base font-bold text-foreground dark:text-d-text">
                  Premium
                </Text>
                <Text className="mt-1 text-xs text-muted-foreground dark:text-d-muted">
                  Ad-free, advanced stats, exclusive rewards.
                </Text>
              </View>
              <Switch
                value={state.isPremium}
                onValueChange={setPremium}
                trackColor={{ true: colors.primary, false: colors.secondary }}
                thumbColor={colors.white}
              />
            </View>
          </View>

          {!state.isPremium ? (
            <Pressable
              onPress={() => safeRouter.push("/paywall")}
              className="active:opacity-70"
            >
              <View className="rounded-3xl bg-primary p-4">
                <View className="flex-row items-center">
                  <Ionicons name="diamond" size={20} color={colors.white} />
                  <Text className="ml-2 text-base font-bold text-white">
                    Unlock Premium
                  </Text>
                </View>
                <Text className="mt-1 text-xs text-white opacity-80">
                  See the full $3.99/month offer.
                </Text>
              </View>
            </Pressable>
          ) : null}
        </View>

        <Text className="mt-8 text-center text-xs text-muted-foreground dark:text-d-muted">
          Quit Smoking · v1.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
