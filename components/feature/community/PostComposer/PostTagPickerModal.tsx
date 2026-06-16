import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { POST_TAGS, type PostTagId } from "@/constants/community/postTags";
import { useTheme } from "@/context/ThemeContext";

import { PostTagOption } from "./PostTagOption";

type Props = {
  visible: boolean;
  selectedTagId: PostTagId | null;
  onSelect: (id: PostTagId) => void;
  onClose: () => void;
};

export function PostTagPickerModal({ visible, selectedTagId, onSelect, onClose }: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const handleSelect = (id: PostTagId) => {
    onSelect(id);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end">
        <Pressable className="absolute inset-0 bg-black/50" onPress={onClose} />

        <View
          className="rounded-t-3xl bg-background px-5 pt-4 dark:bg-d-bg"
          style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
        >
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-foreground dark:text-d-text">Add tag</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={24} color={colors.foreground} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {POST_TAGS.map((tag) => (
              <PostTagOption
                key={tag.id}
                tag={tag}
                selected={selectedTagId === tag.id}
                onSelect={handleSelect}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
