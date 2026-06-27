import { router, useLocalSearchParams } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CallSessionScreen } from "@/components/feature/call/CallSessionScreen";
import { useCallParticipants } from "@/hooks/call/useCallParticipants";
import type { CallKind } from "@/types/chat/chat";

export default function CallByUserScreen() {
  const { id, kind } = useLocalSearchParams<{ id: string; kind?: CallKind }>();
  const callKind: CallKind = kind === "video" ? "video" : "audio";
  const { peer, self } = useCallParticipants(id);

  if (!peer) {
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

  return <CallSessionScreen peer={peer} self={self} kind={callKind} />;
}
