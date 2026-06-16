import { Text, View } from "react-native";

import {
  COLOR_SWITCH_PALETTE,
  type ColorSwitchColor,
} from "@/constants/craving/games/colorSwitch";

type Props = {
  score: number;
  ballColor: ColorSwitchColor;
};

export function ColorSwitchHud({ score, ballColor }: Props) {
  return (
    <View className="flex-row items-center justify-between px-6 pb-2 pt-1">
      <View>
        <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
          Score
        </Text>
        <Text className="font-mono text-2xl font-bold tabular-nums text-foreground dark:text-d-text">
          {score}
        </Text>
      </View>

      <View className="items-end">
        <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
          Ball
        </Text>
        <View
          className="mt-1 h-5 w-5 rounded-full"
          style={{
            backgroundColor: COLOR_SWITCH_PALETTE[ballColor],
            shadowColor: COLOR_SWITCH_PALETTE[ballColor],
            shadowOpacity: 0.8,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 0 },
          }}
        />
      </View>
    </View>
  );
}
