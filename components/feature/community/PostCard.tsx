import { View } from "react-native";

import { useCommunity } from "@/context/CommunityContext";
import type { FeedItem } from "@/types/community/community";
import { safeRouter } from "@/utils/app/safeRouter";
import { resolveCommentCount } from "@/utils/community/postEngagement";

import { PostActions } from "./PostActions";
import { PostHeader } from "./PostHeader";
import { PostOwnerMenu } from "./PostOwnerMenu";
import { PostContent } from "./PostContent";

type Props = {
  item: FeedItem;
  showOwnerActions?: boolean;
};

export function PostCard({ item, showOwnerActions = false }: Props) {
  const { votePost, share } = useCommunity();
  const { post, author } = item;

  const openPost = () => safeRouter.push(`/post/${post.id}`);

  return (
    <View>
      <View className="flex-row items-start">
        <View className="min-w-0 flex-1">
          <PostHeader author={author} createdAt={post.createdAt} />
        </View>
        {showOwnerActions ? <PostOwnerMenu postId={post.id} /> : null}
      </View>

      <PostContent post={post} onPress={openPost} />

      <View className="mt-2">
        <PostActions
          upvoteCount={post.upvoteCount}
          downvoteCount={post.downvoteCount}
          myVote={post.myVote}
          commentCount={resolveCommentCount(post)}
          shareCount={post.shareCount}
          onVote={(vote) => votePost(post.id, vote)}
          onComment={openPost}
          onShare={() => share(post.id)}
        />
      </View>
    </View>
  );
}
