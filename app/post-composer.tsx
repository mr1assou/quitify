import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { UserAvatar } from "@/components/feature/community/UserAvatar";
import { useCommunity } from "@/context/CommunityContext";
import { useTheme } from "@/context/ThemeContext";

export default function PostComposerScreen() {
  const { addPost } = useCommunity();
  const { colors } = useTheme();
  const [text, setText] = useState("");
  const [attachImage, setAttachImage] = useState(false);

  const canPost = text.trim().length > 0 || attachImage;

  const onPost = () => {
    if (!canPost) return;
    addPost({ text, imageKey: attachImage ? "default" : undefined });
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-d-bg" edges={["top"]}>
      <View className="flex-row items-center justify-between px-4 py-3">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="close" size={26} color={colors.foreground} />
        </Pressable>
        <Text className="text-base font-bold text-foreground dark:text-d-text">New post</Text>
        <Pressable
          onPress={onPost}
          disabled={!canPost}
          style={{ opacity: canPost ? 1 : 0.4 }}
          className="rounded-full bg-primary px-4 py-1.5"
        >
          <Text className="text-sm font-bold text-white">Post</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
          <View className="flex-row items-start">
            <UserAvatar user={{ isCurrentUser: true, name: "You" }} size={44} />
            <View className="ml-3 flex-1">
              <TextInput
                value={text}
                onChangeText={setText}
                placeholder="Share a win, a craving, a thought…"
                placeholderTextColor={colors.mutedForeground}
                multiline
                autoFocus
                style={{
                  color: colors.foreground,
                  fontSize: 17,
                  lineHeight: 24,
                  minHeight: 120,
                }}
              />
            </View>
          </View>

          {attachImage ? (
            <View className="mt-4 overflow-hidden rounded-2xl bg-section dark:bg-d-surface">
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
        </ScrollView>

        <View className="flex-row items-center gap-3 border-t border-section px-6 py-3 dark:border-d-border">
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
      </KeyboardAvoidingView>
    </SafeAreaView>
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
      className="flex-row items-center rounded-full px-3 py-2"
      style={{ backgroundColor: `${color}20` }}
    >
      <Ionicons name={icon} size={16} color={color} />
      <Text className="ml-1.5 text-sm font-bold" style={{ color }}>
        {label}
      </Text>
    </Pressable>
  );
}
