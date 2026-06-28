import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import type { MediaStream } from "react-native-webrtc";

import { CallParticipantAvatar } from "@/components/feature/call/CallParticipantAvatar";
import { CallVideoView } from "@/components/feature/call/CallVideoView";
import type { CallStatus } from "@/hooks/call/useWebRTCCall";
import type { CommunityUser } from "@/types/community/community";

type Props = {
  peer: CommunityUser;
  self: CommunityUser;
  label: string;
  status: CallStatus;
  cameraOn: boolean;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  peerPulseStyle: ReturnType<typeof useAnimatedStyle>;
  stageHeight: number;
  stageWidth: number;
};

export function VideoCallStage({
  peer,
  self,
  label,
  status,
  cameraOn,
  localStream,
  remoteStream,
  peerPulseStyle,
  stageHeight,
  stageWidth,
}: Props) {
  const panelWidth = stageWidth - 32;
  const peerPanelHeight = stageHeight * 0.64;
  const selfPanelHeight = stageHeight * 0.36;
  const showRemoteVideo = status === "connected" && remoteStream != null;

  return (
    <View className="flex-1 px-4 pt-4">
      <View style={{ height: stageHeight }} className="gap-3">
        {/* Remote participant — full video when connected, avatar while ringing */}
        <View
          className="relative overflow-hidden rounded-3xl border border-d-border/80 bg-black"
          style={{ height: peerPanelHeight }}
        >
          {showRemoteVideo ? (
            <CallVideoView stream={remoteStream} objectFit="cover" />
          ) : (
            <Animated.View
              style={[
                peerPulseStyle,
                { flex: 1, alignItems: "center", justifyContent: "center" },
              ]}
            >
              <CallParticipantAvatar
                user={peer}
                size={Math.min(panelWidth * 0.38, 168)}
                showFlag
              />
            </Animated.View>
          )}

          <View className="absolute inset-x-0 bottom-0 bg-black/45 px-4 pb-4 pt-8">
            <Text className="text-xl font-bold text-white" numberOfLines={1}>
              {peer.name}
            </Text>
            <Text className="mt-1 text-sm tabular-nums text-white/75">{label}</Text>
          </View>
        </View>

        {/* Local preview */}
        <View
          className="relative overflow-hidden rounded-3xl border border-d-border/80 bg-black"
          style={{ height: selfPanelHeight }}
        >
          {cameraOn && localStream ? (
            <>
              <CallVideoView stream={localStream} mirror objectFit="cover" zOrder={1} />
              <Text className="absolute bottom-3 left-4 text-xs font-semibold text-white/80">
                You
              </Text>
            </>
          ) : (
            <View className="flex-1 items-center justify-center bg-d-surface/80">
              {cameraOn ? (
                <CallParticipantAvatar
                  user={self}
                  size={Math.min(panelWidth * 0.26, 108)}
                  ringColor="rgba(255,255,255,0.18)"
                  showFlag
                />
              ) : (
                <>
                  <Ionicons name="videocam-off" size={32} color="rgba(255,255,255,0.8)" />
                  <Text className="mt-2 text-xs font-semibold text-white/70">
                    Camera off
                  </Text>
                </>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
