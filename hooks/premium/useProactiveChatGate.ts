import { useCallback } from "react";

import { usePremiumGate } from "@/hooks/premium/usePremiumGate";
import type { ChatMessage } from "@/types/chat/chat";
import type { CommunityUser } from "@/types/community/community";
import {
  canInitiateCall,
  canSendChatMessage,
} from "@/utils/premium/chatAccess";

/** Gates proactive chat actions while allowing free users to reply after contact. */
export function useProactiveChatGate(
  participant: CommunityUser | undefined,
  messages: readonly ChatMessage[],
) {
  const { isPremium, requirePremium } = usePremiumGate();

  const canSend = canSendChatMessage(isPremium, messages, participant);
  const canCall = canInitiateCall(isPremium);

  const requireSendAccess = useCallback((): boolean => {
    if (canSendChatMessage(isPremium, messages, participant)) return true;
    return requirePremium();
  }, [isPremium, messages, participant, requirePremium]);

  const requireCallAccess = useCallback((): boolean => {
    if (canInitiateCall(isPremium)) return true;
    return requirePremium();
  }, [isPremium, requirePremium]);

  return {
    isPremium,
    canSend,
    canCall,
    requireSendAccess,
    requireCallAccess,
  };
}
