import { ActivityIndicator, Modal, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";

type Props = {
  visible: boolean;
};

export function SlipSubmittingOverlay({ visible }: Props) {
  const { colors } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View
        className="flex-1 items-center justify-center bg-background/92 dark:bg-d-bg/92"
        accessibilityLiveRegion="polite"
        accessibilityLabel="Loading"
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    </Modal>
  );
}
