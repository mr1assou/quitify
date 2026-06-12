import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { ChatListRow } from "@/components/feature/chat/ChatListRow";
import { StackScreenHeader } from "@/components/layout/StackScreenHeader";
import { useTheme } from "@/context/ThemeContext";
import { useChatThreads } from "@/hooks/useChat";

export default function ChatsScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const threads = useChatThreads();
  const listBottom = Math.max(insets.bottom, 16) + 16;

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-d-bg" edges={["top", "bottom"]}>
      <StackScreenHeader
        title="Chats"
        rightAction={
          <Pressable
            onPress={() => router.push("/community-search")}
            hitSlop={8}
            accessibilityLabel="Find user"
          >
            <Ionicons name="search-outline" size={22} color={colors.primary} />
          </Pressable>
        }
      />

      <FlatList
        data={threads}
        keyExtractor={(t) => t.threadId}
        ItemSeparatorComponent={() => (
          <View className="mx-6 h-px bg-section dark:bg-d-border" />
        )}
        renderItem={({ item }) => <ChatListRow preview={item} />}
        ListEmptyComponent={
          <View className="items-center px-6 pt-16">
            <Ionicons name="chatbubbles-outline" size={48} color={colors.mutedForeground} />
            <Text className="mt-3 text-center text-base font-semibold text-foreground dark:text-d-text">
              No chats yet
            </Text>
            <Text className="mt-1 text-center text-sm text-muted-foreground dark:text-d-muted">
              Search a profile from the Community tab to start a chat.
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: listBottom }}
      />
    </SafeAreaView>
  );
}
