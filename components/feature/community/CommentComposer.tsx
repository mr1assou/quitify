import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, TextInput, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { formatUsernameMention } from "@/constants/onboarding/onboardingUsername";
import type { CommentReplyTarget } from "@/types/community/community";

type Props = {
  placeholder?: string;
  compact?: boolean;
  replyTo?: CommentReplyTarget | null;
  onSubmit: (text: string) => void | Promise<void>;
};

function stripReplyMention(text: string, handle?: string): string {
  if (!handle) return text.trim();

  const trimmed = text.trim();
  const prefix = formatUsernameMention(handle);
  if (trimmed.toLowerCase().startsWith(prefix.toLowerCase())) {
    return trimmed.slice(prefix.length).trimStart();
  }

  return trimmed;
}

export function CommentComposer({
  placeholder = "Write a comment…",
  compact = false,
  replyTo = null,
  onSubmit,
}: Props) {
  const { colors } = useTheme();
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!replyTo) return;

    setText(`${formatUsernameMention(replyTo.handle)} `);
    inputRef.current?.focus();
  }, [replyTo]);

  const submit = async () => {
    const trimmed = text.trim();
    if (!trimmed || submitting) return;

    const message = stripReplyMention(trimmed, replyTo?.handle);
    if (!message) return;

    setSubmitting(true);
    try {
      await onSubmit(message);
      setText("");
    } finally {
      setSubmitting(false);
    }
  };

  const disabled = stripReplyMention(text, replyTo?.handle).length === 0 || submitting;
  const compactSendSize = 28;

  return (
    <View
      className={`flex-row items-center rounded-full bg-section dark:bg-d-surface ${
        compact ? "px-3 py-1" : "px-4 py-2"
      }`}
    >
      <TextInput
        ref={inputRef}
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        editable={!submitting}
        style={{
          color: colors.foreground,
          flex: 1,
          fontSize: compact ? 12 : 15,
          lineHeight: compact ? 17 : 20,
          paddingVertical: compact ? 5 : 4,
          minHeight: compact ? 32 : undefined,
          maxHeight: compact ? 48 : 96,
          opacity: submitting ? 0.6 : 1,
        }}
        multiline
        returnKeyType="send"
        onSubmitEditing={() => void submit()}
        blurOnSubmit
      />
      <Pressable
        onPress={() => void submit()}
        disabled={disabled}
        hitSlop={8}
        className={compact ? "ml-1 items-center justify-center rounded-full bg-primary" : "ml-2"}
        style={
          compact
            ? {
                width: compactSendSize,
                height: compactSendSize,
                opacity: disabled ? 0.4 : 1,
              }
            : { opacity: disabled ? 0.4 : 1 }
        }
        accessibilityLabel="Post comment"
      >
        {submitting ? (
          <ActivityIndicator size="small" color={compact ? colors.white : colors.primary} />
        ) : (
          <Ionicons
            name={compact ? "send" : "arrow-up-circle"}
            size={compact ? 15 : 28}
            color={compact ? colors.white : colors.primary}
          />
        )}
      </Pressable>
    </View>
  );
}
