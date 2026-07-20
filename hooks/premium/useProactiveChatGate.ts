import { useCallback } from "react";

import { usePremiumGate } from "@/hooks/premium/usePremiumGate";
import type { ChatMessage } from "@/types/chat/chat";
import type { CommunityUser } from "@/types/community/community";
import { canSendChatMessage } from "@/utils/premium/chatAccess";

/** Gates proactive chat actions while allowing free users to reply after contact. */
export function useProactiveChatGate(
  participant: CommunityUser | undefined,
  messages: readonly ChatMessage[],
) {
  const { isPremium, requirePremium } = usePremiumGate();

  const canSend = canSendChatMessage(isPremium, messages, participant);

  const requireSendAccess = useCallback((): boolean => {
    if (canSendChatMessage(isPremium, messages, participant)) return true;
    return requirePremium();
  }, [isPremium, messages, participant, requirePremium]);

  return {
    isPremium,
    canSend,
    requireSendAccess,
  };
}
