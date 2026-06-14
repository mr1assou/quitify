import { View } from "react-native";

import { useApp } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";
import type { CommentReplyTarget, CommunityUser, PostComment, PostVote } from "@/types/community";
import { resolveCommentPermissions } from "@/utils/community/resolveCommentPermissions";
import { resolveCommunityAuthor } from "@/utils/community/resolveCommunityAuthor";

import { CommentRow } from "./CommentRow";

type Props = {
  comments: PostComment[];
  postAuthorId: string;
  authorsById: Record<string, CommunityUser>;
  onlineByUserId: Record<number, boolean>;
  presenceReady: boolean;
  currentAccountUserId?: number | null;
  onReply: (target: CommentReplyTarget) => void;
  onVote: (commentId: string, vote: PostVote) => void;
  onEdit: (commentId: string, text: string) => Promise<boolean>;
  onDelete: (commentId: string) => Promise<boolean>;
};

function sortByCreatedAt(comments: PostComment[]): PostComment[] {
  return [...comments].sort((a, b) => a.createdAt - b.createdAt);
}

function CommentThreadBranch({
  comments,
  postAuthorId,
  authorsById,
  currentUserImageUrl,
  onlineByUserId,
  presenceReady,
  parentId,
  depth,
  threadColor,
  currentAccountUserId,
  onReply,
  onVote,
  onEdit,
  onDelete,
}: {
  comments: PostComment[];
  postAuthorId: string;
  authorsById: Record<string, CommunityUser>;
  currentUserImageUrl?: string;
  onlineByUserId: Record<number, boolean>;
  presenceReady: boolean;
  currentAccountUserId?: number | null;
  parentId: string | null;
  depth: number;
  threadColor: string;
  onReply: (target: CommentReplyTarget) => void;
  onVote: (commentId: string, vote: PostVote) => void;
  onEdit: (commentId: string, text: string) => Promise<boolean>;
  onDelete: (commentId: string) => Promise<boolean>;
}) {
  const children = sortByCreatedAt(
    comments.filter((comment) => (comment.parentCommentId ?? null) === parentId),
  );

  return (
    <>
      {children.map((comment) => {
        const author = resolveCommunityAuthor(comment.authorId, {
          authorsById,
          currentUserImageUrl,
          currentAccountUserId,
          onlineByUserId,
          presenceReady,
        });
        if (!author) return null;

        const { canEdit, canDelete } = resolveCommentPermissions(
          comment,
          postAuthorId,
          currentAccountUserId,
        );

        const hasReplies = comments.some(
          (candidate) => candidate.parentCommentId === comment.id,
        );

        return (
          <View key={comment.id}>
            <CommentRow
              comment={comment}
              author={author}
              depth={depth}
              canEdit={canEdit}
              canDelete={canDelete}
              onReply={() =>
                onReply({
                  commentId: comment.id,
                  userId: author.id,
                  handle: author.handle,
                  name: author.name,
                })
              }
              onVote={(vote) => onVote(comment.id, vote)}
              onEdit={(text) => onEdit(comment.id, text)}
              onDelete={() => onDelete(comment.id)}
            />

            {hasReplies ? (
              <View
                style={{
                  marginLeft: 18,
                  paddingLeft: 12,
                  borderLeftWidth: 2,
                  borderLeftColor: threadColor,
                }}
              >
                <CommentThreadBranch
                  comments={comments}
                  postAuthorId={postAuthorId}
                  authorsById={authorsById}
                  currentUserImageUrl={currentUserImageUrl}
                  onlineByUserId={onlineByUserId}
                  presenceReady={presenceReady}
                  currentAccountUserId={currentAccountUserId}
                  parentId={comment.id}
                  depth={depth + 1}
                  threadColor={threadColor}
                  onReply={onReply}
                  onVote={onVote}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </View>
            ) : null}
          </View>
        );
      })}
    </>
  );
}

/** Renders comments as a nested reply tree under each top-level comment. */
export function CommentThreadList({
  comments,
  postAuthorId,
  authorsById,
  onlineByUserId,
  presenceReady,
  currentAccountUserId,
  onReply,
  onVote,
  onEdit,
  onDelete,
}: Props) {
  const { colors } = useTheme();
  const { state: appState } = useApp();

  return (
    <CommentThreadBranch
      comments={comments}
      postAuthorId={postAuthorId}
      authorsById={authorsById}
      currentUserImageUrl={appState.profile?.imageUrl}
      onlineByUserId={onlineByUserId}
      presenceReady={presenceReady}
      currentAccountUserId={currentAccountUserId}
      parentId={null}
      depth={0}
      threadColor={colors.border}
      onReply={onReply}
      onVote={onVote}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
}
