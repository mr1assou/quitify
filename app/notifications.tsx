import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { StackScreenHeader } from "@/components/layout/StackScreenHeader";

export default function NotificationsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-d-bg" edges={["top", "bottom"]}>
      <StackScreenHeader title="Notifications" />
      <View className="flex-1 items-center justify-center px-8">
        <Text className="text-center text-sm text-muted-foreground dark:text-d-muted">
          You&apos;re all caught up. New notifications will show up here.
        </Text>
      </View>
    </SafeAreaView>
  );
}
