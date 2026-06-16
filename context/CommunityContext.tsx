import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";

import { useApp } from "@/context/AppContext";
import { CURRENT_USER_ID } from "@/constants/community/communityUsers";
import {
  fetchChatMessages,
  fetchChatThreads,
  markChatThreadRead,
  openChatThread as openChatThreadApi,
  sendChatMessage as sendChatMessageApi,
} from "@/services/chat/chatApi";
import { uploadChatMediaToR2 } from "@/services/chat/uploadChatMedia";
import {
  createPostComment,
  deletePostComment,
  fetchPostComments,
  sharePost as sharePostApi,
  updatePost as updatePostApi,
  updatePostComment,
  voteOnComment,
  voteOnPost,
} from "@/services/posts/postsApi";
import type { ChatMessage, ChatThread } from "@/types/chat/chat";
import type { CommunityPost, CommunityUser, PostComment, PostVote } from "@/types/community/community";
import type { BackendPostCommentEngagement, BackendPostEngagement } from "@/types/community/postsApi";
import {
  mapBackendComment,
  mapCommentAuthorToCommunityUser,
  mapCommentsFromApi,
} from "@/utils/community/mapBackendComment";
import { applyEngagementToPost } from "@/utils/community/postEngagement";
import { applyPostVote } from "@/utils/community/postVote";
import { mergeUpdatedPost } from "@/utils/community/mergeUpdatedPost";
import {
  mapBackendMessage,
  mapBackendThreadSummary,
} from "@/utils/chat/mapBackendChat";
import type { ChatMediaPick } from "@/components/feature/chat/usePickChatMedia";
import { parseDbUserId } from "@/utils/community/presence";
import { applyCommentEngagement, applyCommentVote } from "@/utils/community/commentVote";
import type { CommentReplyTarget } from "@/types/community/community";
import { hasLoadedPostComments, countLoadedPostComments } from "@/utils/community/resolvePostCommentIds";
import type { UpdatePostPayload } from "@/types/community/updatePost";

type State = {
  posts: CommunityPost[];
  authorsById: Record<string, CommunityUser>;
  commentsById: Record<string, PostComment>;
  threads: ChatThread[];
  messagesById: Record<string, ChatMessage>;
  /** Live presence keyed by database user id (from WebSocket / Redis). */
  onlineByUserId: Record<number, boolean>;
  /** True after the first presence:snapshot from the server. */
  presenceReady: boolean;
  commentsLoadedByPostId: Record<string, boolean>;
  commentsHasMoreByPostId: Record<string, boolean>;
  commentsLoadingMoreByPostId: Record<string, boolean>;
  commentsLoadingByPostId: Record<string, boolean>;
};

type Action =
  | { type: "VOTE_POST"; postId: string; vote: PostVote }
  | { type: "SYNC_ENGAGEMENT"; postId: string; engagement: BackendPostEngagement }
  | { type: "SHARE"; postId: string }
  | { type: "ADD_COMMENT"; post: PostComment; author: CommunityUser }
  | { type: "UPDATE_COMMENT"; comment: PostComment; author: CommunityUser }
  | {
      type: "DELETE_COMMENTS";
      postId: string;
      commentIds: string[];
      commentCount: number;
    }
  | {
      type: "SET_POST_COMMENTS";
      postId: string;
      comments: PostComment[];
      authorsById: Record<string, CommunityUser>;
      hasMore: boolean;
    }
  | {
      type: "APPEND_POST_COMMENTS";
      postId: string;
      comments: PostComment[];
      authorsById: Record<string, CommunityUser>;
      hasMore: boolean;
    }
  | { type: "SET_COMMENTS_LOADING_MORE"; postId: string; loading: boolean }
  | { type: "SET_COMMENTS_LOADING"; postId: string; loading: boolean }
  | { type: "ADD_POST"; post: CommunityPost; author?: CommunityUser }
  | {
      type: "SET_POSTS";
      posts: CommunityPost[];
      authorsById: Record<string, CommunityUser>;
    }
  | {
      type: "APPEND_POSTS";
      posts: CommunityPost[];
      authorsById: Record<string, CommunityUser>;
    }
  | { type: "UPDATE_POST"; post: CommunityPost }
  | { type: "DELETE_POST"; postId: string }
  | { type: "PATCH_AUTHOR"; authorId: string; patch: Partial<CommunityUser> }
  | { type: "SET_PRESENCE_SNAPSHOT"; onlineUserIds: number[] }
  | { type: "PATCH_PRESENCE"; userId: number; isOnline: boolean }
  | { type: "CLEAR_PRESENCE" }
  | { type: "UPSERT_AUTHOR"; author: CommunityUser }
  | {
      type: "HYDRATE_CHAT_THREADS";
      threads: ChatThread[];
      messagesById: Record<string, ChatMessage>;
      authorsById: Record<string, CommunityUser>;
    }
  | {
      type: "UPSERT_CHAT_THREAD";
      thread: ChatThread;
      participant: CommunityUser;
      messages: ChatMessage[];
    }
  | {
      type: "SET_THREAD_MESSAGES";
      threadId: string;
      messages: ChatMessage[];
      hasMore?: boolean;
      peerLastReadAt?: number;
    }
  | {
      type: "APPEND_THREAD_MESSAGES";
      threadId: string;
      messages: ChatMessage[];
      hasMore: boolean;
    }
  | {
      type: "RECEIVE_CHAT_MESSAGE";
      message: ChatMessage;
      participant?: CommunityUser;
    }
  | {
      type: "REPLACE_CHAT_MESSAGE";
      tempId: string;
      message: ChatMessage;
    }
  | { type: "PATCH_COMMENT_VOTE"; commentId: string; vote: PostVote }
  | { type: "SYNC_COMMENT_ENGAGEMENT"; commentId: string; engagement: BackendPostCommentEngagement }
  | { type: "SET_MESSAGES_SEEN"; threadId: string; lastReadAt: number }
  | { type: "MARK_THREAD_READ"; threadId: string }
  | { type: "RESET" };

