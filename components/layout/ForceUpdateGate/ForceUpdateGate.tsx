import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { AppState, Linking, Modal, Platform, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { BRAND_ORANGE } from "@/constants/app/theme";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import type { AppVersionRequirement } from "@/services/app/appVersion";
import { fetchAppVersionRequirement } from "@/services/app/appVersion";
import { getCurrentAppVersion, isVersionOlder } from "@/utils/app/appVersion";
import { openExternalUrl } from "@/utils/app/openExternalUrl";

/** Opens the Play Store app directly; web page as fallback. */
const ANDROID_MARKET_URL = "market://details?id=com.pottypaw.quitify";

function openStore(requirement: AppVersionRequirement): void {
  if (Platform.OS === "android") {
    Linking.openURL(ANDROID_MARKET_URL).catch(() => {
      if (requirement.androidStoreUrl) openExternalUrl(requirement.androidStoreUrl);
    });
    return;
  }
  if (requirement.iosStoreUrl) openExternalUrl(requirement.iosStoreUrl);
}

/**
 * Blocking "update the app" popup shown when the installed build is older
 * than the minimum version the backend requires. Not dismissible.
 */
export function ForceUpdateGate() {
  const { t } = useTranslation();
  const [requirement, setRequirement] = useState<AppVersionRequirement | null>(null);
  const [mustUpdate, setMustUpdate] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      const next = await fetchAppVersionRequirement();
      if (cancelled || !next) return;
      setRequirement(next);
      setMustUpdate(isVersionOlder(getCurrentAppVersion(), next.minSupportedVersion));
    };

    void check();

    // Re-check when the app comes back to the foreground, so users who keep
    // the app in memory still get the popup after a forced release.
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") void check();
    });

    return () => {
      cancelled = true;
      subscription.remove();
    };
  }, []);

  if (!mustUpdate || !requirement) return null;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={() => {}}>
      <View className="flex-1 items-center justify-center px-6">
        <View className="absolute inset-0 bg-black/55" />

        <View className="w-full max-w-sm overflow-hidden rounded-3xl bg-background dark:bg-d-bg">
          <View className="items-center px-6 pb-2 pt-8">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-primary/15">
              <Ionicons name="cloud-download-outline" size={40} color={BRAND_ORANGE} />
            </View>
          </View>

          <View className="px-6 pb-5 pt-2">
            <Text className="mb-2 text-center text-xl font-bold text-foreground dark:text-d-text">
              {t("common.updateRequiredTitle")}
            </Text>
            <Text className="text-center text-base leading-6 text-muted-foreground dark:text-d-muted">
              {t("common.updateRequiredBody")}
            </Text>
          </View>

          <View className="px-6 pb-6">
            <Button
              label={t("common.updateNow")}
              onPress={() => openStore(requirement)}
              fullWidth
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
