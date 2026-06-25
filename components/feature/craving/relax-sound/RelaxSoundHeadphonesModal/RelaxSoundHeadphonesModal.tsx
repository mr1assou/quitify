import * as Haptics from "expo-haptics";
import {
  Image,
  Modal,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

const HEADPHONE_IMAGE = require("../../../../../assets/images/headphones/headphone.webp");

type Props = {
  visible: boolean;
  onContinue: () => void;
  onClose: () => void;
};

export function RelaxSoundHeadphonesModal({ visible, onContinue, onClose }: Props) {
  const { width } = useWindowDimensions();
  const imageSize = Math.min(width * 0.52, 220);

  const handleContinue = () => {
    Haptics.selectionAsync().catch(() => {});
    onContinue();
  };

  const handleClose = () => {
    Haptics.selectionAsync().catch(() => {});
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View className="flex-1 items-center justify-center px-6">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          className="absolute inset-0 bg-black/50"
          onPress={handleClose}
        />

        <View className="w-full max-w-sm overflow-hidden rounded-3xl bg-background px-6 py-7 dark:bg-d-bg">
          <View className="items-center">
            <Image
              source={HEADPHONE_IMAGE}
              resizeMode="contain"
              style={{ width: imageSize, height: imageSize }}
              accessibilityIgnoresInvertColors
            />

            <Text className="mt-5 text-center text-xl font-bold text-foreground dark:text-d-text">
              Put on your headphones and relax
            </Text>

            <Text className="mt-2 text-center text-sm text-muted-foreground dark:text-d-muted">
              Find a quiet moment and let the sounds ease your craving.
            </Text>
          </View>

          <View className="mt-7 items-center gap-3">
            <Pressable
              accessibilityRole="button"
              onPress={handleContinue}
              className="rounded-2xl bg-primary px-10 py-3.5 dark:bg-primary"
            >
              <Text className="text-center text-base font-bold text-white">Continue</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={handleClose}
              className="items-center py-2"
            >
              <Text className="text-sm font-semibold text-muted-foreground dark:text-d-muted">
                Not now
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
