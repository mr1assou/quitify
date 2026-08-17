import { View } from "react-native";

import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/hooks/i18n/useTranslation";

type Props = {
  onPress: () => void;
};

/** Ends an open-ended craving mini-game when the player is ready. */
export function GameDoneBar({ onPress }: Props) {
  const { t } = useTranslation();

  return (
    <View className="px-6 pb-4">
      <Button label={t("craving.endGame")} variant="ghost" size="md" fullWidth onPress={onPress} />
    </View>
  );
}
