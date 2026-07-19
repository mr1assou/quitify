import { Image } from "expo-image";
import { Text, View, type ImageSourcePropType } from "react-native";

import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { usePushNotificationsSettings } from "@/hooks/push/usePushNotificationsSettings";

const SMOKED_IMAGE =
  require("../../../../assets/images/smoked/smoked_result.webp") as ImageSourcePropType;

export function HomeNotificationPrompt() {
  const { t } = useTranslation();
  const {
    enabled,
    busy,
    ready,
    setNotificationsEnabled,
  } = usePushNotificationsSettings();

  if (!ready || enabled) return null;

  return (
    <View className="mx-6 mt-6 rounded-3xl border border-border bg-elevated p-5 dark:border-d-border dark:bg-d-surface">
      <View className="flex-row items-center">
        <View className="mr-4 h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-accent-soft dark:bg-d-accent-soft">
          <Image
            source={SMOKED_IMAGE}
            style={{ width: 80, height: 80 }}
            contentFit="contain"
          />
        </View>

        <View className="min-w-0 flex-1 items-start justify-center">
          <Text className="text-lg font-bold text-foreground dark:text-d-text">
            {t("home.notificationsTitle")}
          </Text>
          <View className="mt-3">
            <Button
              label={t("home.notificationsCta")}
              size="sm"
              loading={busy}
              onPress={() => void setNotificationsEnabled(true)}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
