import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { UserAvatar } from "@/components/feature/community/UserAvatar";
import { Card } from "@/components/ui/Card";
import { useCommunity } from "@/context/CommunityContext";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  /** Called after a post is successfully created. */
  onPosted?: () => void;
};

const ME = { isCurrentUser: true, name: "You" } as const;

/** Inline post composer used inside the Community → Post tab. */
export function InlinePostComposer({ onPosted }: Props) {
  const { addPost } = useCommunity();
  const { colors } = useTheme();
  const [text, setText] = useState("");
  const [attachImage, setAttachImage] = useState(false);

  const canPost = text.trim().length > 0 || attachImage;

  const submit = () => {
    if (!canPost) return;
    addPost({ text, imageKey: attachImage ? "default" : undefined });
    setText("");
    setAttachImage(false);
    onPosted?.();
  };

  return (
    <Card
      variant="surface"
      padded={false}
      className="border border-section dark:border-d-border"
    >
      <View className="flex-row items-start p-4">
        <UserAvatar user={ME} size={44} />
        <View className="ml-3 flex-1">
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Share a win, a craving, a thought…"
            placeholderTextColor={colors.mutedForeground}
            multiline
            style={{
              color: colors.foreground,
              fontSize: 16,
              lineHeight: 22,
              minHeight: 88,
            }}
          />
        </View>
      </View>

      {attachImage ? (
        <View className="mx-4 mb-3 overflow-hidden rounded-2xl bg-section dark:bg-d-surface">
          <View className="aspect-[4/3] items-center justify-center">
            <Ionicons name="image" size={56} color={colors.mutedForeground} />
            <Text className="mt-2 text-sm text-muted-foreground dark:text-d-muted">
              Image attached (preview)
            </Text>
          </View>
          <Pressable
            onPress={() => setAttachImage(false)}
            className="absolute right-2 top-2 h-9 w-9 items-center justify-center rounded-full bg-black/60"
          >
            <Ionicons name="close" size={18} color="white" />
          </Pressable>
        </View>
      ) : null}

      <View className="gap-3 border-t border-section px-4 py-3 dark:border-d-border">
        <View className="flex-row gap-2">
          <AttachChip
            icon="image"
            label="Photo"
            color={colors.primary}
            onPress={() => setAttachImage(true)}
          />
          <AttachChip
            icon="videocam"
            label="Video"
            color={colors.accent}
            onPress={() => setAttachImage(true)}
          />
          <AttachChip
            icon="happy"
            label="Win"
            color={colors.alert}
            onPress={() => setText((t) => `${t} 🎉`)}
          />
        </View>
        <Pressable
          onPress={submit}
          disabled={!canPost}
          style={{ opacity: canPost ? 1 : 0.4 }}
          className="items-center rounded-full bg-primary py-2.5"
        >
          <Text className="text-sm font-bold text-white">Post</Text>
        </Pressable>
      </View>
    </Card>
  );
}

function AttachChip({
  icon,
  label,
  color,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      className="min-w-0 flex-1 flex-row items-center justify-center rounded-xl py-2.5"
      style={{ backgroundColor: `${color}18` }}
    >
      <Ionicons name={icon} size={16} color={color} />
      <Text className="ml-1.5 text-xs font-semibold" style={{ color }}>
        {label}
      </Text>
    </Pressable>
  );
}
