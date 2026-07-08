import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import type { MediaStream } from "react-native-webrtc";

import { CallParticipantAvatar } from "@/components/feature/call/CallParticipantAvatar";
import { CallVideoView } from "@/components/feature/call/CallVideoView";
import type { CallStatus } from "@/hooks/call/useWebRTCCall";
import type { CommunityUser } from "@/types/community/community";

const PIP_WIDTH = 112;
const PIP_HEIGHT = 158;
const MAIN_AVATAR_SIZE = 148;

type ParticipantSlot = "peer" | "self";

type Props = {
  peer: CommunityUser;
  self: CommunityUser;
  label: string;
  status: CallStatus;
  cameraOn: boolean;
  peerCameraOn: boolean;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  peerPulseStyle: ReturnType<typeof useAnimatedStyle>;
};

type ParticipantTileProps = {
  who: ParticipantSlot;
  variant: "main" | "pip";
  peer: CommunityUser;
  self: CommunityUser;
  label: string;
  status: CallStatus;
  cameraOn: boolean;
  peerCameraOn: boolean;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  peerPulseStyle: ReturnType<typeof useAnimatedStyle>;
  onPress?: () => void;
};

function participantShowsVideo(
  who: ParticipantSlot,
  status: CallStatus,
  cameraOn: boolean,
  peerCameraOn: boolean,
  localStream: MediaStream | null,
  remoteStream: MediaStream | null,
): boolean {
  if (who === "peer") {
    return status === "connected" && remoteStream != null && peerCameraOn;
  }
  return cameraOn && localStream != null;
}

function ParticipantTile({
  who,
  variant,
  peer,
  self,
  label,
  status,
  cameraOn,
  peerCameraOn,
  localStream,
  remoteStream,
  peerPulseStyle,
  onPress,
}: ParticipantTileProps) {
  const user = who === "peer" ? peer : self;
  const isPeer = who === "peer";
  const stream = isPeer ? remoteStream : localStream;
  const showVideo = participantShowsVideo(
    who,
    status,
    cameraOn,
    peerCameraOn,
    localStream,
    remoteStream,
  );
  const pipAvatarSize = Math.min(PIP_WIDTH, PIP_HEIGHT) - 24;

  const video = showVideo && stream ? (
    <CallVideoView
      stream={stream}
      mirror={!isPeer}
      objectFit="cover"
      zOrder={variant === "pip" ? 1 : 0}
    />
  ) : null;

  if (variant === "pip") {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Swap camera view"
        className="absolute overflow-hidden rounded-2xl border-2 border-white/30 bg-black shadow-2xl active:opacity-95"
        style={{
          width: PIP_WIDTH,
          height: PIP_HEIGHT,
          right: 16,
          bottom: 16,
          elevation: 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.45,
          shadowRadius: 8,
        }}
      >
        {video ?? (
          <View className="flex-1 items-center justify-center bg-d-surface/90">
            <CallParticipantAvatar
              user={user}
              size={pipAvatarSize}
              ringColor="rgba(255,255,255,0.18)"
              showFlag
            />
          </View>
        )}
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Swap camera view"
      className="absolute inset-0 bg-black active:opacity-98"
    >
      {video ?? (
        <View className="flex-1 items-center justify-center px-6">
          {isPeer ? (
            <Animated.View style={peerPulseStyle}>
              <CallParticipantAvatar user={user} size={MAIN_AVATAR_SIZE} showFlag />
            </Animated.View>
          ) : (
            <CallParticipantAvatar
              user={user}
              size={MAIN_AVATAR_SIZE}
              ringColor="rgba(255,255,255,0.18)"
              showFlag
            />
          )}
          <Text
            className="mt-5 max-w-[260px] text-center text-2xl font-bold text-white"
            numberOfLines={1}
          >
            {isPeer ? user.name : "You"}
          </Text>
          <Text className="mt-2 text-sm tabular-nums text-white/70">{label}</Text>
        </View>
      )}

      {showVideo ? (
        <View className="absolute inset-x-0 bottom-0 bg-black/50 px-5 pb-4 pt-10">
          <Text className="text-xl font-bold text-white" numberOfLines={1}>
            {isPeer ? user.name : "You"}
          </Text>
          <Text className="mt-1 text-sm tabular-nums text-white/75">{label}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

export function VideoCallStage({
  peer,
  self,
  label,
  status,
  cameraOn,
  peerCameraOn,
  localStream,
  remoteStream,
  peerPulseStyle,
}: Props) {
  const [mainParticipant, setMainParticipant] = useState<ParticipantSlot>("peer");
  const pipParticipant: ParticipantSlot = mainParticipant === "peer" ? "self" : "peer";

  const swapParticipants = () => {
    setMainParticipant((current) => (current === "peer" ? "self" : "peer"));
  };

  const tileProps = {
    peer,
    self,
    label,
    status,
    cameraOn,
    peerCameraOn,
    localStream,
    remoteStream,
    peerPulseStyle,
    onPress: swapParticipants,
  };

  return (
    <View className="flex-1">
      <ParticipantTile who={mainParticipant} variant="main" {...tileProps} />
      <ParticipantTile who={pipParticipant} variant="pip" {...tileProps} />
    </View>
  );
}
