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
import type { PostTagId } from "@/constants/postTags";
import type { CommunityPost, PostComment, PostMedia, PostVote } from "@/types/community";
import { applyPostVote } from "@/utils/community/postVote";

type State = {
  posts: CommunityPost[];
  commentsById: Record<string, PostComment>;
  threads: ChatThread[];
  messagesById: Record<string, ChatMessage>;
};

type Action =
  | { type: "VOTE_POST"; postId: string; vote: PostVote }
  | { type: "SHARE"; postId: string }
  | { type: "ADD_COMMENT"; postId: string; text: string }
  | { type: "ADD_POST"; title: string; text: string; tagId?: PostTagId; media?: PostMedia[] }
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
    case "VOTE_POST": {
      const posts = state.posts.map((p) =>
        p.id === action.postId ? applyPostVote(p, action.vote) : p,
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
      const title = action.title.trim();
      const text = action.text.trim();
      if (!title && !text && !action.media?.length) return state;

      const post: CommunityPost = {
        id: newId("post"),
        authorId: CURRENT_USER_ID,
        title: title || undefined,
        tagId: action.tagId,
        text,
        createdAt: Date.now(),
        media: action.media,
        upvoteCount: 0,
        downvoteCount: 0,
        myVote: null,
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
  votePost: (postId: string, vote: PostVote) => void;
  share: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  addPost: (input: {
    title: string;
    text: string;
    tagId?: PostTagId;
    media?: PostMedia[];
  }) => void;
  sendMessage: (participantId: string, text: string) => void;
  markThreadRead: (threadId: string) => void;
};

const CommunityContext = createContext<CommunityContextValue | null>(null);

export function CommunityProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const votePost = useCallback((postId: string, vote: PostVote) => {
    dispatch({ type: "VOTE_POST", postId, vote });
  }, []);
  const share = useCallback((postId: string) => {
    dispatch({ type: "SHARE", postId });
  }, []);
  const addComment = useCallback((postId: string, text: string) => {
    dispatch({ type: "ADD_COMMENT", postId, text });
  }, []);
  const addPost = useCallback(
    (input: { title: string; text: string; tagId?: PostTagId; media?: PostMedia[] }) => {
      dispatch({
        type: "ADD_POST",
        title: input.title,
        text: input.text,
        tagId: input.tagId,
        media: input.media,
      });
    },
    [],
  );
  const sendMessage = useCallback((participantId: string, text: string) => {
    dispatch({ type: "SEND_MESSAGE", participantId, text });
  }, []);
  const markThreadRead = useCallback((threadId: string) => {
    dispatch({ type: "MARK_THREAD_READ", threadId });
  }, []);

  const value = useMemo<CommunityContextValue>(
    () => ({ state, votePost, share, addComment, addPost, sendMessage, markThreadRead }),
    [state, votePost, share, addComment, addPost, sendMessage, markThreadRead],
  );

  return <CommunityContext.Provider value={value}>{children}</CommunityContext.Provider>;
}

export function useCommunity(): CommunityContextValue {
  const ctx = useContext(CommunityContext);
  if (!ctx) throw new Error("useCommunity must be used within CommunityProvider");
  return ctx;
}
