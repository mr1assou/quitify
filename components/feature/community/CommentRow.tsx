import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { UserAvatar } from "@/components/feature/community/UserAvatar";
import { useTheme } from "@/context/ThemeContext";
import type { CommunityUser, PostComment, PostVote } from "@/types/community";
import { formatRelativeTime } from "@/utils/community";
import {
  navigateToSelfPlayerProfile,
  navigateToUserProfile,
} from "@/utils/profile/navigateToUserProfile";

import { CommentVoteActions } from "./CommentVoteActions";

type Props = {
  comment: PostComment;
  author: CommunityUser;
  depth?: number;
  canEdit?: boolean;
  canDelete?: boolean;
  onReply?: () => void;
  onVote?: (vote: PostVote) => void;
  onEdit?: (text: string) => Promise<boolean>;
  onDelete?: () => Promise<boolean>;
};

export function CommentRow({
  comment,
  author,
  depth = 0,
  canEdit = false,
  canDelete = false,
  onReply,
  onVote,
  onEdit,
  onDelete,
}: Props) {
  const { colors } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState(comment.text);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const openProfile = () => {
    if (author.isCurrentUser) {
      navigateToSelfPlayerProfile();
      return;
    }
    navigateToUserProfile(author);
  };

  const mentionHandle = comment.replyToHandle?.trim();
  const showMenu = (canEdit || canDelete) && !isEditing;

  const openMenu = () => {
    const options: Array<{
      text: string;
      style?: "destructive" | "cancel";
      onPress?: () => void;
    }> = [];

    if (canEdit && onEdit) {
      options.push({
        text: "Edit",
        onPress: () => {
          setDraftText(comment.text);
          setIsEditing(true);
        },
      });
    }

    if (canDelete && onDelete) {
      options.push({
        text: "Delete",
        style: "destructive",
        onPress: () => {
          Alert.alert("Delete comment?", "This cannot be undone.", [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete",
              style: "destructive",
              onPress: () => {
                setDeleting(true);
                void onDelete()
                  .then((ok) => {
                    if (!ok) {
                      Alert.alert("Could not delete comment", "Please try again.");
                    }
                  })
                  .finally(() => setDeleting(false));
              },
            },
          ]);
        },
      });
    }

    options.push({ text: "Cancel", style: "cancel" });
    Alert.alert("Comment options", undefined, options);
  };

  const saveEdit = async () => {
    const trimmed = draftText.trim();
    if (!trimmed || !onEdit || saving) return;

    setSaving(true);
    try {
      const ok = await onEdit(trimmed);
      if (ok) {
        setIsEditing(false);
      } else {
        Alert.alert("Could not update comment", "Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="flex-row items-start py-2">
      <Pressable onPress={openProfile} hitSlop={6} accessibilityRole="button">
        <UserAvatar user={author} size={depth > 0 ? 30 : 36} />
      </Pressable>

      <View className="ml-3 min-w-0 flex-1">
        <View className="rounded-2xl bg-section p-3 dark:bg-d-surface">
          <View className="flex-row items-center">
            <Pressable onPress={openProfile} hitSlop={4} className="min-w-0 flex-1">
              <Text className="text-sm font-bold text-primary" numberOfLines={1}>
                @{author.handle}
              </Text>
            </Pressable>
            <Text className="ml-2 shrink-0 text-xs text-muted-foreground dark:text-d-muted">
              {formatRelativeTime(comment.createdAt)}
            </Text>
            {showMenu ? (
              <Pressable
                onPress={openMenu}
                hitSlop={8}
                disabled={deleting}
                className="ml-1 h-6 w-6 items-center justify-center"
              >
                {deleting ? (
                  <ActivityIndicator size="small" color={colors.mutedForeground} />
                ) : (
                  <Ionicons name="ellipsis-horizontal" size={16} color={colors.mutedForeground} />
                )}
              </Pressable>
            ) : null}
          </View>

          {isEditing ? (
            <>
              <TextInput
                value={draftText}
                onChangeText={setDraftText}
                editable={!saving}
                multiline
                autoFocus
                placeholderTextColor={colors.mutedForeground}
                style={{
                  color: colors.foreground,
                  marginTop: 8,
                  fontSize: 14,
                  lineHeight: 20,
                  maxHeight: 120,
                  opacity: saving ? 0.6 : 1,
                }}
              />
              <View className="mt-2 flex-row items-center gap-3">
                <Pressable
                  onPress={() => void saveEdit()}
                  disabled={saving || draftText.trim().length === 0}
                  hitSlop={6}
                >
                  <Text
                    className={`text-xs font-bold ${saving || draftText.trim().length === 0 ? "text-muted-foreground" : "text-primary"}`}
                  >
                    Save
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setDraftText(comment.text);
                    setIsEditing(false);
                  }}
                  disabled={saving}
                  hitSlop={6}
                >
                  <Text className="text-xs font-semibold text-muted-foreground dark:text-d-muted">
                    Cancel
                  </Text>
                </Pressable>
              </View>
            </>
          ) : (
            <Text className="mt-1 text-sm leading-5 text-foreground dark:text-d-text">
              {mentionHandle ? (
                <>
                  <Text className="font-semibold text-primary">@{mentionHandle} </Text>
                  {comment.text}
                </>
              ) : (
                comment.text
              )}
            </Text>
          )}
        </View>

        {!isEditing && (onReply || onVote) ? (
          <View className="mt-1 flex-row items-center gap-3 px-1">
            {onVote ? (
              <CommentVoteActions
                upvoteCount={comment.upvoteCount}
                downvoteCount={comment.downvoteCount}
                myVote={comment.myVote}
                onVote={onVote}
              />
            ) : null}

            {onReply ? (
              <Pressable onPress={onReply} hitSlop={6} className="py-1">
                <Text className="text-xs font-semibold text-muted-foreground dark:text-d-muted">
                  Reply
                </Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}
      </View>
    </View>
  );
}
