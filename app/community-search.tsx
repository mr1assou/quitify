import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { UserSearchPanel } from "@/components/feature/community/UserSearchPanel";
import { StackScreenHeader } from "@/components/layout/StackScreenHeader";

export default function CommunitySearchScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-d-bg" edges={["top", "bottom"]}>
      <StackScreenHeader title="Search" />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <UserSearchPanel />
      </ScrollView>
    </SafeAreaView>
  );
}
