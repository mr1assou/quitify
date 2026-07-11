import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenCanvas } from "@/components/layout/ScreenCanvas";

import { ChatListRow } from "@/components/feature/chat/ChatListRow";
import {
  ChatsSectionTabs,
  type ChatsSection,
} from "@/components/feature/chat/ChatsSectionTabs";
import { SupportStaffRow } from "@/components/feature/chat/SupportStaffRow";
import { StackScreenHeader } from "@/components/layout/StackScreenHeader";
import { isSupportRole } from "@/constants/auth/userRoles";
import { useApp } from "@/context/AppContext";
import { useCommunity } from "@/context/CommunityContext";
import { useTheme } from "@/context/ThemeContext";
import { useChatThreads } from "@/hooks/chat/useChat";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { fetchSupportUsers } from "@/services/chat/chatApi";
import type { CommunityUser } from "@/types/community/community";
import { safeRouter } from "@/utils/app/safeRouter";
import { mapSupportUserToCommunityUser } from "@/utils/chat/mapBackendChat";

function parseChatsSection(value: string | string[] | undefined): ChatsSection {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === "support" ? "support" : "chats";
}

export default function ChatsScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { section: sectionParam } = useLocalSearchParams<{ section?: string | string[] }>();
  const { state } = useApp();
  const insets = useSafeAreaInsets();
  const { loadChatThreads } = useCommunity();
  const threads = useChatThreads();
  const listBottom = Math.max(insets.bottom, 16) + 16;

  const isSupportStaff = isSupportRole(state.account?.role);
  const [section, setSection] = useState<ChatsSection>(() =>
    parseChatsSection(sectionParam),
  );
  const [supportList, setSupportList] = useState<CommunityUser[]>([]);
  const [isLoadingSupport, setIsLoadingSupport] = useState(false);
  const [supportError, setSupportError] = useState<string | null>(null);

  const loadSupportList = useCallback(async () => {
    setIsLoadingSupport(true);
    setSupportError(null);
    try {
      const page = await fetchSupportUsers();
      setSupportList(page.items.map(mapSupportUserToCommunityUser));
    } catch {
      setSupportError(
        isSupportStaff ? t("chat.loadUsersFailed") : t("chat.loadSupportFailed"),
      );
      setSupportList([]);
    } finally {
      setIsLoadingSupport(false);
    }
  }, [isSupportStaff]);

  useEffect(() => {
    if (parseChatsSection(sectionParam) === "support") {
      setSection("support");
      void loadSupportList();
    }
  }, [sectionParam, loadSupportList]);

  useFocusEffect(
    useCallback(() => {
      void loadChatThreads();
      if (section === "support") {
        void loadSupportList();
      }
    }, [loadChatThreads, section, loadSupportList]),
  );

  const handleSectionChange = useCallback(
    (next: ChatsSection) => {
      setSection(next);
      if (next === "support") {
        void loadSupportList();
      }
    },
    [loadSupportList],
  );

  return (
    <ScreenCanvas edges={["top", "bottom"]}>
      <StackScreenHeader
        title={t("chat.tabsChats")}
        rightAction={
          section === "chats" ? (
            <Pressable
              onPress={() => safeRouter.push("/community-search")}
              hitSlop={8}
              accessibilityLabel={t("common.search")}
            >
              <Ionicons name="search-outline" size={22} color={colors.primary} />
            </Pressable>
          ) : null
        }
      />

      <ChatsSectionTabs value={section} onChange={handleSectionChange} />

      {section === "chats" ? (
        <FlatList
          data={threads}
          keyExtractor={(t) => t.threadId}
          ItemSeparatorComponent={() => (
            <View className="mx-6 h-px bg-section dark:bg-d-border" />
          )}
          renderItem={({ item }) => <ChatListRow preview={item} />}
          ListEmptyComponent={
            <View className="items-center px-6 pt-16">
              <Ionicons name="chatbubbles-outline" size={48} color={colors.mutedForeground} />
              <Text className="mt-3 text-center text-base font-semibold text-foreground dark:text-d-text">
                {t("chat.noChatsYet")}
              </Text>
              <Text className="mt-1 text-center text-sm text-muted-foreground dark:text-d-muted">
                {isSupportStaff
                  ? t("chat.supportTabHintStaff")
                  : t("chat.supportTabHintUser")}
              </Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: listBottom }}
        />
      ) : isLoadingSupport ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={supportList}
          keyExtractor={(user) => user.id}
          ItemSeparatorComponent={() => <View className="h-2" />}
          renderItem={({ item }) => (
            <View className="px-6">
              <SupportStaffRow user={item} />
            </View>
          )}
          ListEmptyComponent={
            <View className="items-center px-6 pt-16">
              <Ionicons
                name={isSupportStaff ? "people-outline" : "chatbubbles-outline"}
                size={48}
                color={colors.mutedForeground}
              />
              <Text className="mt-3 text-center text-base font-semibold text-foreground dark:text-d-text">
                {supportError ??
                  (isSupportStaff
                    ? t("chat.noSupportTeammates")
                    : t("chat.noSupportAvailable"))}
              </Text>
              {!supportError ? (
                <Text className="mt-1 text-center text-sm text-muted-foreground dark:text-d-muted">
                  {isSupportStaff
                    ? t("chat.supportTeammatesEmpty")
                    : t("chat.supportTeamEmpty")}
                </Text>
              ) : null}
            </View>
          }
          contentContainerStyle={{ paddingBottom: listBottom, paddingTop: 4 }}
        />
      )}
    </ScreenCanvas>
  );
}
