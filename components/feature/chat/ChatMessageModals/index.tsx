import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Modal, Pressable, Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import type { ChatMessage } from "@/types/chat/chat";
import { canDeleteChatMessage, canEditChatMessage } from "@/utils/chat/chatMessageMutation";

export type ChatMessageModalState =
  | { type: "options"; message: ChatMessage }
  | { type: "error"; title: string; message: string };

type Props = {
  state: ChatMessageModalState | null;
  onClose: () => void;
  onEdit: (message: ChatMessage) => void;
  onDelete: (message: ChatMessage) => void;
};

function ModalBackdrop({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center px-6">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          className="absolute inset-0 bg-black/50"
          onPress={onClose}
        />
        <View className="w-full max-w-sm overflow-hidden rounded-3xl bg-background px-6 py-7 dark:bg-d-bg">
          {children}
        </View>
      </View>
    </Modal>
  );
}

function IconBadge({
  name,
  ringTint,
  iconColor,
}: {
  name: keyof typeof Ionicons.glyphMap;
  ringTint: string;
  iconColor: string;
}) {
  return (
    <View
      className="h-24 w-24 items-center justify-center rounded-full"
      style={{ backgroundColor: `${ringTint}18` }}
    >
      <View className="h-16 w-16 items-center justify-center rounded-full bg-primary">
        <Ionicons name={name} size={32} color={iconColor} />
      </View>
    </View>
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

export function ChatMessageModals({
  state,
  onClose,
  onEdit,
  onDelete,
}: Props) {
  const { colors } = useTheme();
  if (!state) return null;

  const handleClose = () => {
    Haptics.selectionAsync().catch(() => {});
    onClose();
  };

  if (state.type === "options") {
    const { message } = state;
    const showEdit = canEditChatMessage(message);
    const showDelete = canDeleteChatMessage(message);

    return (
      <ModalBackdrop onClose={handleClose}>
        <View className="items-center">
          <IconBadge
            name="chatbubble-ellipses-outline"
            ringTint={colors.primary}
            iconColor={colors.white}
          />
          <Text className="mt-5 text-center text-xl font-bold text-foreground dark:text-d-text">
            Message options
          </Text>
        </View>

        <View className="mt-6 gap-2.5">
          {showEdit ? (
            <ActionRow
              label="Edit"
              icon="pencil-outline"
              onPress={() => onEdit(message)}
            />
          ) : null}
          {showDelete ? (
            <ActionRow
              label="Delete"
              icon="trash-outline"
              destructive
              onPress={() => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
                onDelete(message);
              }}
            />
          ) : null}
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

  return (
    <ModalBackdrop onClose={handleClose}>
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
