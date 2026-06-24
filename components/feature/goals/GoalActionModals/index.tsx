import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ActivityIndicator, Modal, Pressable, Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";

export type GoalModalState =
  | { type: "confirmDelete" }
  | { type: "deleting" }
  | { type: "error"; title: string; message: string };

type Props = {
  state: GoalModalState | null;
  onClose: () => void;
  onConfirmDelete?: () => void;
};

export function GoalActionModals({ state, onClose, onConfirmDelete }: Props) {
  const { colors } = useTheme();
  if (!state) return null;

  const canDismiss = state.type !== "deleting";

  const handleClose = () => {
    if (!canDismiss) return;
    Haptics.selectionAsync().catch(() => {});
    onClose();
  };

  const handleConfirmDelete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    onConfirmDelete?.();
  };

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View className="flex-1 items-center justify-center px-6">
        {canDismiss ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            className="absolute inset-0 bg-black/50"
            onPress={handleClose}
          />
        ) : (
          <View className="absolute inset-0 bg-black/50" />
        )}

        <View className="w-full max-w-sm overflow-hidden rounded-3xl bg-background px-6 py-7 dark:bg-d-bg">
          {state.type === "confirmDelete" ? (
            <>
              <View className="items-center">
                <View
                  className="h-24 w-24 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${colors.alert}18` }}
                >
                  <View className="h-16 w-16 items-center justify-center rounded-full bg-alert">
                    <Ionicons name="trash-outline" size={32} color={colors.white} />
                  </View>
                </View>

                <Text className="mt-5 text-center text-xl font-bold text-foreground dark:text-d-text">
                  Delete goal?
                </Text>
                <Text className="mt-2 text-center text-sm leading-5 text-muted-foreground dark:text-d-muted">
                  This will remove your current goal. This cannot be undone.
                </Text>
              </View>

              <View className="mt-7 items-center gap-3">
                <Pressable
                  accessibilityRole="button"
                  onPress={handleConfirmDelete}
                  className="w-full rounded-2xl bg-alert px-10 py-3.5"
                >
                  <Text className="text-center text-base font-bold text-white">Delete goal</Text>
                </Pressable>
                <Pressable accessibilityRole="button" onPress={handleClose} className="items-center py-2">
                  <Text className="text-sm font-semibold text-muted-foreground dark:text-d-muted">
                    Cancel
                  </Text>
                </Pressable>
              </View>
            </>
          ) : null}

          {state.type === "deleting" ? (
            <View className="items-center py-4">
              <ActivityIndicator size="large" color={colors.primary} />
              <Text className="mt-5 text-center text-base font-semibold text-foreground dark:text-d-text">
                Deleting goal…
              </Text>
              <Text className="mt-2 text-center text-sm text-muted-foreground dark:text-d-muted">
                Please wait a moment.
              </Text>
            </View>
          ) : null}

          {state.type === "error" ? (
            <>
              <View className="items-center">
                <View
                  className="h-24 w-24 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${colors.alert}18` }}
                >
                  <View className="h-16 w-16 items-center justify-center rounded-full bg-alert">
                    <Ionicons name="alert-circle-outline" size={32} color={colors.white} />
                  </View>
                </View>

                <Text className="mt-5 text-center text-xl font-bold text-foreground dark:text-d-text">
                  {state.title}
                </Text>
                <Text className="mt-2 text-center text-sm leading-5 text-muted-foreground dark:text-d-muted">
                  {state.message}
                </Text>
              </View>

              <View className="mt-7 items-center">
                <Pressable
                  accessibilityRole="button"
                  onPress={handleClose}
                  className="rounded-2xl bg-primary px-10 py-3.5"
                >
                  <Text className="text-center text-base font-bold text-white">Got it</Text>
                </Pressable>
              </View>
            </>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}
