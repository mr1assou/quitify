import { View } from "react-native";

import { HamburgerButton } from "@/components/layout/HamburgerButton";
import { HeaderIconButton } from "@/components/layout/HeaderIconButton";
import { PremiumHeaderButton } from "@/components/layout/PremiumHeaderButton";
import { useIsPremium } from "@/hooks/auth/useIsPremium";
import { useNotifications } from "@/context/NotificationContext";
import { useChatUnreadTotal } from "@/hooks/chat/useChat";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { PAYWALL_SOURCE } from "@/constants/analytics/paywall";
import { openPaywall } from "@/utils/analytics/openPaywall";
import { safeRouter } from "@/utils/app/safeRouter";

export function ScreenHeaderActions() {
  const { t } = useTranslation();
  const isPremium = useIsPremium();
  const unread = useChatUnreadTotal();
  const { unreadCount: notificationsUnread } = useNotifications();

  return (
    <View className="flex-row items-center">
      <View className="flex-row items-center gap-1">
        <HeaderIconButton
          icon="chatbubbles-outline"
          accessibilityLabel={t("layout.messages")}
          badge={unread > 0 ? unread : undefined}
          onPress={() => safeRouter.push("/chats")}
        />
        <HeaderIconButton
          icon="notifications-outline"
          accessibilityLabel={t("layout.notifications")}
          badge={notificationsUnread > 0 ? notificationsUnread : undefined}
          onPress={() => safeRouter.push("/notifications")}
        />
      </View>
      {isPremium ? null : (
        <View className="ml-1">
          <PremiumHeaderButton
            isPremium={false}
            onPress={() => openPaywall(PAYWALL_SOURCE.header)}
          />
        </View>
      )}
      <View className="ml-2.5">
        <HamburgerButton onPress={() => safeRouter.push("/profile")} />
      </View>
    </View>
  );
}
