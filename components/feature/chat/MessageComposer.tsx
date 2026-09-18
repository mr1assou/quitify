import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from "react-native";
import { KeyboardController } from "react-native-keyboard-controller";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useChatComposerKeyboardProgress } from "@/components/feature/chat/ChatKeyboardShell";

import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";

import { usePickChatMedia, type ChatMediaPick } from "./usePickChatMedia";
import { useRecordChatAudio } from "./useRecordChatAudio";

const CONTROL = 40;
const INPUT_MAX_HEIGHT = 72;

export type MessageComposerEditState = {
  messageId: string;
  initialText: string;
};

type Props = {
  onSend: (text: string) => void;
  onSendMedia?: (items: ChatMediaPick[]) => void | Promise<void>;
  onTypingChange?: (isTyping: boolean) => void;
  placeholder?: string;
  isSendingMedia?: boolean;
  disabled?: boolean;
  editState?: MessageComposerEditState | null;
  onSaveEdit?: (messageId: string, text: string) => void | Promise<void>;
  onCancelEdit?: () => void;
};

export function MessageComposer({
  onSend,
  onSendMedia,
  onTypingChange,
  placeholder = "Message…",
  isSendingMedia = false,
  disabled = false,
  editState = null,
  onSaveEdit,
  onCancelEdit,
}: Props) {
  const { colors, resolved } = useTheme();
  const { t } = useTranslation();
  const isDark = resolved === "dark";
  const insets = useSafeAreaInsets();
  const progress = useChatComposerKeyboardProgress();
  const { pickFromGallery } = usePickChatMedia();
  const resolvedPlaceholder = placeholder === "Message…" ? t("chat.composerPlaceholder") : placeholder;

  const MIN_BOTTOM_PADDING = 12;
  const containerStyle = useAnimatedStyle(() => ({
    paddingBottom:
      MIN_BOTTOM_PADDING +
      (1 - progress.value) * Math.max(insets.bottom - MIN_BOTTOM_PADDING, 0),
    backgroundColor: "transparent",
  }));
  const { isRecording, startRecording, stopRecording, cancelRecording } = useRecordChatAudio();
  const [text, setText] = useState("");
  const textRef = useRef("");
  const inputRef = useRef<TextInput>(null);
  const isEditing = Boolean(editState);

  const updateText = (value: string) => {
    textRef.current = value;
    setText(value);
  };

  useEffect(() => {
    if (editState) {
      updateText(editState.initialText);
      return;
    }
    updateText("");
  }, [editState]);

  const hasText = text.trim().length > 0;
  const busy = disabled || isSendingMedia || isRecording;

  const keepKeyboardOpen = () => {
    inputRef.current?.focus();
    KeyboardController.setFocusTo("current");
  };

  const submit = () => {
    const trimmed = textRef.current.trim();
    if (!trimmed || busy) return;
    keepKeyboardOpen();
    onTypingChange?.(false);

    if (isEditing && editState && onSaveEdit) {
      void onSaveEdit(editState.messageId, trimmed);
      keepKeyboardOpen();
      return;
    }

    onSend(trimmed);
    textRef.current = "";
    setText("");
    keepKeyboardOpen();
  };

  const onMicPressIn = async () => {
    if (busy || hasText || isEditing) return;
    await startRecording();
  };

  const onMicPressOut = async () => {
    if (!isRecording) return;
    const clip = await stopRecording();
    if (!clip || !onSendMedia) return;
    await onSendMedia([clip]);
  };

  const onGalleryPress = async () => {
    if (busy || isEditing) return;
    const items = await pickFromGallery();
    if (items.length === 0) return;

    if (onSendMedia) {
      await onSendMedia(items);
      return;
    }

    Alert.alert("Attached", `Selected ${items.length} item(s).`);
  };

  return (
    <Animated.View
      className={`border-t ${isDark ? "border-d-border/60" : "border-border/70"}`}
      style={containerStyle}
    >
      {isEditing ? (
        <View className="flex-row items-center justify-between px-4 pb-2 pt-3">
          <Text className="text-sm font-semibold text-foreground dark:text-d-text">
            {t("chat.editMessage")}
          </Text>
          <Pressable onPress={onCancelEdit} hitSlop={8}>
            <Text className="text-sm font-semibold text-primary">{t("common.cancel")}</Text>
          </Pressable>
        </View>
      ) : null}

      {isRecording ? (
        <View className="flex-row items-center justify-center gap-2 px-4 py-2">
          <View className="h-2 w-2 rounded-full bg-red-500" />
          <Text className="text-sm font-medium text-foreground dark:text-d-text">
            {t("chat.recordingHint")}
          </Text>
          <Pressable onPress={() => void cancelRecording()} hitSlop={8}>
            <Text className="text-sm font-semibold text-primary">{t("common.cancel")}</Text>
          </Pressable>
        </View>
      ) : null}

      {isSendingMedia ? (
        <View className="flex-row items-center justify-center gap-2 px-4 py-2">
          <ActivityIndicator size="small" color={colors.primary} />
          <Text className="text-sm text-muted-foreground dark:text-d-muted">
            {t("chat.sendingMedia")}
          </Text>
        </View>
      ) : null}

      <View className="flex-row items-center gap-2 px-3 pt-3">
        {!isEditing ? (
          <ComposerIconButton
            icon="images"
            color={colors.accent}
            backgroundColor={`${colors.accent}18`}
            onPress={() => void onGalleryPress()}
            disabled={busy}
            accessibilityLabel="Send photo or video"
          />
        ) : null}

        <View
          className={`min-w-0 flex-1 justify-center rounded-full px-4 ${
            isDark ? "bg-d-elevated/90" : "bg-section/95"
          }`}
          style={{ minHeight: CONTROL, maxHeight: INPUT_MAX_HEIGHT }}
        >
          <TextInput
            ref={inputRef}
            nativeID="chat-composer-input"
            value={text}
            editable={!busy}
            blurOnSubmit={false}
            onChangeText={(value) => {
              updateText(value);
              if (!isEditing) {
                onTypingChange?.(value.trim().length > 0);
              }
            }}
            placeholder={isEditing ? t("chat.editPlaceholder") : resolvedPlaceholder}
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
            focusable={false}
            onPressIn={submit}
            onPressOut={keepKeyboardOpen}
            hitSlop={6}
            disabled={busy}
            className="items-center justify-center rounded-full bg-primary"
            style={{ width: CONTROL, height: CONTROL, opacity: busy ? 0.5 : 1 }}
            accessibilityLabel={isEditing ? "Save edited message" : "Send message"}
          >
            <Ionicons name={isEditing ? "checkmark" : "send"} size={18} color={colors.white} />
          </Pressable>
        ) : isEditing ? (
          <View style={{ width: CONTROL, height: CONTROL }} />
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
    </Animated.View>
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
