import { Image } from "expo-image";
import { Modal, Pressable, Text, View } from "react-native";

import { COMMUNITY_ALERT_IMAGE } from "@/constants/app/assets";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function PostCommunityRulesModal({ visible, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center px-6">
        <Pressable className="absolute inset-0 bg-black/55" onPress={onClose} accessibilityLabel="Dismiss" />

        <View className="w-full max-w-sm overflow-hidden rounded-3xl bg-background dark:bg-d-bg">
          <View className="items-center px-6 pb-2 pt-6">
            <Image
              source={COMMUNITY_ALERT_IMAGE}
              style={{ width: 200, height: 200 }}
              contentFit="contain"
              accessibilityLabel="Community rules alert"
            />
          </View>

          <View className="px-6 pb-4">
            <Text className="mb-2 text-center text-lg font-bold text-foreground dark:text-d-text">
              Community rules
            </Text>
            <Text className="text-center text-base leading-6 text-muted-foreground dark:text-d-muted">
              Please respect our community. No sexual content and no topics outside quitting
              smoking. Breaking these rules may lead to your account being suspended.
            </Text>
          </View>

          <Pressable
            onPress={onClose}
            className="mx-6 mb-6 items-center rounded-full bg-primary py-3 active:opacity-80"
            accessibilityLabel="Close community rules"
          >
            <Text className="text-base font-bold text-white">Got it</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
