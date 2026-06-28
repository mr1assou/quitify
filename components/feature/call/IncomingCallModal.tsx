import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import InCallManager from "react-native-incall-manager";
import { SafeAreaView } from "react-native-safe-area-context";

import { CallParticipantAvatar } from "@/components/feature/call/CallParticipantAvatar";
import { useCall } from "@/context/CallContext";
import { useCommunity } from "@/context/CommunityContext";
import { mapIncomingCallToCommunityUser } from "@/utils/call/mapIncomingCall";
import { dbAuthorId } from "@/utils/community/presence";
import { emitCallReject } from "@/services/realtime/callSocket";

/** Full-screen prompt shown whenever someone is calling the signed-in user. */
export function IncomingCallModal() {
  const { incomingCall, clearIncomingCall } = useCall();
  const { upsertAuthor } = useCommunity();
  const visible = incomingCall != null;

  useEffect(() => {
    if (!visible) return;
    try {
      InCallManager.startRingtone("_DEFAULT_", [1, 1000, 800], "playback", 30);
    } catch {
      // ignore ringtone errors
    }
    return () => {
      try {
        InCallManager.stopRingtone();
      } catch {
        // ignore
      }
    };
  }, [visible]);

  if (!incomingCall) return null;

  const caller = mapIncomingCallToCommunityUser(incomingCall);
  const callLabel =
    incomingCall.kind === "video" ? "Incoming video call" : "Incoming voice call";

  const accept = () => {
    upsertAuthor(caller);
    clearIncomingCall();
    router.push({
      pathname: "/call-by-user/[id]",
      params: {
        id: dbAuthorId(incomingCall.fromUserId),
        kind: incomingCall.kind,
        role: "callee",
        callId: incomingCall.callId,
      },
    });
  };

  const decline = () => {
    emitCallReject(incomingCall.fromUserId, incomingCall.callId);
    clearIncomingCall();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View className="flex-1 bg-d-bg">
        <SafeAreaView className="flex-1 items-center justify-between py-12">
          <View className="items-center pt-10">
            <Text className="text-sm font-bold uppercase tracking-widest text-d-muted">
              {callLabel}
            </Text>
            <View className="mt-10">
              <CallParticipantAvatar user={caller} size={150} showFlag />
            </View>
            <Text
              className="mt-6 max-w-[260px] text-center text-2xl font-bold text-d-text"
              numberOfLines={1}
            >
              {caller.name}
            </Text>
            <Text className="mt-2 text-sm text-d-muted">is calling you…</Text>
          </View>

          <View className="w-full flex-row items-center justify-around px-10 pb-6">
            <Pressable
              onPress={decline}
              accessibilityLabel="Decline call"
              className="items-center active:opacity-85"
            >
              <View className="h-[72px] w-[72px] items-center justify-center rounded-full bg-alert">
                <Ionicons
                  name="call"
                  size={30}
                  color="#FFFFFF"
                  style={{ transform: [{ rotate: "135deg" }] }}
                />
              </View>
              <Text className="mt-3 text-sm font-medium text-d-muted">Decline</Text>
            </Pressable>

            <Pressable
              onPress={accept}
              accessibilityLabel="Accept call"
              className="items-center active:opacity-85"
            >
              <View className="h-[72px] w-[72px] items-center justify-center rounded-full bg-emerald-500">
                <Ionicons name="call" size={30} color="#FFFFFF" />
              </View>
              <Text className="mt-3 text-sm font-medium text-d-muted">Accept</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
