import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ActivityIndicator, Modal, Pressable, Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";

export type PostModalState =
  | { type: "options" }
  | { type: "confirmDelete" }
  | { type: "deleting" }
  | { type: "error"; title: string; message: string };

type Props = {
  state: PostModalState | null;
  onClose: () => void;
  onEdit?: () => void;
  onRequestDelete?: () => void;
  onConfirmDelete?: () => void;
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

function ActionRow({
  label,
  icon,
  destructive,
  onPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  destructive?: boolean;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const tint = destructive ? colors.alert : colors.primary;

  const handlePress = () => {
    Haptics.selectionAsync().catch(() => {});
    onPress();
  };

  return (
    <Pressable
      accessibilityRole="button"
      onPress={handlePress}
      className="flex-row items-center rounded-2xl bg-section px-4 py-3.5 dark:bg-d-surface"
    >
      <View
        className="mr-3 h-10 w-10 items-center justify-center rounded-full"
        style={{ backgroundColor: `${tint}18` }}
      >
        <Ionicons name={icon} size={20} color={tint} />
      </View>
      <Text
        className={`text-base font-semibold ${
          destructive ? "text-alert" : "text-foreground dark:text-d-text"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function PostActionModals({
  state,
  onClose,
  onEdit,
  onRequestDelete,
  onConfirmDelete,
}: Props) {
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

  if (state.type === "options") {
    return (
      <ModalBackdrop onClose={handleClose} canDismiss>
        <View className="items-center">
          <View
            className="h-24 w-24 items-center justify-center rounded-full"
            style={{ backgroundColor: `${colors.primary}18` }}
          >
            <View className="h-16 w-16 items-center justify-center rounded-full bg-primary">
              <Ionicons name="document-text-outline" size={32} color={colors.white} />
            </View>
          </View>
          <Text className="mt-5 text-center text-xl font-bold text-foreground dark:text-d-text">
            Post options
          </Text>
        </View>

        <View className="mt-6 gap-2.5">
          <ActionRow label="Edit" icon="pencil-outline" onPress={() => onEdit?.()} />
          <ActionRow
            label="Delete"
            icon="trash-outline"
            destructive
            onPress={() => onRequestDelete?.()}
          />
        </View>

        <View className="mt-5 items-center">
          <Pressable accessibilityRole="button" onPress={handleClose} className="items-center py-2">
            <Text className="text-sm font-semibold text-muted-foreground dark:text-d-muted">
              Cancel
            </Text>
          </Pressable>
        </View>
      </ModalBackdrop>
    );
  }

  if (state.type === "confirmDelete") {
    return (
      <ModalBackdrop onClose={handleClose} canDismiss>
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
            Delete post?
          </Text>
          <Text className="mt-2 text-center text-sm leading-5 text-muted-foreground dark:text-d-muted">
            This cannot be undone.
          </Text>
        </View>

        <View className="mt-7 items-center gap-3">
          <Pressable
            accessibilityRole="button"
            onPress={handleConfirmDelete}
            className="w-full rounded-2xl bg-alert px-10 py-3.5"
          >
            <Text className="text-center text-base font-bold text-white">Delete post</Text>
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

  if (state.type === "deleting") {
    return (
      <ModalBackdrop onClose={handleClose} canDismiss={false}>
        <View className="items-center py-4">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="mt-5 text-center text-base font-semibold text-foreground dark:text-d-text">
            Deleting post…
          </Text>
          <Text className="mt-2 text-center text-sm text-muted-foreground dark:text-d-muted">
            Please wait a moment.
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
