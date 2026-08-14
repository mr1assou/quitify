import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  COMMUNITY_FEED_SORT_OPTIONS,
  DEFAULT_COMMUNITY_FEED_FILTER,
} from "@/constants/community/communityFeedFilter";
import { POST_TAGS } from "@/constants/community/postTags";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { usePremiumGate } from "@/hooks/premium/usePremiumGate";
import type { TranslationKey } from "@/i18n/translate";
import type { CommunityFeedFilter, PostFeedSort } from "@/types/community/communityFeedFilter";

type Props = {
  visible: boolean;
  filter: CommunityFeedFilter;
  onApply: (filter: CommunityFeedFilter) => void;
  onClose: () => void;
};

const SORT_LABEL_KEY: Record<PostFeedSort, TranslationKey> = {
  newest: "community.newest",
  hottest: "community.mostPopular",
  most_commented: "community.mostDiscussed",
};

export function CommunityFeedFilterModal({ visible, filter, onApply, onClose }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { requirePremium } = usePremiumGate();
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState<CommunityFeedFilter>(filter);

  useEffect(() => {
    if (visible) setDraft(filter);
  }, [filter, visible]);

  const reset = () => {
    setDraft(DEFAULT_COMMUNITY_FEED_FILTER);
  };

  const apply = () => {
    if (!requirePremium()) return;
    onApply(draft);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end">
        <Pressable className="absolute inset-0 bg-black/50" onPress={onClose} />

        <View
          className="max-h-[85%] rounded-t-3xl bg-background px-5 pt-4 dark:bg-d-bg"
          style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
        >
          <View className="mb-5 flex-row items-center justify-between">
            <View>
              <Text className="text-lg font-bold text-foreground dark:text-d-text">
                {t("community.filterPosts")}
              </Text>
            </View>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={24} color={colors.foreground} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
              {t("community.sortBy")}
            </Text>
            <View className="gap-2">
              {COMMUNITY_FEED_SORT_OPTIONS.map((option) => (
                <SortOptionRow
                  key={option.id}
                  label={t(SORT_LABEL_KEY[option.id])}
                  selected={draft.sort === option.id}
                  onSelect={() =>
                    setDraft((current) => ({ ...current, sort: option.id }))
                  }
                />
              ))}
            </View>

            <Text className="mb-3 mt-6 text-xs font-bold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
              {t("community.topics")}
            </Text>
            <Pressable
              onPress={() => setDraft((current) => ({ ...current, tagId: null }))}
              className="mb-2 self-start rounded-full border px-4 py-2"
              style={{
                borderColor: draft.tagId === null ? colors.primary : colors.border,
                backgroundColor: draft.tagId === null ? `${colors.primary}14` : "transparent",
              }}
            >
              <Text
                className="text-sm font-semibold"
                style={{ color: draft.tagId === null ? colors.primary : colors.foreground }}
              >
                {t("community.allTopics")}
              </Text>
            </Pressable>

            <View className="flex-row flex-wrap gap-2 pb-2">
              {POST_TAGS.map((tag) => {
                const selected = draft.tagId === tag.id;
                return (
                  <Pressable
                    key={tag.id}
                    onPress={() =>
                      setDraft((current) => ({
                        ...current,
                        tagId: selected ? null : tag.id,
                      }))
                    }
                    className="rounded-full px-4 py-2"
                    style={{
                      backgroundColor: selected ? tag.backgroundColor : colors.section,
                      opacity: selected ? 1 : 0.92,
                    }}
                  >
                    <Text
                      className="text-sm font-semibold"
                      style={{ color: selected ? tag.textColor : colors.foreground }}
                    >
                      {tag.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          <View className="mt-4 flex-row gap-3 border-t border-section pt-4 dark:border-d-border">
            <Pressable
              onPress={reset}
              className="flex-1 items-center justify-center rounded-full border border-section py-3 dark:border-d-border"
            >
              <Text className="text-sm font-bold text-foreground dark:text-d-text">
                {t("community.resetFilters")}
              </Text>
            </Pressable>
            <Pressable
              onPress={apply}
              className="flex-1 items-center justify-center rounded-full py-3"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-sm font-bold text-white">{t("community.showPosts")}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function SortOptionRow({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onSelect}
      className="flex-row items-center rounded-2xl border px-4 py-3"
      style={{
        borderColor: selected ? colors.primary : colors.border,
        backgroundColor: selected ? `${colors.primary}10` : colors.section,
      }}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
    >
      <View
        className="mr-3 h-5 w-5 items-center justify-center rounded-full border-2"
        style={{ borderColor: selected ? colors.primary : colors.mutedForeground }}
      >
        {selected ? (
          <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: colors.primary }} />
        ) : null}
      </View>
      <View className="min-w-0 flex-1">
        <Text className="text-sm font-bold text-foreground dark:text-d-text">{label}</Text>
      </View>
    </Pressable>
  );
}
