import { View } from "react-native";

import { HamburgerButton } from "@/components/layout/HamburgerButton";
import { HeaderIconButton } from "@/components/layout/HeaderIconButton";
import { PremiumHeaderButton } from "@/components/layout/PremiumHeaderButton";
import { useApp } from "@/context/AppContext";
import { useNotifications } from "@/context/NotificationContext";
import { useChatUnreadTotal } from "@/hooks/chat/useChat";
import { safeRouter } from "@/utils/app/safeRouter";

export function ScreenHeaderActions() {
  const { state } = useApp();
  const unread = useChatUnreadTotal();
  const { unreadCount: notificationsUnread } = useNotifications();

  return (
    <View className="flex-row items-center">
      <View className="flex-row items-center gap-1">
        <HeaderIconButton
          icon="chatbubbles-outline"
          accessibilityLabel="Messages"
          badge={unread > 0 ? unread : undefined}
          onPress={() => safeRouter.push("/chats")}
        />
        <HeaderIconButton
          icon="notifications-outline"
          accessibilityLabel="Notifications"
          badge={notificationsUnread > 0 ? notificationsUnread : undefined}
          onPress={() => safeRouter.push("/notifications")}
        />
      </View>
      <View className="ml-1">
        <PremiumHeaderButton
          isPremium={state.isPremium}
          onPress={() => safeRouter.push(state.isPremium ? "/profile" : "/paywall")}
        />
      </View>
      <View className="ml-2.5">
        <HamburgerButton onPress={() => safeRouter.push("/profile")} />
      </View>
    </View>
  );
}
