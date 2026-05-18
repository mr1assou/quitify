import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MissionCard } from "@/components/feature/missions/MissionCard";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { useTodayMission } from "@/hooks/useTodayMission";

export default function Missions() {
  const mission = useTodayMission();

  if (!mission) return null;

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-d-bg" edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <ScreenHeader title="Your Plan" />

        <View className="mt-6 px-6">
          <MissionCard mission={mission} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
