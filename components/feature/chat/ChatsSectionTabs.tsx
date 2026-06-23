import { Pressable, Text, View } from "react-native";

export type ChatsSection = "chats" | "support";

const OPTIONS: { id: ChatsSection; label: string }[] = [
  { id: "chats", label: "Chats" },
  { id: "support", label: "Support" },
];

type Props = {
  value: ChatsSection;
  onChange: (section: ChatsSection) => void;
};

export function ChatsSectionTabs({ value, onChange }: Props) {
  return (
    <View className="mx-6 mb-4 flex-row rounded-2xl bg-section p-1 dark:bg-d-surface">
      {OPTIONS.map((opt) => {
        const active = opt.id === value;
        return (
          <Pressable
            key={opt.id}
            onPress={() => onChange(opt.id)}
            className={`flex-1 items-center justify-center rounded-xl py-2.5 ${
              active ? "bg-background dark:bg-d-elevated" : ""
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
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
