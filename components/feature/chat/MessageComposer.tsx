import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/context/ThemeContext";

const CONTROL = 40;
const INPUT_MAX_HEIGHT = 72;

type Props = {
  onSend: (text: string) => void;
  placeholder?: string;
};

export function MessageComposer({ onSend, placeholder = "Message…" }: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [text, setText] = useState("");

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
  };

  const disabled = text.trim().length === 0;

  return (
    <View
      className="flex-row items-center gap-2 border-t border-section bg-background px-4 pt-3 dark:border-d-border dark:bg-d-bg"
      style={{ paddingBottom: Math.max(insets.bottom, 12) }}
    >
      <Pressable
        hitSlop={6}
        className="items-center justify-center rounded-full bg-section dark:bg-d-surface"
        style={{ width: CONTROL, height: CONTROL }}
      >
        <Ionicons name="add" size={22} color={colors.mutedForeground} />
      </Pressable>

      <View
        className="flex-1 justify-center rounded-full bg-section px-4 dark:bg-d-surface"
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

      <Pressable
        onPress={submit}
        disabled={disabled}
        hitSlop={6}
        className="items-center justify-center rounded-full"
        style={{
          width: CONTROL,
          height: CONTROL,
          backgroundColor: disabled ? colors.section : colors.primary,
        }}
      >
        <Ionicons
          name="send"
          size={18}
          color={disabled ? colors.mutedForeground : colors.white}
        />
      </Pressable>
    </View>
  );
}
