import { View } from "react-native";

import { AppBrandMark } from "@/components/layout/AppBrandMark";
import { ScreenHeader } from "@/components/layout/ScreenHeader";

import { CommunityToolbar } from "./CommunityToolbar";

export function CommunityScrollHeader() {
  return (
    <View>
      <ScreenHeader leading={<AppBrandMark />} />
      <CommunityToolbar />
    </View>
  );
}
