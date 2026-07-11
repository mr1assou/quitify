import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Modal, Pressable, Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";

export type PlanDayLockedModalContent = {
  day: number;
  title: string;
  message: string;
};

type Props = {
  content: PlanDayLockedModalContent | null;
  onClose: () => void;
};

export function PlanDayLockedModal({ content, onClose }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const visible = content !== null;

  const handleClose = () => {
    Haptics.selectionAsync().catch(() => {});
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View className="flex-1 items-center justify-center px-6">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("common.close")}
          className="absolute inset-0 bg-black/50"
          onPress={handleClose}
        />

        {content ? (
          <View className="w-full max-w-sm overflow-hidden rounded-3xl bg-background px-6 py-7 dark:bg-d-bg">
            <View className="items-center">
              <View
                className="h-24 w-24 items-center justify-center rounded-full"
                style={{ backgroundColor: `${colors.primary}18` }}
              >
                <View className="h-16 w-16 items-center justify-center rounded-full bg-primary">
                  <Ionicons name="lock-closed" size={32} color={colors.white} />
                </View>
              </View>

              <Text className="mt-5 text-center text-xl font-bold text-foreground dark:text-d-text">
                {content.title}
              </Text>

              <Text className="mt-2 text-center text-sm leading-5 text-muted-foreground dark:text-d-muted">
                {content.message}
              </Text>
            </View>

            <View className="mt-7 items-center">
              <Pressable
                accessibilityRole="button"
                onPress={handleClose}
                className="rounded-2xl bg-primary px-10 py-3.5"
              >
                <Text className="text-center text-base font-bold text-white">
                  {t("common.gotIt")}
                </Text>
              </Pressable>
            </View>
          </View>
        ) : null}
      </View>
    </Modal>
  );
}
