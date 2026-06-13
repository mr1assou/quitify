import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Alert, Pressable } from "react-native";

import { useCommunity } from "@/context/CommunityContext";
import { useTheme } from "@/context/ThemeContext";
import { deletePost as deletePostApi } from "@/services/posts/postsApi";

type Props = {
  postId: string;
};

export function PostOwnerMenu({ postId }: Props) {
  const { colors } = useTheme();
  const { deletePost } = useCommunity();

  const onEdit = () => {
    router.push(`/post-composer?editId=${postId}`);
  };

  const onDelete = () => {
    Alert.alert("Delete post?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          void deletePostApi(postId)
            .then(() => deletePost(postId))
            .catch(() => Alert.alert("Could not delete post", "Please try again."));
        },
      },
    ]);
  };

  return (
    <Pressable
      hitSlop={8}
      onPress={() =>
        Alert.alert("Post options", undefined, [
          { text: "Edit", onPress: onEdit },
          { text: "Delete", style: "destructive", onPress: onDelete },
          { text: "Cancel", style: "cancel" },
        ])
      }
      className="ml-2 h-9 w-9 items-center justify-center rounded-full"
    >
      <Ionicons name="ellipsis-horizontal" size={20} color={colors.mutedForeground} />
    </Pressable>
  );
}
