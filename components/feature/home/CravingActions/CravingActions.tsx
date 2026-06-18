import { safeRouter } from "@/utils/app/safeRouter";
import { View } from "react-native";

import { CravingCTA } from "@/components/feature/home/CravingCTA";
import { HomeSectionTitle } from "@/components/feature/home/HomeSectionTitle";
import { SlipCTA } from "@/components/feature/home/SlipCTA";

export function CravingActions() {
  return (
    <View>
      <HomeSectionTitle title="Craving support" />
      <View className="items-center">
        <View className="flex-row items-center justify-center gap-3 px-1">
          <SlipCTA
            onPress={() =>
              safeRouter.push({ pathname: "/craving-session", params: { start: "slip" } })
            }
          />
          <CravingCTA onPress={() => safeRouter.push("/craving-session")} />
        </View>
      </View>
    </View>
  );
}
