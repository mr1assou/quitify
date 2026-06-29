import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable } from "react-native";

import {
  PostModerationModals,
  type PostModerationModalState,
} from "@/components/feature/community/PostModerationModals";
import { useCommunity } from "@/context/CommunityContext";
import { useTheme } from "@/context/ThemeContext";
import { moderatePost as moderatePostApi } from "@/services/posts/postsApi";

type Props = {
  postId: string;
};

/** Support staff moderation entry on community feed posts. */
export function PostModeratorMenu({ postId }: Props) {
  const { colors } = useTheme();
  const { moderatePost } = useCommunity();
  const [modal, setModal] = useState<PostModerationModalState | null>(null);

  const closeModal = () => setModal(null);

  const onConfirmRemove = () => {
    setModal({ type: "removing" });
    void moderatePostApi(postId)
      .then(() => {
        moderatePost(postId);
        closeModal();
      })
      .catch(() => {
        setModal({
          type: "error",
          title: "Could not remove post",
          message: "Please try again.",
        });
      });
  };

  return (
    <>
      <Pressable
        hitSlop={8}
        onPress={() => setModal({ type: "confirm" })}
        className="ml-2 h-9 w-9 items-center justify-center rounded-full"
        accessibilityLabel="Moderate post"
      >
        <Ionicons name="shield-outline" size={20} color={colors.alert} />
      </Pressable>

      <PostModerationModals
        state={modal}
        onClose={closeModal}
        onConfirmRemove={onConfirmRemove}
      />
    </>
  );
}
