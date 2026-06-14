import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/context/ThemeContext";

import { usePickChatMedia, type ChatMediaPick } from "./usePickChatMedia";
import { useRecordChatAudio } from "./useRecordChatAudio";

const CONTROL = 40;
const INPUT_MAX_HEIGHT = 72;

type Props = {
  onSend: (text: string) => void;
  onSendMedia?: (items: ChatMediaPick[]) => void | Promise<void>;
  onTypingChange?: (isTyping: boolean) => void;
  placeholder?: string;
  isSendingMedia?: boolean;
  disabled?: boolean;
};

export function MessageComposer({
  onSend,
  onSendMedia,
  onTypingChange,
  placeholder = "Message…",
  isSendingMedia = false,
  disabled = false,
}: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { pickFromGallery } = usePickChatMedia();
  const { isRecording, startRecording, stopRecording, cancelRecording } = useRecordChatAudio();
  const [text, setText] = useState("");

  const hasText = text.trim().length > 0;
  const busy = disabled || isSendingMedia || isRecording;

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    onTypingChange?.(false);
    onSend(trimmed);
    setText("");
  };

  const onMicPressIn = async () => {
    if (busy || hasText) return;
    await startRecording();
  };

  const onMicPressOut = async () => {
    if (!isRecording) return;
    const clip = await stopRecording();
    if (!clip || !onSendMedia) return;
    await onSendMedia([clip]);
  };

  const onGalleryPress = async () => {
    if (busy) return;
    const items = await pickFromGallery();
    if (items.length === 0) return;

    if (onSendMedia) {
      await onSendMedia(items);
      return;
    }

    Alert.alert("Attached", `Selected ${items.length} item(s).`);
  };

  return (
    <View
      className="border-t border-section bg-background dark:border-d-border dark:bg-d-bg"
      style={{ paddingBottom: Math.max(insets.bottom, 12) }}
    >
      {isRecording ? (
        <View className="flex-row items-center justify-center gap-2 px-4 py-2">
          <View className="h-2 w-2 rounded-full bg-red-500" />
          <Text className="text-sm font-medium text-foreground dark:text-d-text">
            Recording… release to send
          </Text>
          <Pressable onPress={() => void cancelRecording()} hitSlop={8}>
            <Text className="text-sm font-semibold text-primary">Cancel</Text>
          </Pressable>
        </View>
      ) : null}

      {isSendingMedia ? (
        <View className="flex-row items-center justify-center gap-2 px-4 py-2">
          <ActivityIndicator size="small" color={colors.primary} />
          <Text className="text-sm text-muted-foreground dark:text-d-muted">Sending media…</Text>
        </View>
      ) : null}

      <View className="flex-row items-center gap-2 px-3 pt-3">
        <ComposerIconButton
          icon="images"
          color={colors.accent}
          backgroundColor={`${colors.accent}18`}
          onPress={() => void onGalleryPress()}
          disabled={busy}
          accessibilityLabel="Send photo or video"
        />

        <View
          className="min-w-0 flex-1 justify-center rounded-full bg-section px-4 dark:bg-d-surface"
          style={{ minHeight: CONTROL, maxHeight: INPUT_MAX_HEIGHT }}
        >
          <TextInput
            value={text}
            editable={!busy}
            onChangeText={(value) => {
              setText(value);
              onTypingChange?.(value.trim().length > 0);
            }}
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
            disabled={busy}
            className="items-center justify-center rounded-full bg-primary"
            style={{ width: CONTROL, height: CONTROL, opacity: busy ? 0.5 : 1 }}
            accessibilityLabel="Send message"
          >
            <Ionicons name="send" size={18} color={colors.white} />
          </Pressable>
        ) : (
          <Pressable
            onPressIn={() => void onMicPressIn()}
            onPressOut={() => void onMicPressOut()}
            hitSlop={6}
            disabled={busy && !isRecording}
            accessibilityLabel="Hold to record voice message"
            className="items-center justify-center rounded-full"
            style={{
              width: CONTROL,
              height: CONTROL,
              backgroundColor: isRecording ? `${colors.primary}40` : `${colors.primary}18`,
            }}
          >
            <Ionicons name="mic" size={20} color={colors.primary} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

function ComposerIconButton({
  icon,
  color,
  backgroundColor,
  onPress,
  disabled,
  accessibilityLabel,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  backgroundColor: string;
  onPress: () => void;
  disabled?: boolean;
  accessibilityLabel: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      className="items-center justify-center rounded-full"
      style={{ width: CONTROL, height: CONTROL, backgroundColor, opacity: disabled ? 0.5 : 1 }}
    >
      <Ionicons name={icon} size={20} color={color} />
    </Pressable>
  );
}
