import { View } from "react-native";

import { AppBrandMark } from "@/components/layout/AppBrandMark";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import type { CommunityFeedFilter } from "@/types/communityFeedFilter";

import { CommunityToolbar } from "./CommunityToolbar";

type Props = {
  filter: CommunityFeedFilter;
  onFilterChange: (filter: CommunityFeedFilter) => void;
};

export function CommunityScrollHeader({ filter, onFilterChange }: Props) {
  return (
    <View>
      <ScreenHeader leading={<AppBrandMark />} />
      <CommunityToolbar filter={filter} onFilterChange={onFilterChange} />
    </View>
  );
}
