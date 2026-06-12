import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CommunityScrollHeader } from "@/components/feature/community/CommunityScrollHeader";
import { FeedPostSeparator } from "@/components/feature/community/FeedPostSeparator";
import { PostCard } from "@/components/feature/community/PostCard";
import { useCommunityFeed } from "@/hooks/useCommunityFeed";

export default function CommunityScreen() {
  const feed = useCommunityFeed();

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-d-bg" edges={["top"]}>
      <FlatList
        data={feed}
        keyExtractor={(item) => item.post.id}
        ListHeaderComponent={<CommunityScrollHeader />}
        ItemSeparatorComponent={FeedPostSeparator}
        renderItem={({ item }) => (
          <View className="px-6 py-4">
            <PostCard item={item} />
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
