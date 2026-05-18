import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";

import { SEED_THREADS, SEED_MESSAGES } from "@/constants/chatThreads";
import { SEED_COMMENTS, SEED_POSTS } from "@/constants/communityPosts";
import { CURRENT_USER_ID } from "@/constants/communityUsers";
import type { ChatMessage, ChatThread } from "@/types/chat";
import type { CommunityPost, PostComment } from "@/types/community";

type State = {
  posts: CommunityPost[];
  commentsById: Record<string, PostComment>;
  threads: ChatThread[];
  messagesById: Record<string, ChatMessage>;
};

type Action =
  | { type: "TOGGLE_LIKE"; postId: string }
  | { type: "SHARE"; postId: string }
  | { type: "ADD_COMMENT"; postId: string; text: string }
  | { type: "ADD_POST"; text: string; imageKey?: string }
  | { type: "SEND_MESSAGE"; participantId: string; text: string }
  | { type: "MARK_THREAD_READ"; threadId: string };

function byId<T extends { id: string }>(arr: T[]): Record<string, T> {
  return Object.fromEntries(arr.map((item) => [item.id, item]));
}

const initialState: State = {
  posts: SEED_POSTS,
  commentsById: byId(SEED_COMMENTS),
  threads: SEED_THREADS,
  messagesById: byId(SEED_MESSAGES),
};

function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "TOGGLE_LIKE": {
      const posts = state.posts.map((p) =>
        p.id === action.postId
          ? {
              ...p,
              likedByMe: !p.likedByMe,
              likeCount: p.likeCount + (p.likedByMe ? -1 : 1),
            }
          : p,
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
      const text = action.text.trim();
      if (!text) return state;

      const comment: PostComment = {
        id: newId("comment"),
        postId: action.postId,
        authorId: CURRENT_USER_ID,
        text,
        createdAt: Date.now(),
      };
      const commentsById = { ...state.commentsById, [comment.id]: comment };
      const posts = state.posts.map((p) =>
        p.id === action.postId
          ? { ...p, commentIds: [...p.commentIds, comment.id] }
          : p,
      );
      return { ...state, posts, commentsById };
    }

    case "ADD_POST": {
      const text = action.text.trim();
      if (!text && !action.imageKey) return state;

      const post: CommunityPost = {
        id: newId("post"),
        authorId: CURRENT_USER_ID,
        text,
        createdAt: Date.now(),
        media: action.imageKey ? { kind: "image", imageKey: action.imageKey } : undefined,
        likeCount: 0,
        likedByMe: false,
        shareCount: 0,
        commentIds: [],
      };
      return { ...state, posts: [post, ...state.posts] };
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
  toggleLike: (postId: string) => void;
  share: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  addPost: (input: { text: string; imageKey?: string }) => void;
  sendMessage: (participantId: string, text: string) => void;
  markThreadRead: (threadId: string) => void;
};

const CommunityContext = createContext<CommunityContextValue | null>(null);

export function CommunityProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const toggleLike = useCallback((postId: string) => {
    dispatch({ type: "TOGGLE_LIKE", postId });
  }, []);
  const share = useCallback((postId: string) => {
    dispatch({ type: "SHARE", postId });
  }, []);
  const addComment = useCallback((postId: string, text: string) => {
    dispatch({ type: "ADD_COMMENT", postId, text });
  }, []);
  const addPost = useCallback((input: { text: string; imageKey?: string }) => {
    dispatch({ type: "ADD_POST", text: input.text, imageKey: input.imageKey });
  }, []);
  const sendMessage = useCallback((participantId: string, text: string) => {
    dispatch({ type: "SEND_MESSAGE", participantId, text });
  }, []);
  const markThreadRead = useCallback((threadId: string) => {
    dispatch({ type: "MARK_THREAD_READ", threadId });
  }, []);

  const value = useMemo<CommunityContextValue>(
    () => ({ state, toggleLike, share, addComment, addPost, sendMessage, markThreadRead }),
    [state, toggleLike, share, addComment, addPost, sendMessage, markThreadRead],
  );

  return <CommunityContext.Provider value={value}>{children}</CommunityContext.Provider>;
}

export function useCommunity(): CommunityContextValue {
  const ctx = useContext(CommunityContext);
  if (!ctx) throw new Error("useCommunity must be used within CommunityProvider");
  return ctx;
}
