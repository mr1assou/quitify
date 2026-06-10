import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { getCommunityUser } from "@/constants/communityUsers";
import { useCommunity } from "@/context/CommunityContext";
import type { FeedItem } from "@/types/community";

import { CommentComposer } from "./CommentComposer";
import { CommentRow } from "./CommentRow";
import { PostActions } from "./PostActions";
import { PostHeader } from "./PostHeader";
import { PostMedia } from "./PostMedia";

type Props = {
  item: FeedItem;
};

export function PostCard({ item }: Props) {
  const { toggleLike, share, addComment, state } = useCommunity();
  const { post, author } = item;
  const [commentsOpen, setCommentsOpen] = useState(false);

  const comments = useMemo(() => {
    return post.commentIds
      .map((cid) => state.commentsById[cid])
      .filter(Boolean)
      .map((comment) => {
        const cAuthor = getCommunityUser(comment.authorId);
        return cAuthor ? { comment, author: cAuthor } : null;
      })
      .filter((c): c is NonNullable<typeof c> => c !== null);
  }, [post.commentIds, state.commentsById]);

  const openPost = () => router.push(`/post/${post.id}`);

  const onCommentPress = () => {
    setCommentsOpen((open) => !open);
  };

  return (
    <View>
      <PostHeader author={author} createdAt={post.createdAt} />

      {post.text ? (
        <Pressable onPress={openPost} className="mt-3">
          <Text className="text-base leading-6 text-foreground dark:text-d-text">{post.text}</Text>
        </Pressable>
      ) : null}

      {post.media ? (
        <Pressable onPress={openPost} className="mt-3">
          <PostMedia media={post.media} />
        </Pressable>
      ) : null}

      <View className="mt-2">
        <PostActions
          likeCount={post.likeCount}
          likedByMe={post.likedByMe}
          commentCount={post.commentIds.length}
          shareCount={post.shareCount}
          commentsActive={commentsOpen}
          onToggleLike={() => toggleLike(post.id)}
          onComment={onCommentPress}
          onShare={() => share(post.id)}
        />

        {commentsOpen ? (
          <View className="mt-3 border-t border-border pt-3 dark:border-d-border">
            {comments.length === 0 ? (
              <Text className="pb-2 text-center text-sm text-muted-foreground dark:text-d-muted">
                No comments yet. Be the first.
              </Text>
            ) : (
              comments.map(({ comment, author: cAuthor }) => (
                <CommentRow key={comment.id} comment={comment} author={cAuthor} />
              ))
            )}
            <View className="mt-2">
              <CommentComposer
                placeholder="Add a comment…"
                onSubmit={(text) => addComment(post.id, text)}
              />
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
}
