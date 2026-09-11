import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
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

import { CigarettesPerPackField } from "@/components/feature/onboarding/NicotineConsumptionFields/CigarettesPerPackField";
import { PackCostField } from "@/components/feature/onboarding/NicotineConsumptionFields/PackCostField";
import { useApp } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { updateHabitSettingsOnServer } from "@/services/auth/habitSettingsApi";
import type { UserProfile } from "@/types/profile/profile";
import { buildProfileFromMe } from "@/utils/auth/buildProfileFromMe";
import { parsePackPrice } from "@/utils/auth/parsePackPrice";
import { currencySymbol } from "@/utils/shared/format";

type Props = {
  visible: boolean;
  profile: UserProfile;
  onClose: () => void;
};

export function HabitSettingsModal({ visible, profile, onClose }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { state, updateProfile, setAccount } = useApp();
  const [cigarettesPerDay, setCigarettesPerDay] = useState(String(profile.cigarettesPerDay));
  const [cigarettesPerPack, setCigarettesPerPack] = useState(
    String(profile.cigarettesPerPack),
  );
  const [packCostInput, setPackCostInput] = useState(String(profile.packCost));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    setCigarettesPerDay(String(profile.cigarettesPerDay));
    setCigarettesPerPack(String(profile.cigarettesPerPack));
    setPackCostInput(String(profile.packCost));
    setError(null);
  }, [profile, visible]);

  const canSave = useMemo(() => {
    const perDay = Number.parseInt(cigarettesPerDay, 10);
    const perPack = Number.parseInt(cigarettesPerPack, 10);
    const packCost = parsePackPrice(packCostInput);
    return (
      Number.isFinite(perDay) &&
      perDay >= 0 &&
      Number.isFinite(perPack) &&
      perPack > 0 &&
      Number.isFinite(packCost) &&
      packCost > 0
    );
  }, [cigarettesPerDay, cigarettesPerPack, packCostInput]);

  const handleSave = () => {
    if (!canSave || saving) return;

    setSaving(true);
    setError(null);

    void updateHabitSettingsOnServer({
      cigarettesPerDay: Number.parseInt(cigarettesPerDay, 10),
      cigarettesPerPack: Number.parseInt(cigarettesPerPack, 10),
      packCost: parsePackPrice(packCostInput),
    })
      .then((me) => {
        const nextProfile = buildProfileFromMe(me);
        updateProfile({
          cigarettesPerDay: nextProfile.cigarettesPerDay,
          cigarettesPerPack: nextProfile.cigarettesPerPack,
          packCost: nextProfile.packCost,
          economicsSegments: nextProfile.economicsSegments,
        });
        if (state.account) {
          setAccount({
            ...state.account,
            freedomPoints: me.freedomPoints ?? state.account.freedomPoints,
          });
        }
        onClose();
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : t("settings.saveFailed"));
      })
      .finally(() => {
        setSaving(false);
      });
  };

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
          <HabitSettingsSheet
            colors={colors}
            cigarettesPerDay={cigarettesPerDay}
            cigarettesPerPack={cigarettesPerPack}
            packCostInput={packCostInput}
            profile={profile}
            canSave={canSave}
            saving={saving}
            error={error}
            onClose={onClose}
            onCigarettesPerDayChange={setCigarettesPerDay}
            onCigarettesPerPackChange={setCigarettesPerPack}
            onPackCostInputChange={setPackCostInput}
            onSave={handleSave}
          />
        </KeyboardProvider>
      </SafeAreaProvider>
    </Modal>
  );
}

type SheetProps = {
  colors: ReturnType<typeof useTheme>["colors"];
  cigarettesPerDay: string;
  cigarettesPerPack: string;
  packCostInput: string;
  profile: UserProfile;
  canSave: boolean;
  saving: boolean;
  error: string | null;
  onClose: () => void;
  onCigarettesPerDayChange: (value: string) => void;
  onCigarettesPerPackChange: (value: string) => void;
  onPackCostInputChange: (value: string) => void;
  onSave: () => void;
};

function HabitSettingsSheet({
  colors,
  cigarettesPerDay,
  cigarettesPerPack,
  packCostInput,
  profile,
  canSave,
  saving,
  error,
  onClose,
  onCigarettesPerDayChange,
  onCigarettesPerPackChange,
  onPackCostInputChange,
  onSave,
}: SheetProps) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { height: keyboardHeight, progress } = useReanimatedKeyboardAnimation();
  const packCost = parsePackPrice(packCostInput);
  const packCostInvalid = packCostInput.trim().length > 0 && !(packCost > 0);

  const sheetStyle = useAnimatedStyle(() => ({
    paddingBottom:
      16 +
      keyboardHeight.value +
      (1 - progress.value) * Math.max(insets.bottom, 0),
  }));

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <View className="flex-1 justify-end bg-black/50">
        <Pressable accessibilityRole="button" className="flex-1" onPress={onClose} />
        <Animated.View
          style={sheetStyle}
          className="max-h-[90%] rounded-t-3xl bg-background dark:bg-d-bg"
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 8 }}
          >
            <View className="px-6 pb-2 pt-5">
              <View className="mb-5 flex-row items-center justify-between">
                <Text className="text-xl font-bold text-foreground dark:text-d-text">
                  {t("settings.smokingSettings")}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={onClose}
                  className="h-9 w-9 items-center justify-center rounded-full bg-section dark:bg-d-surface"
                >
                  <Ionicons name="close" size={20} color={colors.mutedForeground} />
                </Pressable>
              </View>

              <Text className="mb-5 text-sm leading-5 text-muted-foreground dark:text-d-muted">
                {t("settings.smokingSettingsHint")}
              </Text>

              <View className="gap-4">
                <View className="gap-2">
                  <Text className="text-sm font-semibold text-foreground dark:text-d-text">
                    {t("settings.cigarettesPerDay")}
                  </Text>
                  <TextInput
                    value={cigarettesPerDay}
                    onChangeText={onCigarettesPerDayChange}
                    keyboardType="number-pad"
                    placeholder={t("settings.cigarettesPerDayPlaceholder")}
                    placeholderTextColor={colors.mutedForeground}
                    className="rounded-2xl bg-section px-4 py-3 text-base text-foreground dark:bg-d-surface dark:text-d-text"
                  />
                </View>

                <View className="gap-2">
                  <Text className="text-sm font-semibold text-foreground dark:text-d-text">
                    {t("settings.cigarettesPerPack")}
                  </Text>
                  <CigarettesPerPackField
                    value={cigarettesPerPack}
                    onChangeText={onCigarettesPerPackChange}
                    placeholder={t("onboarding.nicotine.packSize.placeholder")}
                  />
                </View>

                <View className="gap-2">
                  <Text className="text-sm font-semibold text-foreground dark:text-d-text">
                    {t("settings.packPrice", { symbol: currencySymbol(profile.currency) })}
                  </Text>
                  <PackCostField
                    currency={profile.currency}
                    value={packCostInput}
                    onChangeText={onPackCostInputChange}
                    hasError={packCostInvalid}
                    placeholder={t("onboarding.nicotine.price.placeholder")}
                  />
                  {packCostInvalid ? (
                    <Text className="text-sm text-alert">
                      {t("settings.packPriceRequired")}
                    </Text>
                  ) : null}
                </View>
              </View>

              {error ? (
                <Text className="mt-4 text-sm text-alert">{error}</Text>
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
                  <Text className="text-base font-bold text-white">
                    {t("goals.saveChanges")}
                  </Text>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}
