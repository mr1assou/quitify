import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { CravingTipCard } from "@/components/feature/craving/CravingTipCard";
import { useTheme } from "@/context/ThemeContext";
import type { CravingTip } from "@/types/craving";

type Props = {
  tip: CravingTip;
  onShuffle: () => void;
};

export function CravingTipSection({ tip, onShuffle }: Props) {
  const { colors } = useTheme();

  return (
    <View>
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
          Quick tip
        </Text>
        <Pressable
          onPress={onShuffle}
          hitSlop={8}
          className="flex-row items-center rounded-full px-3 py-1.5 active:bg-section dark:active:bg-d-surface"
          accessibilityLabel="Show another tip"
        >
          <Ionicons name="shuffle" size={14} color={colors.primary} />
          <Text className="ml-1 text-xs font-semibold text-primary dark:text-d-primary">
            Another tip
          </Text>
        </Pressable>
      </View>
      <CravingTipCard tip={tip} />
    </View>
  );
}
