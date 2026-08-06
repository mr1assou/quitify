import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";

import { PostCommunityRulesModal } from "./PostCommunityRulesModal";

type Props = {
  isEditing?: boolean;
};

export function PostComposerHeader({ isEditing = false }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [rulesVisible, setRulesVisible] = useState(false);

  return (
    <>
      <View className="flex-row items-center gap-3 px-5 pb-2 pt-3">
        <Pressable onPress={() => router.back()} hitSlop={8} accessibilityLabel={t("common.close")}>
          <Ionicons name="close" size={24} color={colors.foreground} />
        </Pressable>

        <Text className="min-w-0 flex-1 text-xl font-bold text-foreground dark:text-d-text">
          {isEditing ? t("community.editPost") : t("community.createPost")}
        </Text>

        {!isEditing ? (
          <Pressable
            onPress={() => setRulesVisible(true)}
            hitSlop={8}
            accessibilityLabel={t("community.rulesA11y")}
            className="flex-row items-center gap-1 rounded-full border border-section px-3 py-1.5 active:opacity-80 dark:border-d-border"
          >
            <Ionicons name="shield-checkmark-outline" size={16} color={colors.primary} />
            <Text className="text-sm font-semibold text-primary">{t("community.rules")}</Text>
          </Pressable>
        ) : null}
      </View>

      <PostCommunityRulesModal visible={rulesVisible} onClose={() => setRulesVisible(false)} />
    </>
  );
}
