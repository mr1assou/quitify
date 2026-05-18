import { useLocalSearchParams } from "expo-router";

import { CravingSessionFlow } from "@/components/feature/craving/CravingSessionFlow";
import { SlipSupportFlow } from "@/components/feature/craving/SlipSupportFlow";

export default function CravingSessionScreen() {
  const { start } = useLocalSearchParams<{ start?: string }>();

  if (start === "slip") {
    return <SlipSupportFlow />;
  }

  return <CravingSessionFlow />;
}
