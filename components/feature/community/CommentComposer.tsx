import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";

type Props = {
  placeholder?: string;
  onSubmit: (text: string) => void;
};

export function CommentComposer({ placeholder = "Write a comment…", onSubmit }: Props) {
  const { colors } = useTheme();
  const [text, setText] = useState("");

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setText("");
  };

  const disabled = text.trim().length === 0;

  return (
    <View className="flex-row items-center rounded-full bg-section px-4 py-2 dark:bg-d-surface">
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        style={{ color: colors.foreground, flex: 1 }}
        multiline
        returnKeyType="send"
        onSubmitEditing={submit}
        blurOnSubmit
      />
      <Pressable
        onPress={submit}
        disabled={disabled}
        hitSlop={8}
        className="ml-2"
        style={{ opacity: disabled ? 0.4 : 1 }}
      >
        <Ionicons name="arrow-up-circle" size={28} color={colors.primary} />
      </Pressable>
    </View>
  );
}
