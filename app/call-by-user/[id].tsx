import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CallSessionScreen } from "@/components/feature/call/CallSessionScreen";
import { useApp } from "@/context/AppContext";
import { useCallParticipants } from "@/hooks/call/useCallParticipants";
import type { CallKind, CallRole } from "@/types/call/signaling";
import { parseDbUserId } from "@/utils/community/presence";

function createCallId(selfUserId: number | undefined): string {
  const seed = Math.random().toString(36).slice(2, 8);
  return `${selfUserId ?? "u"}-${Date.now()}-${seed}`;
}

export default function CallByUserScreen() {
  const { id, kind, role, callId } = useLocalSearchParams<{
    id: string;
    kind?: CallKind;
    role?: CallRole;
    callId?: string;
  }>();
  const { state } = useApp();
  const callKind: CallKind = kind === "video" ? "video" : "audio";
  const callRole: CallRole = role === "callee" ? "callee" : "caller";
  const { peer, self } = useCallParticipants(id);
  const peerUserId = parseDbUserId(id);

  // A caller generates a fresh call id; a callee reuses the invite's id.
  const resolvedCallId = useMemo(
    () => callId ?? createCallId(state.account?.userId),
    [callId, state.account?.userId],
  );

  if (!peer || peerUserId == null) {
    return (
      <SafeAreaView className="flex-1 bg-d-bg">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-base text-d-muted">
            Could not load this contact.
          </Text>
          <Pressable
            onPress={() => router.back()}
            className="mt-4 rounded-full bg-d-surface px-5 py-2.5 active:opacity-70"
          >
            <Text className="text-sm font-bold text-d-text">Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <CallSessionScreen
      peer={peer}
      self={self}
      kind={callKind}
      callId={resolvedCallId}
      role={callRole}
      peerUserId={peerUserId}
    />
  );
}
