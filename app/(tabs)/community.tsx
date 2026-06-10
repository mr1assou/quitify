import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  CommunitySegmentedTabs,
  type CommunitySection,
} from "@/components/feature/community/CommunitySegmentedTabs";
import { InlinePostComposer } from "@/components/feature/community/InlinePostComposer";
import { PostCard } from "@/components/feature/community/PostCard";
import { UserSearchPanel } from "@/components/feature/community/UserSearchPanel";
import { AppBrandMark } from "@/components/layout/AppBrandMark";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { useTheme } from "@/context/ThemeContext";
import { useChatUnreadTotal } from "@/hooks/useChat";
import { useCommunityFeed } from "@/hooks/useCommunityFeed";

export default function CommunityScreen() {
  const [section, setSection] = useState<CommunitySection>("feed");

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-d-bg" edges={["top"]}>
      <ScreenHeader leading={<AppBrandMark />} />

      {section === "feed" ? (
        <FeedTab section={section} onSectionChange={setSection} />
      ) : section === "post" ? (
        <PostTab section={section} onSectionChange={setSection} onPosted={() => setSection("feed")} />
      ) : (
        <SearchTab section={section} onSectionChange={setSection} />
      )}
    </SafeAreaView>
  );
}

/** Scrolls with content — messages shortcut + Feed / Post / Search tabs. */
function CommunityScrollHeader({
  section,
  onSectionChange,
}: {
  section: CommunitySection;
  onSectionChange: (next: CommunitySection) => void;
}) {
  return (
    <View className="pb-2 pt-3">
      <MessagesEntry />
      <CommunitySegmentedTabs value={section} onChange={onSectionChange} />
    </View>
  );
}

function MessagesEntry() {
  const { colors } = useTheme();
  const unread = useChatUnreadTotal();

  return (
    <Pressable
      onPress={() => router.push("/chats")}
      accessibilityLabel="Open messages"
      className="mx-6 mb-3 flex-row items-center rounded-2xl bg-section px-4 py-3 dark:bg-d-surface"
    >
      <View
        className="h-10 w-10 items-center justify-center rounded-full"
        style={{ backgroundColor: `${colors.primary}22` }}
      >
        <Ionicons name="chatbubbles" size={20} color={colors.primary} />
      </View>
      <View className="ml-3 flex-1">
        <Text className="text-base font-bold text-foreground dark:text-d-text">Messages</Text>
        <Text className="text-xs text-muted-foreground dark:text-d-muted">
          {unread > 0 ? `${unread} unread` : "Chat with other quitters"}
        </Text>
      </View>
      {unread > 0 ? (
        <View
          className="mr-2 min-w-[22px] items-center justify-center rounded-full px-2 py-0.5"
          style={{ backgroundColor: colors.alert }}
        >
          <Text className="text-xs font-bold text-white">{unread}</Text>
        </View>
      ) : null}
      <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
    </Pressable>
  );
}

function FeedPostSeparator() {
  return (
    <View className="mx-6">
      <View className="h-px bg-border dark:bg-d-border" />
    </View>
  );
}

function FeedTab({
  section,
  onSectionChange,
}: {
  section: CommunitySection;
  onSectionChange: (next: CommunitySection) => void;
}) {
  const feed = useCommunityFeed();

  return (
    <FlatList
      data={feed}
      keyExtractor={(item) => item.post.id}
      ListHeaderComponent={
        <CommunityScrollHeader section={section} onSectionChange={onSectionChange} />
      }
      ItemSeparatorComponent={FeedPostSeparator}
      renderItem={({ item }) => (
        <View className="px-6 py-4">
          <PostCard item={item} />
        </View>
      )}
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    />
  );
}

function PostTab({
  section,
  onSectionChange,
  onPosted,
}: {
  section: CommunitySection;
  onSectionChange: (next: CommunitySection) => void;
  onPosted: () => void;
}) {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      <CommunityScrollHeader section={section} onSectionChange={onSectionChange} />
      <View className="px-6 pt-2">
        <InlinePostComposer onPosted={onPosted} />
      </View>
    </ScrollView>
  );
}

function SearchTab({
  section,
  onSectionChange,
}: {
  section: CommunitySection;
  onSectionChange: (next: CommunitySection) => void;
}) {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      <CommunityScrollHeader section={section} onSectionChange={onSectionChange} />
      <UserSearchPanel />
    </ScrollView>
  );
}
