import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Modal, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  uri: string;
  visible: boolean;
  onClose: () => void;
  accessibilityLabel?: string;
};

export function ChatImageLightbox({
  uri,
  visible,
  onClose,
  accessibilityLabel = "Chat image",
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View className="flex-1 bg-black">
        <Pressable
          onPress={onClose}
          className="absolute right-4 z-10 h-10 w-10 items-center justify-center rounded-full bg-white/20"
          style={{ top: Math.max(insets.top, 12) + 8 }}
          accessibilityLabel="Close image"
        >
          <Ionicons name="close" size={24} color="white" />
        </Pressable>

        <Pressable className="flex-1" onPress={onClose} accessibilityLabel="Close image">
          <Image
            source={{ uri }}
            style={{ flex: 1 }}
            contentFit="contain"
            accessibilityLabel={accessibilityLabel}
          />
        </Pressable>
      </View>
    </Modal>
  );
}
