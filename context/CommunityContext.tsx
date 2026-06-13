import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";

import { SEED_THREADS, SEED_MESSAGES } from "@/constants/chatThreads";
import { CURRENT_USER_ID } from "@/constants/communityUsers";
import {
  createPostComment,
  fetchPostComments,
  sharePost as sharePostApi,
  updatePost as updatePostApi,
  voteOnPost,
} from "@/services/posts/postsApi";
import type { ChatMessage, ChatThread } from "@/types/chat";
import type { CommunityPost, CommunityUser, PostComment, PostVote } from "@/types/community";
import type { BackendPostEngagement } from "@/types/postsApi";
import {
  mapBackendComment,
  mapCommentAuthorToCommunityUser,
  mapCommentsFromApi,
} from "@/utils/community/mapBackendComment";
import { applyEngagementToPost } from "@/utils/community/postEngagement";
import { applyPostVote } from "@/utils/community/postVote";
import { mergeUpdatedPost } from "@/utils/community/mergeUpdatedPost";
import type { UpdatePostPayload } from "@/types/updatePost";

type State = {
  posts: CommunityPost[];
  authorsById: Record<string, CommunityUser>;
  commentsById: Record<string, PostComment>;
  threads: ChatThread[];
  messagesById: Record<string, ChatMessage>;
};

type Action =
  | { type: "VOTE_POST"; postId: string; vote: PostVote }
  | { type: "SYNC_ENGAGEMENT"; postId: string; engagement: BackendPostEngagement }
  | { type: "SHARE"; postId: string }
  | { type: "ADD_COMMENT"; post: PostComment; author: CommunityUser }
  | {
      type: "SET_POST_COMMENTS";
      postId: string;
      comments: PostComment[];
      authorsById: Record<string, CommunityUser>;
    }
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
  | { type: "SEND_MESSAGE"; participantId: string; text: string }
  | { type: "MARK_THREAD_READ"; threadId: string };

function byId<T extends { id: string }>(arr: T[]): Record<string, T> {
  return Object.fromEntries(arr.map((item) => [item.id, item]));
}

const initialState: State = {
  posts: [],
  authorsById: {},
  commentsById: {},
  threads: SEED_THREADS,
  messagesById: byId(SEED_MESSAGES),
};

function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
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
              commentCount: action.comments.length,
            }
          : p,
      );
      return {
        ...state,
        posts,
        commentsById,
        authorsById: { ...state.authorsById, ...action.authorsById },
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
      if (!existing) return state;
      return {
        ...state,
        authorsById: {
          ...state.authorsById,
          [action.authorId]: { ...existing, ...action.patch },
        },
      };
    }

    case "SEND_MESSAGE": {
      const text = action.text.trim();
      if (!text) return state;

      const existing = state.threads.find((t) => t.participantId === action.participantId);
      const now = Date.now();
      const message: ChatMessage = {
        id: newId("m"),
        threadId: existing ? existing.id : newId("thread"),
        senderId: CURRENT_USER_ID,
        text,
        createdAt: now,
        kind: "text",
      };

      const messagesById = { ...state.messagesById, [message.id]: message };

      let threads: ChatThread[];
      if (existing) {
        threads = state.threads.map((t) =>
          t.id === existing.id
            ? { ...t, messageIds: [...t.messageIds, message.id], lastReadAt: now }
            : t,
        );
      } else {
        threads = [
          {
            id: message.threadId,
            participantId: action.participantId,
            messageIds: [message.id],
            lastReadAt: now,
          },
          ...state.threads,
        ];
      }

      return { ...state, messagesById, threads };
    }

    case "MARK_THREAD_READ": {
      const threads = state.threads.map((t) =>
        t.id === action.threadId ? { ...t, lastReadAt: Date.now() } : t,
      );
      return { ...state, threads };
    }

    default:
      return state;
  }
}

type CommunityContextValue = {
  state: State;
  votePost: (postId: string, vote: PostVote) => Promise<void>;
  share: (postId: string) => Promise<void>;
  addComment: (postId: string, text: string) => Promise<void>;
  loadPostComments: (postId: string) => Promise<void>;
  addPost: (post: CommunityPost, author?: CommunityUser) => void;
  setPosts: (posts: CommunityPost[], authorsById: Record<string, CommunityUser>) => void;
  appendPosts: (posts: CommunityPost[], authorsById: Record<string, CommunityUser>) => void;
  updatePost: (postId: string, payload: UpdatePostPayload) => Promise<void>;
  deletePost: (postId: string) => void;
  patchAuthor: (authorId: string, patch: Partial<CommunityUser>) => void;
  sendMessage: (participantId: string, text: string) => void;
  markThreadRead: (threadId: string) => void;
};

const CommunityContext = createContext<CommunityContextValue | null>(null);

export function CommunityProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

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

  const addComment = useCallback(async (postId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    try {
      const created = await createPostComment(postId, trimmed);
      dispatch({
        type: "ADD_COMMENT",
        post: mapBackendComment(created),
        author: mapCommentAuthorToCommunityUser(created),
      });
    } catch {
      // keep UI unchanged on failure
    }
  }, []);

  const loadPostComments = useCallback(async (postId: string) => {
    const post = state.posts.find((p) => p.id === postId);
    if (post && post.commentIds.length > 0) return;

    try {
      const rows = await fetchPostComments(postId);
      const { comments, authorsById } = mapCommentsFromApi(rows);
      dispatch({ type: "SET_POST_COMMENTS", postId, comments, authorsById });
    } catch {
      // keep cached comments
    }
  }, [state.posts]);

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

  const sendMessage = useCallback((participantId: string, text: string) => {
    dispatch({ type: "SEND_MESSAGE", participantId, text });
  }, []);

  const markThreadRead = useCallback((threadId: string) => {
    dispatch({ type: "MARK_THREAD_READ", threadId });
  }, []);

  const value = useMemo<CommunityContextValue>(
    () => ({
      state,
      votePost,
      share,
      addComment,
      loadPostComments,
      addPost,
      setPosts,
      appendPosts,
      updatePost,
      deletePost,
      patchAuthor,
      sendMessage,
      markThreadRead,
    }),
    [
      state,
      votePost,
      share,
      addComment,
      loadPostComments,
      addPost,
      setPosts,
      appendPosts,
      updatePost,
      deletePost,
      patchAuthor,
      sendMessage,
      markThreadRead,
    ],
  );

  return <CommunityContext.Provider value={value}>{children}</CommunityContext.Provider>;
}

export function useCommunity(): CommunityContextValue {
  const ctx = useContext(CommunityContext);
  if (!ctx) throw new Error("useCommunity must be used within CommunityProvider");
  return ctx;
}
