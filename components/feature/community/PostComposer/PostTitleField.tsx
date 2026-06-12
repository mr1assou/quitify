import { TextInput, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";

import { POST_TITLE_MAX } from "./constants";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
};

export function PostTitleField({ value, onChangeText }: Props) {
  const { colors } = useTheme();

  return (
    <View className="mx-5 mt-4 px-1">
      <TextInput
        value={value}
        onChangeText={(text) => onChangeText(text.slice(0, POST_TITLE_MAX))}
        placeholder="Title"
        placeholderTextColor={colors.mutedForeground}
        style={{
          color: colors.foreground,
          fontSize: 20,
          fontWeight: "700",
          padding: 0,
        }}
        maxLength={POST_TITLE_MAX}
      />
    </View>
  );
}