const initialState: State = {
  posts: [],
  authorsById: {},
  commentsById: {},
  threads: [],
  messagesById: {},
  onlineByUserId: {},
  presenceReady: false,
  commentsLoadedByPostId: {},
  commentsHasMoreByPostId: {},
  commentsLoadingMoreByPostId: {},
  commentsLoadingByPostId: {},
};

function mergeCommunityUser(
  existing: CommunityUser | undefined,
  incoming: CommunityUser,
): CommunityUser {
  if (!existing) return incoming;
  return {
    ...existing,
    ...incoming,
    avatarUrl: incoming.avatarUrl ?? existing.avatarUrl,
  };
}

function mergeAuthorsById(
  base: Record<string, CommunityUser>,
  incoming: Record<string, CommunityUser>,
): Record<string, CommunityUser> {
  const merged = { ...base };
  for (const [id, author] of Object.entries(incoming)) {
    merged[id] = mergeCommunityUser(base[id], author);
  }
  return merged;
}

/** Append new ids while preserving existing order (oldest → newest). */
function mergeMessageIdsPreservingOrder(existing: string[], ...incomingGroups: string[][]): string[] {
  const result = [...existing];
  const seen = new Set(existing);
  for (const group of incomingGroups) {
    for (const id of group) {
      if (seen.has(id)) continue;
      seen.add(id);
      result.push(id);
    }
  }
  return result;
}

/** List/open API only returns last_message — never shrink loaded history. */
function mergeThreadFromSummary(existing: ChatThread | undefined, incoming: ChatThread): ChatThread {
  if (!existing) return incoming;

  return {
    ...existing,
    ...incoming,
    messageIds:
      existing.messageIds.length > 0
        ? mergeMessageIdsPreservingOrder(existing.messageIds, incoming.messageIds)
        : incoming.messageIds,
    hasMoreMessages: existing.hasMoreMessages ?? incoming.hasMoreMessages,
    lastReadAt: existing.lastReadAt,
    peerLastReadAt: incoming.peerLastReadAt ?? existing.peerLastReadAt,
  };
}

function isPendingChatMessageId(id: string): boolean {
  return id.startsWith("temp-");
}

