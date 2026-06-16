import { Pressable, Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import type { PostMediaFrame } from "@/types/community/community";

import { POST_IMAGE_FRAMES } from "./constants";

type Props = {
  value: PostMediaFrame;
  onChange: (frame: PostMediaFrame) => void;
};

export function PostMediaFramePicker({ value, onChange }: Props) {
  const { colors } = useTheme();

  return (
    <View className="flex-row flex-wrap gap-2">
      {POST_IMAGE_FRAMES.map((frame) => {
        const active = value === frame.id;
        return (
          <Pressable
            key={frame.id}
            onPress={() => onChange(frame.id)}
            className="rounded-full border px-3 py-1.5"
            style={{
              borderColor: active ? colors.primary : colors.mutedForeground,
              backgroundColor: active ? `${colors.primary}18` : "transparent",
            }}
          >
            <Text
              className="text-xs font-semibold"
              style={{ color: active ? colors.primary : colors.mutedForeground }}
            >
              {frame.label} · {frame.hint}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
