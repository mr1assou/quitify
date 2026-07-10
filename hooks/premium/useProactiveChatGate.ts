import { useCallback } from "react";
import { Alert } from "react-native";

import { usePremiumGate } from "@/hooks/premium/usePremiumGate";
import type { ChatMessage } from "@/types/chat/chat";
import type { CommunityUser } from "@/types/community/community";
import {
  canInitiateCall,
  canSendChatMessage,
  hasMutualChat,
  MUTUAL_CHAT_REQUIRED_FOR_CALL_MESSAGE,
} from "@/utils/premium/chatAccess";

/** Gates proactive chat actions while allowing free users to reply after contact. */
export function useProactiveChatGate(
  participant: CommunityUser | undefined,
  messages: readonly ChatMessage[],
) {
  const { isPremium, requirePremium } = usePremiumGate();

  const canSend = canSendChatMessage(isPremium, messages, participant);
  const canCall = canInitiateCall(isPremium, messages);

  const requireSendAccess = useCallback((): boolean => {
    if (canSendChatMessage(isPremium, messages, participant)) return true;
    return requirePremium();
  }, [isPremium, messages, participant, requirePremium]);

  const requireCallAccess = useCallback((): boolean => {
    if (!isPremium) return requirePremium();
    if (!hasMutualChat(messages)) {
      Alert.alert("Calls unavailable", MUTUAL_CHAT_REQUIRED_FOR_CALL_MESSAGE);
      return false;
    }
    return true;
  }, [isPremium, messages, requirePremium]);

  return {
    isPremium,
    canSend,
    canCall,
    requireSendAccess,
    requireCallAccess,
  };
}
