import { Pressable, Text, View } from "react-native";

import { useTranslation } from "@/hooks/i18n/useTranslation";

export type ChatsSection = "chats" | "support";

type Props = {
  value: ChatsSection;
  onChange: (section: ChatsSection) => void;
};

export function ChatsSectionTabs({ value, onChange }: Props) {
  const { t } = useTranslation();
  const options: { id: ChatsSection; labelKey: "chat.tabsChats" | "chat.tabsSupport" }[] = [
    { id: "chats", labelKey: "chat.tabsChats" },
    { id: "support", labelKey: "chat.tabsSupport" },
  ];

  return (
    <View className="mx-6 mb-4 flex-row rounded-2xl bg-section p-1 dark:bg-d-surface">
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <Pressable
            key={opt.id}
            onPress={() => onChange(opt.id)}
            className={`flex-1 items-center justify-center rounded-xl py-2.5 ${
              active ? "bg-section dark:bg-d-elevated" : ""
            }`}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
          >
            <Text
              className={`text-sm font-semibold ${
                active
                  ? "text-foreground dark:text-d-text"
                  : "text-muted-foreground dark:text-d-muted"
              }`}
            >
              {t(opt.labelKey)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
