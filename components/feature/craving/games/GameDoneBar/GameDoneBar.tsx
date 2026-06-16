import { View } from "react-native";

import { Button } from "@/components/ui/Button";

type Props = {
  onPress: () => void;
};

/** Ends an open-ended craving mini-game when the player is ready. */
export function GameDoneBar({ onPress }: Props) {
  return (
    <View className="px-6 pb-4">
      <Button label="End game" variant="ghost" size="md" fullWidth onPress={onPress} />
    </View>
  );
}
