import { useLocalSearchParams } from "expo-router";

import { PlayerProfileScreen } from "@/components/feature/profile/PlayerProfileScreenView";
import { useLeaderboardPlayer } from "@/hooks/useLeaderboardPlayer";

export default function LeaderboardPlayerProfileScreen() {
  const { rank: rankParam } = useLocalSearchParams<{ rank: string }>();
  const rank = Number.parseInt(rankParam ?? "", 10);
  const profile = useLeaderboardPlayer(rank);

  return <PlayerProfileScreen profile={profile} />;
}
