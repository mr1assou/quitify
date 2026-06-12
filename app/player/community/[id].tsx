import { useLocalSearchParams } from "expo-router";

import { PlayerProfileScreen } from "@/components/feature/profile/PlayerProfileScreenView";
import { useCommunityPlayerProfile } from "@/hooks/useCommunityPlayerProfile";

export default function CommunityPlayerProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const profile = useCommunityPlayerProfile(id ?? "");

  return <PlayerProfileScreen profile={profile} />;
}
