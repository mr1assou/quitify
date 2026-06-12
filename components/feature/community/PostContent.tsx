import { Pressable, View } from "react-native";

import type { CommunityPost } from "@/types/community";

import { PostMediaGallery, type PostMediaGalleryVariant } from "./PostMediaGallery";
import { PostTagBadge } from "./PostTagBadge";
import { PostTextContent } from "./PostTextContent";

type Props = {
  post: CommunityPost;
  onPress?: () => void;
  className?: string;
  mediaVariant?: PostMediaGalleryVariant;
};

export function PostContent({
  post,
  onPress,
  className = "mt-3",
  mediaVariant = "feed",
}: Props) {
  const hasText = Boolean(post.title || post.text);
  const hasMedia = Boolean(post.media?.length);
  const isDetail = mediaVariant === "detail";

  return (
    <>
      {post.tagId || hasText ? (
        <Pressable onPress={onPress} disabled={!onPress} className={className}>
          {post.tagId ? <PostTagBadge tagId={post.tagId} className="mb-2" /> : null}
          {hasText ? <PostTextContent title={post.title} text={post.text} /> : null}
        </Pressable>
      ) : null}

      {hasMedia ? (
        isDetail ? (
          <View className={`-mx-6 ${hasText ? "mt-3" : className}`}>
            <PostMediaGallery media={post.media!} variant="detail" />
          </View>
        ) : (
          <Pressable onPress={onPress} disabled={!onPress} className={className}>
            <PostMediaGallery media={post.media!} variant="feed" />
          </Pressable>
        )
      ) : null}
    </>
  );
}
