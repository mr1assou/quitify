import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef } from "react";
import { ThemedLoadingScreen } from "@/components/ui/ThemedLoadingScreen";
import { getCommunityUser } from "@/constants/communityUsers";
import { useCommunity } from "@/context/CommunityContext";

/**
 * Helper route: opens (or creates) a chat thread for the given participant id
 * and replaces with `/chat/<threadId>`. Useful from a profile or search row
 * where the caller doesn't know the thread id yet.
 */
export default function ChatByUserScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, sendMessage } = useCommunity();
  const seededRef = useRef(false);

  useEffect(() => {
    if (!id || !getCommunityUser(id)) {
      router.replace("/chats");
      return;
    }

    const existing = state.threads.find((t) => t.participantId === id);
    if (existing) {
      router.replace(`/chat/${existing.id}`);
      return;
    }

    if (seededRef.current) return;
    seededRef.current = true;
    // Seed a thread with a friendly opener so chat/[id] has something to load.
    sendMessage(id, "👋");
  }, [id, sendMessage, state.threads]);

  return <ThemedLoadingScreen />;
}
