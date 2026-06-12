import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, Pressable, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/context/ThemeContext";

import { usePickChatMedia, type ChatMediaPick } from "./usePickChatMedia";

const CONTROL = 40;
const INPUT_MAX_HEIGHT = 72;

type Props = {
  onSend: (text: string) => void;
  onSendMedia?: (items: ChatMediaPick[]) => void;
  placeholder?: string;
};

export function MessageComposer({
  onSend,
  onSendMedia,
  placeholder = "Message…",
}: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { pickFromGallery } = usePickChatMedia();
  const [text, setText] = useState("");

  const hasText = text.trim().length > 0;

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
  };

  const onAudioPress = () => {
    Alert.alert(
      "Voice message",
      "Hold to record voice messages — coming in a future update.",
    );
  };

  const onGalleryPress = async () => {
    const items = await pickFromGallery();
    if (items.length === 0) return;

    if (onSendMedia) {
      onSendMedia(items);
      return;
    }

    const labels = items.map((item) => (item.kind === "video" ? "a video" : "a photo"));
    Alert.alert("Attached", `Selected ${labels.join(", ")}. Media messages coming soon.`);
  };

  return (
    <View
      className="flex-row items-center gap-2 border-t border-section bg-background px-3 pt-3 dark:border-d-border dark:bg-d-bg"
      style={{ paddingBottom: Math.max(insets.bottom, 12) }}
    >
      <ComposerIconButton
        icon="images"
        color={colors.accent}
        backgroundColor={`${colors.accent}18`}
        onPress={() => void onGalleryPress()}
        accessibilityLabel="Send photo or video"
      />

      <View
        className="min-w-0 flex-1 justify-center rounded-full bg-section px-4 dark:bg-d-surface"
        style={{ minHeight: CONTROL, maxHeight: INPUT_MAX_HEIGHT }}
      >
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder={placeholder}
          placeholderTextColor={colors.mutedForeground}
          multiline
          textAlignVertical="center"
          style={{
            color: colors.foreground,
            fontSize: 15,
            lineHeight: 20,
            paddingVertical: 8,
            maxHeight: INPUT_MAX_HEIGHT - 4,
          }}
        />
      </View>

      {hasText ? (
        <Pressable
          onPress={submit}
          hitSlop={6}
          className="items-center justify-center rounded-full bg-primary"
          style={{ width: CONTROL, height: CONTROL }}
          accessibilityLabel="Send message"
        >
          <Ionicons name="send" size={18} color={colors.white} />
        </Pressable>
      ) : (
        <ComposerIconButton
          icon="mic"
          color={colors.primary}
          backgroundColor={`${colors.primary}18`}
          onPress={onAudioPress}
          accessibilityLabel="Send voice message"
        />
      )}
    </View>
  );
}

function ComposerIconButton({
  icon,
  color,
  backgroundColor,
  onPress,
  accessibilityLabel,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  backgroundColor: string;
  onPress: () => void;
  accessibilityLabel: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      accessibilityLabel={accessibilityLabel}
      className="items-center justify-center rounded-full"
      style={{ width: CONTROL, height: CONTROL, backgroundColor }}
    >
      <Ionicons name={icon} size={20} color={color} />
    </Pressable>
  );
}
