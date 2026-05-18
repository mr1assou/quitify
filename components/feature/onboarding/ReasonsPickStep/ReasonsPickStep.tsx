import { ScrollView, View } from "react-native";

import { Chip } from "@/components/ui/Chip";

type Option = { id: string; label: string };

type Props = {
  options: readonly Option[];
  selectedIds: readonly string[];
  onToggle: (id: string) => void;
};

export function ReasonsPickStep({ options, selectedIds, onToggle }: Props) {
  const ids = selectedIds ?? [];
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: 8 }}
    >
      <View className="flex-row flex-wrap justify-center gap-2">
        {options.map((o) => (
          <Chip
            key={o.id}
            label={o.label}
            selected={ids.includes(o.id)}
            onPress={() => onToggle(o.id)}
          />
        ))}
      </View>
    </ScrollView>
  );
}
