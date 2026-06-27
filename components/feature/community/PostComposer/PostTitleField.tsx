import { useEffect, useState } from "react";
import { View } from "react-native";

import { LinkifiedTextInput } from "@/components/ui/LinkifiedTextInput";
import { useTheme } from "@/context/ThemeContext";

import { POST_TITLE_MAX } from "./constants";

const TITLE_FONT_SIZE = 20;
const TITLE_LINE_HEIGHT = 26;
const TITLE_MIN_HEIGHT = TITLE_LINE_HEIGHT;

type Props = {
  value: string;
  onChangeText: (text: string) => void;
};

export function PostTitleField({ value, onChangeText }: Props) {
  const { colors } = useTheme();
  const [inputHeight, setInputHeight] = useState(TITLE_MIN_HEIGHT);

  useEffect(() => {
    if (!value) setInputHeight(TITLE_MIN_HEIGHT);
  }, [value]);

  return (
    <View className="mx-5 mt-4 px-1">
      <LinkifiedTextInput
        value={value}
        onChangeText={(text) =>
          onChangeText(text.replace(/\n/g, " ").slice(0, POST_TITLE_MAX))
        }
        placeholder="Title"
        placeholderTextColor={colors.mutedForeground}
        multiline
        scrollEnabled={false}
        onContentSizeChange={(event) => {
          const nextHeight = event.nativeEvent.contentSize.height;
          setInputHeight(Math.max(TITLE_MIN_HEIGHT, Math.ceil(nextHeight)));
        }}
        overlayStyle={{
          color: colors.foreground,
          fontSize: TITLE_FONT_SIZE,
          fontWeight: "700",
          lineHeight: TITLE_LINE_HEIGHT,
        }}
        style={{
          fontSize: TITLE_FONT_SIZE,
          fontWeight: "700",
          lineHeight: TITLE_LINE_HEIGHT,
          height: inputHeight,
          padding: 0,
        }}
        maxLength={POST_TITLE_MAX}
      />
    </View>
  );
}
