import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ActivityIndicator, Modal, Pressable, Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";

export type PostModerationModalState =
  | { type: "confirm" }
  | { type: "removing" }
  | { type: "error"; title: string; message: string };

type Props = {
  state: PostModerationModalState | null;
  onClose: () => void;
  onConfirmRemove?: () => void;
};

function ModalBackdrop({
  onClose,
  canDismiss,
  children,
}: {
  onClose: () => void;
  canDismiss: boolean;
  children: React.ReactNode;
}) {
  return (
    <Modal
      visible
      transparent
      animationType="fade"
      onRequestClose={canDismiss ? onClose : undefined}
    >
      <View className="flex-1 items-center justify-center px-6">
        {canDismiss ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            className="absolute inset-0 bg-black/50"
            onPress={onClose}
          />
        ) : (
          <View className="absolute inset-0 bg-black/50" />
        )}
        <View className="w-full max-w-sm overflow-hidden rounded-3xl bg-background px-6 py-7 dark:bg-d-bg">
          {children}
        </View>
      </View>
    </Modal>
  );
}

export function PostModerationModals({ state, onClose, onConfirmRemove }: Props) {
  const { colors } = useTheme();
  if (!state) return null;

  const canDismiss = state.type !== "removing";

  const handleClose = () => {
    if (!canDismiss) return;
    Haptics.selectionAsync().catch(() => {});
    onClose();
  };

  const handleConfirm = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    onConfirmRemove?.();
  };

  if (state.type === "confirm") {
    return (
      <ModalBackdrop onClose={handleClose} canDismiss>
        <View className="items-center">
          <View
            className="h-24 w-24 items-center justify-center rounded-full"
            style={{ backgroundColor: `${colors.alert}18` }}
          >
            <View className="h-16 w-16 items-center justify-center rounded-full bg-alert">
              <Ionicons name="shield-outline" size={32} color={colors.white} />
            </View>
          </View>

          <Text className="mt-5 text-center text-xl font-bold text-foreground dark:text-d-text">
            Remove this post?
          </Text>
          <Text className="mt-2 text-center text-sm leading-5 text-muted-foreground dark:text-d-muted">
            Use this when the post is not related to quitting smoking. The author will be
            notified.
          </Text>
        </View>

        <View className="mt-7 items-center gap-3">
          <Pressable
            accessibilityRole="button"
            onPress={handleConfirm}
            className="w-full rounded-2xl bg-alert px-10 py-3.5"
          >
            <Text className="text-center text-base font-bold text-white">Remove post</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={handleClose} className="items-center py-2">
            <Text className="text-sm font-semibold text-muted-foreground dark:text-d-muted">
              Cancel
            </Text>
          </Pressable>
        </View>
      </ModalBackdrop>
    );
  }

  if (state.type === "removing") {
    return (
      <ModalBackdrop onClose={handleClose} canDismiss={false}>
        <View className="items-center py-4">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="mt-5 text-center text-base font-semibold text-foreground dark:text-d-text">
            Removing post…
          </Text>
        </View>
      </ModalBackdrop>
    );
  }

  return (
    <ModalBackdrop onClose={handleClose} canDismiss>
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
    </ModalBackdrop>
  );
}
