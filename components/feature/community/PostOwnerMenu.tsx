import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable } from "react-native";

import {
  PostActionModals,
  type PostModalState,
} from "@/components/feature/community/PostActionModals";
import { useCommunity } from "@/context/CommunityContext";
import { useTheme } from "@/context/ThemeContext";
import { deletePost as deletePostApi } from "@/services/posts/postsApi";

type Props = {
  postId: string;
};

export function PostOwnerMenu({ postId }: Props) {
  const { colors } = useTheme();
  const { deletePost } = useCommunity();
  const [modal, setModal] = useState<PostModalState | null>(null);

  const closeModal = () => setModal(null);

  const onEdit = () => {
    closeModal();
    router.push(`/post-composer?editId=${postId}`);
  };

  const onConfirmDelete = () => {
    setModal({ type: "deleting" });
    void deletePostApi(postId)
      .then(() => {
        deletePost(postId);
        closeModal();
      })
      .catch(() => {
        setModal({
          type: "error",
          title: "Could not delete post",
          message: "Please try again.",
        });
      });
  };

  return (
    <>
      <Pressable
        hitSlop={8}
        onPress={() => setModal({ type: "options" })}
        className="ml-2 h-9 w-9 items-center justify-center rounded-full"
      >
        <Ionicons name="ellipsis-horizontal" size={20} color={colors.mutedForeground} />
      </Pressable>

      <PostActionModals
        state={modal}
        onClose={closeModal}
        onEdit={onEdit}
        onRequestDelete={() => setModal({ type: "confirmDelete" })}
        onConfirmDelete={onConfirmDelete}
      />
    </>
  );
}
