import { ScrollView } from "react-native";
import { ScreenCanvas } from "@/components/layout/ScreenCanvas";

import { UserSearchPanel } from "@/components/feature/community/UserSearchPanel";
import { StackScreenHeader } from "@/components/layout/StackScreenHeader";

export default function CommunitySearchScreen() {
  return (
    <ScreenCanvas edges={["top", "bottom"]}>
      <StackScreenHeader title="Search" />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <UserSearchPanel />
      </ScrollView>
    </ScreenCanvas>
  );
}
