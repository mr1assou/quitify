import { View } from "react-native";

import { useCommunity } from "@/context/CommunityContext";
import type { FeedItem } from "@/types/community/community";
import { safeRouter } from "@/utils/app/safeRouter";
import { resolveCommentCount } from "@/utils/community/postEngagement";

import { ModeratedPostCard } from "./ModeratedPostCard";
import { PostActions } from "./PostActions";
import { PostHeader } from "./PostHeader";
import { PostModeratorMenu } from "./PostModeratorMenu";
import { PostOwnerMenu } from "./PostOwnerMenu";
import { PostReportMenu } from "./PostReportMenu";
import { PostContent } from "./PostContent";

type Props = {
  item: FeedItem;
  showOwnerActions?: boolean;
  showModeratorActions?: boolean;
  showReportAction?: boolean;
};

export function PostCard({
  item,
  showOwnerActions = false,
  showModeratorActions = false,
  showReportAction = false,
}: Props) {
  const { votePost } = useCommunity();
  const { post, author } = item;

  if (post.moderated) {
    return <ModeratedPostCard item={item} />;
  }

  const openPost = () => safeRouter.push(`/post/${post.id}`);

  return (
    <View>
      <View className="flex-row items-start">
        <View className="min-w-0 flex-1">
          <PostHeader author={author} createdAt={post.createdAt} />
        </View>
        {showOwnerActions ? <PostOwnerMenu postId={post.id} /> : null}
        {showModeratorActions ? <PostModeratorMenu postId={post.id} /> : null}
        {showReportAction ? <PostReportMenu postId={post.id} /> : null}
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
          onShare={() =>
            safeRouter.pushStack({ pathname: "/share-post/[id]", params: { id: post.id } })
          }
        />
      </View>
    </View>
  );
}
