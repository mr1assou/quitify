import { View } from "react-native";

import { LinkifiedTextInput } from "@/components/ui/LinkifiedTextInput";
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
      <LinkifiedTextInput
        value={value}
        onChangeText={(text) => onChangeText(text.slice(0, POST_TITLE_MAX))}
        placeholder="Title"
        placeholderTextColor={colors.mutedForeground}
        overlayStyle={{
          color: colors.foreground,
          fontSize: 20,
          fontWeight: "700",
        }}
        style={{
          fontSize: 20,
          fontWeight: "700",
          padding: 0,
        }}
        maxLength={POST_TITLE_MAX}
      />
    </View>
  );
}
