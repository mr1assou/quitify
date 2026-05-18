import { router } from "expo-router";
import { Text, View } from "react-native";

import { CravingCTA } from "@/components/feature/home/CravingCTA";
import { SlipCTA } from "@/components/feature/home/SlipCTA";

export function CravingActions() {
  return (
    <View className="items-center">
      <View className="flex-row items-center justify-center gap-3 px-1">
        <SlipCTA
          onPress={() =>
            router.push({ pathname: "/craving-session", params: { start: "slip" } })
          }
        />
        <CravingCTA onPress={() => router.push("/craving-session")} />
      </View>
    </View>
  );
}
