import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import {
  KeyboardAvoidingView,
  KeyboardProvider,
  useReanimatedKeyboardAnimation,
} from "react-native-keyboard-controller";
import {
  SafeAreaProvider,
  initialWindowMetrics,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { CURRENT_USER_ID } from "@/constants/community/communityUsers";
import {
  normalizeOnboardingUsername,
  usernameHandleLength,
  USERNAME_MAX_LENGTH,
  USERNAME_STORED_MAX_LENGTH,
} from "@/constants/onboarding/onboardingUsername";
import { useApp } from "@/context/AppContext";
import { useCommunity } from "@/context/CommunityContext";
import { useTheme } from "@/context/ThemeContext";
import { useUsernameAvailability } from "@/hooks/auth/useUsernameAvailability";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { updateUsernameOnServer } from "@/services/auth/usernameApi";
import type { UserProfile } from "@/types/profile/profile";
import { buildProfileFromMe } from "@/utils/auth/buildProfileFromMe";
import { dbAuthorId } from "@/utils/community/presence";

type Props = {
  visible: boolean;
  profile: UserProfile;
  onClose: () => void;
};

export function UsernameEditModal({ visible, profile, onClose }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { state, updateProfile, setAccount } = useApp();
  const { patchAuthor } = useCommunity();
  const [username, setUsername] = useState(() =>
    normalizeOnboardingUsername(profile.name ?? ""),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    setUsername(normalizeOnboardingUsername(profile.name ?? ""));
    setError(null);
  }, [profile.name, visible]);

  const availability = useUsernameAvailability(username, {
    currentUsername: profile.name,
    excludeUserId: state.account?.userId,
    enabled: visible,
  });

  const changed =
    availability.normalized !== normalizeOnboardingUsername(profile.name ?? "");
  const canSave = availability.canUse && changed && !saving;

  const handleSave = () => {
    if (!canSave) return;

    setSaving(true);
    setError(null);

    void updateUsernameOnServer(availability.normalized)
      .then((me) => {
        const nextProfile = buildProfileFromMe(me);
        updateProfile({ name: nextProfile.name });

        if (state.account) {
          setAccount({
            ...state.account,
            name: nextProfile.name,
          });
        }

        const displayName = nextProfile.name ?? availability.normalized;
        patchAuthor(CURRENT_USER_ID, { name: displayName });
        if (state.account?.userId) {
          patchAuthor(dbAuthorId(state.account.userId), { name: displayName });
        }

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
          () => {},
        );
        onClose();
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Could not save username.");
      })
      .finally(() => {
        setSaving(false);
      });
  };

  const statusMessage = availability.taken
    ? t("settings.usernameTaken")
    : error
      ? error
      : null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <KeyboardProvider>
          <UsernameEditSheet
            colors={colors}
            username={username}
            normalized={availability.normalized}
            canSave={canSave}
            saving={saving}
            statusMessage={statusMessage}
            onClose={onClose}
            onUsernameChange={setUsername}
            onSave={handleSave}
          />
        </KeyboardProvider>
      </SafeAreaProvider>
    </Modal>
  );
}

type SheetProps = {
  colors: ReturnType<typeof useTheme>["colors"];
  username: string;
  normalized: string;
  canSave: boolean;
  saving: boolean;
  statusMessage: string | null;
  onClose: () => void;
  onUsernameChange: (value: string) => void;
  onSave: () => void;
};

function UsernameEditSheet({
  colors,
  username,
  normalized,
  canSave,
  saving,
  statusMessage,
  onClose,
  onUsernameChange,
  onSave,
}: SheetProps) {
  const insets = useSafeAreaInsets();
  const { height: keyboardHeight, progress } = useReanimatedKeyboardAnimation();

  const sheetStyle = useAnimatedStyle(() => ({
    paddingBottom:
      32 +
      keyboardHeight.value +
      (1 - progress.value) * Math.max(insets.bottom, 0),
  }));

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <View className="flex-1 justify-end bg-black/50">
        <Pressable accessibilityRole="button" className="flex-1" onPress={onClose} />
        <Animated.View
          style={sheetStyle}
          className="rounded-t-3xl bg-background px-6 pt-5 dark:bg-d-bg"
        >
          <View className="mb-5 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-foreground dark:text-d-text">
              Edit username
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              className="h-9 w-9 items-center justify-center rounded-full bg-section dark:bg-d-surface"
            >
              <Ionicons name="close" size={20} color={colors.mutedForeground} />
            </Pressable>
          </View>


          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground dark:text-d-text">
              Username
            </Text>
            <TextInput
              value={username}
              onChangeText={(text) =>
                onUsernameChange(normalizeOnboardingUsername(text))
              }
              placeholder="@username"
              placeholderTextColor={colors.mutedForeground}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={USERNAME_STORED_MAX_LENGTH}
              className="rounded-2xl bg-section px-4 py-3 text-base text-foreground dark:bg-d-surface dark:text-d-text"
            />
            <Text className="text-xs text-muted-foreground dark:text-d-muted">
              {usernameHandleLength(normalized)}/{USERNAME_MAX_LENGTH} characters
            </Text>
          </View>

          {statusMessage ? (
            <Text className="mt-4 text-sm text-alert">{statusMessage}</Text>
          ) : null}

          <Pressable
            accessibilityRole="button"
            disabled={!canSave || saving}
            onPress={onSave}
            className={`mt-6 items-center rounded-2xl py-3.5 ${
              canSave && !saving ? "bg-primary" : "bg-muted opacity-60"
            }`}
          >
            {saving ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text className="text-base font-bold text-white">Save username</Text>
            )}
          </Pressable>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}