function collectPendingMessageIds(messageIds: string[]): string[] {
  return messageIds.filter(isPendingChatMessageId);
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "VOTE_POST": {
      const posts = state.posts.map((p) =>
        p.id === action.postId ? applyPostVote(p, action.vote) : p,
      );
      return { ...state, posts };
    }

    case "SYNC_ENGAGEMENT": {
      const posts = state.posts.map((p) =>
        p.id === action.postId ? applyEngagementToPost(p, action.engagement) : p,
      );
      return { ...state, posts };
    }

    case "SHARE": {
      const posts = state.posts.map((p) =>
        p.id === action.postId ? { ...p, shareCount: p.shareCount + 1 } : p,
      );
      return { ...state, posts };
    }

    case "ADD_COMMENT": {
      const commentsById = {
        ...state.commentsById,
        [action.post.id]: action.post,
      };
      const authorsById = {
        ...state.authorsById,
        [action.author.id]: action.author,
      };
      const posts = state.posts.map((p) =>
        p.id === action.post.postId
          ? {
              ...p,
              commentIds: [...p.commentIds, action.post.id],
              commentCount: (p.commentCount ?? p.commentIds.length) + 1,
            }
          : p,
      );
      return { ...state, posts, commentsById, authorsById };
    }

    case "UPDATE_COMMENT": {
      const commentsById = {
        ...state.commentsById,
        [action.comment.id]: action.comment,
      };
      const authorsById = {
        ...state.authorsById,
        [action.author.id]: action.author,
      };
      return { ...state, commentsById, authorsById };
    }

    case "DELETE_COMMENTS": {
      const commentsById = { ...state.commentsById };
      for (const commentId of action.commentIds) {
        delete commentsById[commentId];
      }
      const removed = new Set(action.commentIds);
      const posts = state.posts.map((p) =>
        p.id === action.postId
          ? {
              ...p,
              commentIds: p.commentIds.filter((id) => !removed.has(id)),
              commentCount: action.commentCount,
            }
          : p,
      );
      return { ...state, posts, commentsById };
    }

    case "SET_POST_COMMENTS": {
      const commentsById = { ...state.commentsById };
      for (const comment of action.comments) {
        commentsById[comment.id] = comment;
      }
      const posts = state.posts.map((p) =>
        p.id === action.postId
          ? {
              ...p,
              commentIds: action.comments.map((c) => c.id),
            }
          : p,
      );
      return {
        ...state,
        posts,
        commentsById,
        authorsById: { ...state.authorsById, ...action.authorsById },
        commentsLoadedByPostId: {
          ...state.commentsLoadedByPostId,
          [action.postId]: true,
        },
        commentsHasMoreByPostId: {
          ...state.commentsHasMoreByPostId,
          [action.postId]: action.hasMore,
        },
        commentsLoadingMoreByPostId: {
          ...state.commentsLoadingMoreByPostId,
          [action.postId]: false,
        },
      };
    }

    case "APPEND_POST_COMMENTS": {
      const commentsById = { ...state.commentsById };
      for (const comment of action.comments) {
        commentsById[comment.id] = comment;
      }
      const posts = state.posts.map((p) => {
        if (p.id !== action.postId) return p;
        const mergedIds = [...p.commentIds];
        for (const comment of action.comments) {
          if (!mergedIds.includes(comment.id)) {
            mergedIds.push(comment.id);
          }
        }
        return { ...p, commentIds: mergedIds };
      });
      return {
        ...state,
        posts,
        commentsById,
        authorsById: { ...state.authorsById, ...action.authorsById },
        commentsHasMoreByPostId: {
          ...state.commentsHasMoreByPostId,
          [action.postId]: action.hasMore,
        },
        commentsLoadingMoreByPostId: {
          ...state.commentsLoadingMoreByPostId,
          [action.postId]: false,
        },
      };
    }

    case "SET_COMMENTS_LOADING_MORE":
      return {
        ...state,
        commentsLoadingMoreByPostId: {
          ...state.commentsLoadingMoreByPostId,
          [action.postId]: action.loading,
        },
      };

    case "SET_COMMENTS_LOADING":
      return {
        ...state,
        commentsLoadingByPostId: {
          ...state.commentsLoadingByPostId,
          [action.postId]: action.loading,
        },
      };

    case "PATCH_COMMENT_VOTE": {
      const existing = state.commentsById[action.commentId];
      if (!existing) return state;
      return {
        ...state,
        commentsById: {
          ...state.commentsById,
          [action.commentId]: applyCommentVote(existing, action.vote),
        },
      };
    }

    case "SYNC_COMMENT_ENGAGEMENT": {
      const existing = state.commentsById[action.commentId];
      if (!existing) return state;
      return {
        ...state,
        commentsById: {
          ...state.commentsById,
          [action.commentId]: applyCommentEngagement(existing, action.engagement),
        },
      };
    }

    case "ADD_POST": {
      const authorsById = action.author
        ? { ...state.authorsById, [action.author.id]: action.author }
        : state.authorsById;
      return { ...state, posts: [action.post, ...state.posts], authorsById };
    }

    case "SET_POSTS": {
      return {
        ...state,
        posts: action.posts,
        authorsById: { ...state.authorsById, ...action.authorsById },
      };
    }

    case "APPEND_POSTS": {
      const existingIds = new Set(state.posts.map((post) => post.id));
      const nextPosts = action.posts.filter((post) => !existingIds.has(post.id));
      return {
        ...state,
        posts: [...state.posts, ...nextPosts],
        authorsById: { ...state.authorsById, ...action.authorsById },
      };
    }

    case "UPDATE_POST": {
      const posts = state.posts.map((post) =>
        post.id === action.post.id ? action.post : post,
      );
      return { ...state, posts };
    }

    case "DELETE_POST": {
      const posts = state.posts.filter((post) => post.id !== action.postId);
      return { ...state, posts };
    }

    case "PATCH_AUTHOR": {
      const existing = state.authorsById[action.authorId];
      const authorsById = existing
        ? {
            ...state.authorsById,
            [action.authorId]: { ...existing, ...action.patch },
          }
        : state.authorsById;

      return { ...state, authorsById };
    }

    case "SET_PRESENCE_SNAPSHOT": {
      const onlineByUserId: Record<number, boolean> = {};
      for (const userId of action.onlineUserIds) {
        if (Number.isFinite(userId) && userId > 0) {
          onlineByUserId[userId] = true;
        }
      }
      return { ...state, onlineByUserId, presenceReady: true };
    }

    case "PATCH_PRESENCE": {
      return {
        ...state,
        onlineByUserId: {
          ...state.onlineByUserId,
          [action.userId]: action.isOnline,
        },
      };
    }

    case "CLEAR_PRESENCE": {
      return { ...state, onlineByUserId: {}, presenceReady: false };
    }

    case "UPSERT_AUTHOR": {
      const author = mergeCommunityUser(
        state.authorsById[action.author.id],
        action.author,
      );
      return {
        ...state,
        authorsById: { ...state.authorsById, [action.author.id]: author },
      };
    }

    case "HYDRATE_CHAT_THREADS": {
      const apiIds = new Set(action.threads.map((thread) => thread.id));
      const mergedApiThreads = action.threads.map((thread) => {
        const existing = state.threads.find((row) => row.id === thread.id);
        return mergeThreadFromSummary(existing, thread);
      });
      const localOnlyThreads = state.threads.filter((thread) => !apiIds.has(thread.id));

      return {
        ...state,
        threads: [...mergedApiThreads, ...localOnlyThreads],
        messagesById: { ...state.messagesById, ...action.messagesById },
        authorsById: mergeAuthorsById(state.authorsById, action.authorsById),
      };
    }

    case "UPSERT_CHAT_THREAD": {
      const existingIndex = state.threads.findIndex((t) => t.id === action.thread.id);
      const messagesById = { ...state.messagesById };
      for (const message of action.messages) {
        messagesById[message.id] = message;
      }
      const participant = mergeCommunityUser(
        state.authorsById[action.participant.id],
        action.participant,
      );
      const authorsById = {
        ...state.authorsById,
        [action.participant.id]: participant,
      };
      const threads =
        existingIndex >= 0
          ? state.threads.map((thread, index) =>
              index === existingIndex
                ? mergeThreadFromSummary(thread, {
                    ...action.thread,
                    messageIds: mergeMessageIdsPreservingOrder(
                      thread.messageIds,
                      action.thread.messageIds,
                      action.messages.map((message) => message.id),
                    ),
                  })
                : thread,
            )
          : [action.thread, ...state.threads];

      return { ...state, threads, messagesById, authorsById };
    }

    case "SET_THREAD_MESSAGES": {
      const messagesById = { ...state.messagesById };
      const messageIds: string[] = [];
      for (const message of action.messages) {
        messagesById[message.id] = message;
        messageIds.push(message.id);
      }

      const existingThread = state.threads.find((thread) => thread.id === action.threadId);
      const pendingIds = existingThread
        ? collectPendingMessageIds(existingThread.messageIds)
        : [];
      for (const pendingId of pendingIds) {
        const pending = state.messagesById[pendingId];
        if (!pending) continue;
        messagesById[pendingId] = pending;
      }
      const mergedMessageIds = mergeMessageIdsPreservingOrder(messageIds, pendingIds);

      const threads = state.threads.map((thread) =>
        thread.id === action.threadId
          ? {
              ...thread,
              messageIds: mergedMessageIds,
              hasMoreMessages: action.hasMore ?? thread.hasMoreMessages,
              peerLastReadAt: action.peerLastReadAt ?? thread.peerLastReadAt,
            }
          : thread,
      );

      return { ...state, threads, messagesById };
    }

    case "APPEND_THREAD_MESSAGES": {
      const messagesById = { ...state.messagesById };
      const prependIds: string[] = [];
      for (const message of action.messages) {
        messagesById[message.id] = message;
        prependIds.push(message.id);
      }

      const threads = state.threads.map((thread) => {
        if (thread.id !== action.threadId) return thread;
        const existing = new Set(thread.messageIds);
        const olderIds = prependIds.filter((id) => !existing.has(id));
        return {
          ...thread,
          messageIds: [...olderIds, ...thread.messageIds],
          hasMoreMessages: action.hasMore,
        };
      });

      return { ...state, threads, messagesById };
    }

    case "RECEIVE_CHAT_MESSAGE": {
      const { message } = action;
      const messagesById = { ...state.messagesById, [message.id]: message };
      let authorsById = state.authorsById;
      if (action.participant) {
        authorsById = {
          ...authorsById,
          [action.participant.id]: mergeCommunityUser(
            authorsById[action.participant.id],
            action.participant,
          ),
        };
      }

      const existing = state.threads.find((thread) => thread.id === message.threadId);
      let threads = state.threads;

      if (existing) {
        const isNew = !existing.messageIds.includes(message.id);
        threads = state.threads.map((thread) =>
          thread.id === message.threadId
            ? {
                ...thread,
                messageIds: isNew ? [...thread.messageIds, message.id] : thread.messageIds,
                unreadCount:
                  isNew && message.senderId !== CURRENT_USER_ID
                    ? (thread.unreadCount ?? 0) + 1
                    : thread.unreadCount,
              }
            : thread,
        );
      } else if (action.participant) {
        threads = [
          {
            id: message.threadId,
            participantId: action.participant.id,
            messageIds: [message.id],
            lastReadAt: Date.now(),
            unreadCount: message.senderId !== CURRENT_USER_ID ? 1 : 0,
          },
          ...state.threads,
        ];
      }

      return { ...state, threads, messagesById, authorsById };
    }

    case "REPLACE_CHAT_MESSAGE": {
      const messagesById = { ...state.messagesById };
      delete messagesById[action.tempId];
      messagesById[action.message.id] = action.message;

      const threads = state.threads.map((thread) => {
        if (!thread.messageIds.includes(action.tempId)) return thread;

        const messageIds = thread.messageIds
          .map((id) => (id === action.tempId ? action.message.id : id))
          .filter((id, index, arr) => arr.indexOf(id) === index);

        return { ...thread, messageIds };
      });

      return { ...state, threads, messagesById };
    }

    case "SET_MESSAGES_SEEN": {
      const threads = state.threads.map((thread) => {
        if (thread.id !== action.threadId) return thread;
        const previous = thread.peerLastReadAt ?? 0;
        if (action.lastReadAt <= previous) return thread;
        return { ...thread, peerLastReadAt: action.lastReadAt };
      });
      return { ...state, threads };
    }

    case "MARK_THREAD_READ": {
      const now = Date.now();
      const threads = state.threads.map((thread) =>
        thread.id === action.threadId
          ? { ...thread, lastReadAt: now, unreadCount: 0 }
          : thread,
      );
      return { ...state, threads };
    }

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

type CommunityContextValue = {
  state: State;
  votePost: (postId: string, vote: PostVote) => Promise<void>;
  share: (postId: string) => Promise<void>;
  addComment: (
    postId: string,
    text: string,
    replyTo?: CommentReplyTarget | null,
  ) => Promise<void>;
  voteComment: (postId: string, commentId: string, vote: PostVote) => Promise<void>;
  updateComment: (postId: string, commentId: string, text: string) => Promise<boolean>;
  deleteComment: (postId: string, commentId: string) => Promise<boolean>;
  loadPostComments: (postId: string) => Promise<void>;
  loadMorePostComments: (postId: string) => Promise<void>;
  loadAllPostComments: (postId: string) => Promise<void>;
  addPost: (post: CommunityPost, author?: CommunityUser) => void;
  setPosts: (posts: CommunityPost[], authorsById: Record<string, CommunityUser>) => void;
  appendPosts: (posts: CommunityPost[], authorsById: Record<string, CommunityUser>) => void;
  updatePost: (postId: string, payload: UpdatePostPayload) => Promise<void>;
  deletePost: (postId: string) => void;
  patchAuthor: (authorId: string, patch: Partial<CommunityUser>) => void;
  upsertAuthor: (author: CommunityUser) => void;
  setPresenceSnapshot: (onlineUserIds: number[]) => void;
  patchPresence: (userId: number, isOnline: boolean) => void;
  clearPresence: () => void;
  loadChatThreads: () => Promise<void>;
  loadChatMessages: (threadId: string) => Promise<void>;
  loadMoreChatMessages: (threadId: string) => Promise<void>;
  openChatThreadWithPeer: (peerUserId: number) => Promise<string | null>;
  sendMessage: (participantId: string, text: string, threadId?: string) => Promise<void>;
  sendMediaMessages: (
    participantId: string,
    items: ChatMediaPick[],
    threadId?: string,
  ) => Promise<void>;
  markThreadRead: (threadId: string) => Promise<void>;
  receiveChatMessage: (message: ChatMessage, participant?: CommunityUser) => void;
  setMessagesSeen: (threadId: string, lastReadAt: number, readerUserId: number) => void;
  resetCommunity: () => void;
};

const CommunityContext = createContext<CommunityContextValue | null>(null);

export function CommunityProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: appState } = useApp();
  const currentUserId = appState.account?.userId ?? null;

  const votePost = useCallback(async (postId: string, vote: PostVote) => {
    dispatch({ type: "VOTE_POST", postId, vote });
    try {
      const engagement = await voteOnPost(postId, vote);
      dispatch({ type: "SYNC_ENGAGEMENT", postId, engagement });
    } catch {
      dispatch({ type: "VOTE_POST", postId, vote });
    }
  }, []);

  const share = useCallback(async (postId: string) => {
    try {
      const engagement = await sharePostApi(postId);
      dispatch({ type: "SYNC_ENGAGEMENT", postId, engagement });
    } catch {
      // keep counts unchanged on failure
    }
  }, []);

  const addComment = useCallback(
    async (postId: string, text: string, replyTo?: CommentReplyTarget | null) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const replyToUserId =
        parseDbUserId(replyTo?.userId ?? "") ??
        (replyTo?.userId === CURRENT_USER_ID ? currentUserId ?? undefined : undefined);

      try {
        const created = await createPostComment(postId, {
          text: trimmed,
          parent_comment_id: replyTo ? Number.parseInt(replyTo.commentId, 10) : undefined,
          reply_to_user_id: replyToUserId,
        });
        dispatch({
          type: "ADD_COMMENT",
          post: mapBackendComment(created),
          author: mapCommentAuthorToCommunityUser(created),
        });
      } catch {
        // keep UI unchanged on failure
      }
    },
    [currentUserId],
  );

  const voteComment = useCallback(async (postId: string, commentId: string, vote: PostVote) => {
    dispatch({ type: "PATCH_COMMENT_VOTE", commentId, vote });
    try {
      const engagement = await voteOnComment(postId, commentId, vote);
      dispatch({ type: "SYNC_COMMENT_ENGAGEMENT", commentId, engagement });
    } catch {
      dispatch({ type: "PATCH_COMMENT_VOTE", commentId, vote });
    }
  }, []);

  const updateComment = useCallback(async (postId: string, commentId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return false;

    try {
      const updated = await updatePostComment(postId, commentId, trimmed);
      dispatch({
        type: "UPDATE_COMMENT",
        comment: mapBackendComment(updated),
        author: mapCommentAuthorToCommunityUser(updated),
      });
      return true;
    } catch {
      return false;
    }
  }, []);

  const deleteComment = useCallback(async (postId: string, commentId: string) => {
    try {
      const result = await deletePostComment(postId, commentId);
      dispatch({
        type: "DELETE_COMMENTS",
        postId,
        commentIds: result.removed_comment_ids.map(String),
        commentCount: result.comment_count,
      });
      return true;
    } catch {
      return false;
    }
  }, []);

  const loadPostComments = useCallback(async (postId: string) => {
    if (
      hasLoadedPostComments(postId, {
        posts: state.posts,
        commentsById: state.commentsById,
        commentsLoadedByPostId: state.commentsLoadedByPostId,
      })
    ) {
      return;
    }

    try {
      const page = await fetchPostComments(postId, { offset: 0 });
      const { comments, authorsById } = mapCommentsFromApi(page.items);
      dispatch({
        type: "SET_POST_COMMENTS",
        postId,
        comments,
        authorsById,
        hasMore: page.has_more,
      });
    } catch {
      // keep cached comments
    }
  }, [state.commentsById, state.commentsLoadedByPostId, state.posts]);

  const loadMorePostComments = useCallback(async (postId: string) => {
    if (!state.commentsHasMoreByPostId[postId]) return;
    if (state.commentsLoadingMoreByPostId[postId]) return;

    dispatch({ type: "SET_COMMENTS_LOADING_MORE", postId, loading: true });

    try {
      const offset = countLoadedPostComments(postId, state.commentsById);
      const page = await fetchPostComments(postId, { offset });
      const { comments, authorsById } = mapCommentsFromApi(page.items);
      dispatch({
        type: "APPEND_POST_COMMENTS",
        postId,
        comments,
        authorsById,
        hasMore: page.has_more,
      });
    } catch {
      dispatch({ type: "SET_COMMENTS_LOADING_MORE", postId, loading: false });
    }
  }, [
    state.commentsById,
    state.commentsHasMoreByPostId,
    state.commentsLoadingMoreByPostId,
  ]);

  const loadAllPostComments = useCallback(async (postId: string) => {
    const fullyLoaded =
      state.commentsLoadedByPostId[postId] === true &&
      state.commentsHasMoreByPostId[postId] !== true;
    if (fullyLoaded) return;
    if (state.commentsLoadingByPostId[postId]) return;

    dispatch({ type: "SET_COMMENTS_LOADING", postId, loading: true });

    try {
      let offset = hasLoadedPostComments(postId, {
        posts: state.posts,
        commentsById: state.commentsById,
        commentsLoadedByPostId: state.commentsLoadedByPostId,
      })
        ? countLoadedPostComments(postId, state.commentsById)
        : 0;
      let hasMore = state.commentsHasMoreByPostId[postId] ?? true;
      let isFirstPage = offset === 0;

      while (hasMore) {
        const page = await fetchPostComments(postId, { offset });
        const { comments, authorsById } = mapCommentsFromApi(page.items);

        dispatch({
          type: isFirstPage ? "SET_POST_COMMENTS" : "APPEND_POST_COMMENTS",
          postId,
          comments,
          authorsById,
          hasMore: page.has_more,
        });

        hasMore = page.has_more;
        offset += page.items.length;
        isFirstPage = false;
      }
    } catch {
      // keep cached comments
    } finally {
      dispatch({ type: "SET_COMMENTS_LOADING", postId, loading: false });
    }
  }, [
    state.commentsById,
    state.commentsHasMoreByPostId,
    state.commentsLoadedByPostId,
    state.commentsLoadingByPostId,
    state.posts,
  ]);

  const addPost = useCallback((post: CommunityPost, author?: CommunityUser) => {
    dispatch({ type: "ADD_POST", post, author });
  }, []);

  const setPosts = useCallback(
    (posts: CommunityPost[], authorsById: Record<string, CommunityUser>) => {
      dispatch({ type: "SET_POSTS", posts, authorsById });
    },
    [],
  );

  const appendPosts = useCallback(
    (posts: CommunityPost[], authorsById: Record<string, CommunityUser>) => {
      dispatch({ type: "APPEND_POSTS", posts, authorsById });
    },
    [],
  );

  const updatePost = useCallback(async (postId: string, payload: UpdatePostPayload) => {
    const existing = state.posts.find((post) => post.id === postId);
    if (!existing) return;

    const updated = await updatePostApi(postId, payload);
    dispatch({ type: "UPDATE_POST", post: mergeUpdatedPost(existing, updated) });
  }, [state.posts]);

  const deletePost = useCallback((postId: string) => {
    dispatch({ type: "DELETE_POST", postId });
  }, []);

  const patchAuthor = useCallback((authorId: string, patch: Partial<CommunityUser>) => {
    dispatch({ type: "PATCH_AUTHOR", authorId, patch });
  }, []);

  const upsertAuthor = useCallback((author: CommunityUser) => {
    dispatch({ type: "UPSERT_AUTHOR", author });
  }, []);

  const loadChatThreads = useCallback(async () => {
    if (!currentUserId) return;

    try {
      const rows = await fetchChatThreads();
      const threads: ChatThread[] = [];
      const messagesById: Record<string, ChatMessage> = {};
      const authorsById: Record<string, CommunityUser> = {};

      for (const row of rows) {
        const mapped = mapBackendThreadSummary(row, currentUserId);
        threads.push(mapped.thread);
        authorsById[mapped.participant.id] = mapped.participant;
        for (const message of mapped.messages) {
          messagesById[message.id] = message;
        }
      }

      dispatch({ type: "HYDRATE_CHAT_THREADS", threads, messagesById, authorsById });
    } catch {
      // keep cached threads
    }
  }, [currentUserId]);

  const loadChatMessages = useCallback(
    async (threadId: string) => {
      if (!currentUserId) return;

      try {
        const page = await fetchChatMessages(Number(threadId));
        const messages = page.items.map((row) =>
          mapBackendMessage(row, currentUserId),
        );
        dispatch({
          type: "SET_THREAD_MESSAGES",
          threadId,
          messages,
          hasMore: page.has_more,
          peerLastReadAt: page.peer_last_read_at
            ? Date.parse(page.peer_last_read_at)
            : undefined,
        });
      } catch {
        // keep cached messages
      }
    },
    [currentUserId],
  );

  const loadMoreChatMessages = useCallback(
    async (threadId: string) => {
      if (!currentUserId) return;

      const thread = state.threads.find((row) => row.id === threadId);
      if (!thread?.hasMoreMessages || thread.messageIds.length === 0) return;

      const oldestId = thread.messageIds[0];
      const oldest = state.messagesById[oldestId];
      if (!oldest) return;

      const before = new Date(oldest.createdAt).toISOString();

      try {
        const page = await fetchChatMessages(Number(threadId), before);
        const messages = page.items.map((row) =>
          mapBackendMessage(row, currentUserId),
        );
        dispatch({
          type: "APPEND_THREAD_MESSAGES",
          threadId,
          messages,
          hasMore: page.has_more,
        });
      } catch {
        // keep current window
      }
    },
    [currentUserId, state.messagesById, state.threads],
  );

  const openChatThreadWithPeer = useCallback(
    async (peerUserId: number): Promise<string | null> => {
      if (!currentUserId) return null;

      try {
        const summary = await openChatThreadApi(peerUserId);
        const mapped = mapBackendThreadSummary(summary, currentUserId);
        dispatch({
          type: "UPSERT_CHAT_THREAD",
          thread: mapped.thread,
          participant: mapped.participant,
          messages: mapped.messages,
        });
        return String(summary.thread_id);
      } catch {
        return null;
      }
    },
    [currentUserId],
  );

  const receiveChatMessage = useCallback(
    (message: ChatMessage, participant?: CommunityUser) => {
      dispatch({ type: "RECEIVE_CHAT_MESSAGE", message, participant });
    },
    [],
  );

  const setMessagesSeen = useCallback(
    (threadId: string, lastReadAt: number, readerUserId: number) => {
      if (!currentUserId || Number(readerUserId) === Number(currentUserId)) return;
      dispatch({ type: "SET_MESSAGES_SEEN", threadId, lastReadAt });
    },
    [currentUserId],
  );

  const sendMessage = useCallback(
    async (participantId: string, text: string, threadId?: string) => {
      const trimmed = text.trim();
      if (!trimmed || !currentUserId) return;

      const peerUserId = parseDbUserId(participantId);
      if (!peerUserId) return;

      let resolvedThreadId = threadId;
      if (!resolvedThreadId) {
        const existing = state.threads.find((thread) => thread.participantId === participantId);
        resolvedThreadId = existing?.id;
      }
      if (!resolvedThreadId) {
        const opened = await openChatThreadWithPeer(peerUserId);
        if (!opened) return;
        resolvedThreadId = opened;
      }

      const tempId = `temp-${Date.now()}`;
      const optimistic: ChatMessage = {
        id: tempId,
        threadId: resolvedThreadId,
        senderId: CURRENT_USER_ID,
        text: trimmed,
        createdAt: Date.now(),
        kind: "text",
      };
      dispatch({ type: "RECEIVE_CHAT_MESSAGE", message: optimistic });

      try {
        const sent = await sendChatMessageApi(Number(resolvedThreadId), {
          message_type: "text",
          text: trimmed,
        });
        dispatch({
          type: "REPLACE_CHAT_MESSAGE",
          tempId,
          message: mapBackendMessage(sent, currentUserId),
        });
      } catch {
        // optimistic message stays until refresh
      }
    },
    [currentUserId, openChatThreadWithPeer, state.threads],
  );

  const sendMediaMessages = useCallback(
    async (participantId: string, items: ChatMediaPick[], threadId?: string) => {
      if (!currentUserId || items.length === 0) return;

      const peerUserId = parseDbUserId(participantId);
      if (!peerUserId) return;

      let resolvedThreadId = threadId;
      if (!resolvedThreadId) {
        const existing = state.threads.find((thread) => thread.participantId === participantId);
        resolvedThreadId = existing?.id;
      }
      if (!resolvedThreadId) {
        const opened = await openChatThreadWithPeer(peerUserId);
        if (!opened) return;
        resolvedThreadId = opened;
      }

      for (const item of items) {
        const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const optimistic: ChatMessage = {
          id: tempId,
          threadId: resolvedThreadId,
          senderId: CURRENT_USER_ID,
          text: "",
          createdAt: Date.now(),
          kind: item.kind,
          mediaUrl: item.uri,
          mediaMimeType: item.mimeType,
          mediaDurationMs: item.durationMs,
        };
        dispatch({ type: "RECEIVE_CHAT_MESSAGE", message: optimistic });

        try {
          const uploaded = await uploadChatMediaToR2({
            uri: item.uri,
            kind: item.kind,
            mimeType: item.mimeType,
          });
          const sent = await sendChatMessageApi(Number(resolvedThreadId), {
            message_type: item.kind,
            media_url: uploaded.publicUrl,
            media_mime_type: uploaded.contentType,
            media_duration_ms: item.durationMs,
            media_size_bytes: item.sizeBytes ?? uploaded.sizeBytes,
          });
          dispatch({
            type: "REPLACE_CHAT_MESSAGE",
            tempId,
            message: mapBackendMessage(sent, currentUserId),
          });
        } catch {
          // optimistic preview stays until refresh
        }
      }
    },
    [currentUserId, openChatThreadWithPeer, state.threads],
  );

  const markThreadRead = useCallback(async (threadId: string) => {
    dispatch({ type: "MARK_THREAD_READ", threadId });

    try {
      await markChatThreadRead(Number(threadId));
    } catch {
      // local read state still updated
    }
  }, []);

  const setPresenceSnapshot = useCallback((onlineUserIds: number[]) => {
    dispatch({ type: "SET_PRESENCE_SNAPSHOT", onlineUserIds });
  }, []);

  const patchPresence = useCallback((userId: number, isOnline: boolean) => {
    dispatch({ type: "PATCH_PRESENCE", userId, isOnline });
  }, []);

  const clearPresence = useCallback(() => {
    dispatch({ type: "CLEAR_PRESENCE" });
  }, []);

  const resetCommunity = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const value = useMemo<CommunityContextValue>(
    () => ({
      state,
      votePost,
      share,
      addComment,
      voteComment,
      updateComment,
      deleteComment,
      loadPostComments,
      loadMorePostComments,
      loadAllPostComments,
      addPost,
      setPosts,
      appendPosts,
      updatePost,
      deletePost,
      patchAuthor,
      upsertAuthor,
      setPresenceSnapshot,
      patchPresence,
      clearPresence,
      loadChatThreads,
      loadChatMessages,
      loadMoreChatMessages,
      openChatThreadWithPeer,
      sendMessage,
      sendMediaMessages,
      markThreadRead,
      receiveChatMessage,
      setMessagesSeen,
      resetCommunity,
    }),
    [
      state,
      votePost,
      share,
      addComment,
      voteComment,
      updateComment,
      deleteComment,
      loadPostComments,
      loadMorePostComments,
      loadAllPostComments,
      addPost,
      setPosts,
      appendPosts,
      updatePost,
      deletePost,
      patchAuthor,
      upsertAuthor,
      setPresenceSnapshot,
      patchPresence,
      clearPresence,
      loadChatThreads,
      loadChatMessages,
      loadMoreChatMessages,
      openChatThreadWithPeer,
      sendMessage,
      sendMediaMessages,
      markThreadRead,
      receiveChatMessage,
      setMessagesSeen,
      resetCommunity,
    ],
  );

  return <CommunityContext.Provider value={value}>{children}</CommunityContext.Provider>;
}

export function useCommunity(): CommunityContextValue {
  const ctx = useContext(CommunityContext);
  if (!ctx) throw new Error("useCommunity must be used within CommunityProvider");
  return ctx;
}
