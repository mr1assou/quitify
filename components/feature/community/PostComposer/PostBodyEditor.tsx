import { useEffect, useState } from "react";
import { TextInput, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";

import { PostAddPhotosChip } from "./PostAddPhotosChip";

const BODY_FONT_SIZE = 15;
const BODY_LINE_HEIGHT = 22;
const BODY_MIN_HEIGHT = BODY_LINE_HEIGHT * 2;

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onPickImages: () => void;
};

export function PostBodyEditor({ value, onChangeText, onPickImages }: Props) {
  const { colors } = useTheme();
  const [inputHeight, setInputHeight] = useState(BODY_MIN_HEIGHT);

  useEffect(() => {
    if (!value) setInputHeight(BODY_MIN_HEIGHT);
  }, [value]);

  return (
    <View className="mx-5 mt-2 px-1">
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Body text (optional)"
        placeholderTextColor={colors.mutedForeground}
        multiline
        textAlignVertical="top"
        scrollEnabled={false}
        onContentSizeChange={(event) => {
          const nextHeight = event.nativeEvent.contentSize.height;
          setInputHeight(Math.max(BODY_MIN_HEIGHT, Math.ceil(nextHeight)));
        }}
        style={{
          color: colors.foreground,
          fontSize: BODY_FONT_SIZE,
          lineHeight: BODY_LINE_HEIGHT,
          height: inputHeight,
          padding: 0,
        }}
      />

      <PostAddPhotosChip onPress={onPickImages} className="mt-3" embedded />
    </View>
  );
}
