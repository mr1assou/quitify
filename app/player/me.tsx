import { PlayerProfileScreen } from "@/components/feature/profile/PlayerProfileScreenView";
import { useSelfPlayerProfile } from "@/hooks/useSelfPlayerProfile";

/** Signed-in user's public player profile (no leaderboard refetch flash). */
export default function SelfPlayerProfileScreen() {
  const profile = useSelfPlayerProfile();

  return <PlayerProfileScreen profile={profile} />;
}
