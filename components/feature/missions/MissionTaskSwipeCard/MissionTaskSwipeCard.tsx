import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import type { QuitPlanTaskType, ResolvedPlanTask } from "@/types";

const TASK_ICONS: Record<QuitPlanTaskType, keyof typeof Ionicons.glyphMap> = {
  action: "checkmark-circle-outline",
  breathing: "fitness",
  fact: "information-circle-outline",
  journal: "create-outline",
  game: "game-controller-outline",
  checkin: "pulse-outline",
  audio: "musical-notes-outline",
  reward: "ribbon-outline",
  social: "people-outline",
};

type Props = {
  task: ResolvedPlanTask;
  width: number;
  height: number;
  footer?: string;
  interactive: boolean;
  isToggling?: boolean;
  canSaveNotes?: boolean;
  onToggle: (taskId: string, value: boolean) => void;
  onOpenNote?: () => void;
};

const RADIUS = 28;

export function MissionTaskSwipeCard({
  task,
  width,
  height,
  footer,
  interactive,
  isToggling = false,
  canSaveNotes = false,
  onToggle,
  onOpenNote,
}: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const icon = TASK_ICONS[task.type] ?? "ellipse-outline";

  const markDone = () => {
    if (!interactive || task.done || isToggling) return;
    void onToggle(task.id, true);
  };

  return (
    <View
      style={{
        width,
        height,
        borderRadius: RADIUS,
        overflow: "hidden",
        backgroundColor: task.done ? colors.accent : colors.primary,
        shadowColor: "#000",
        shadowOpacity: 0.18,
        shadowOffset: { width: 0, height: 12 },
        shadowRadius: 24,
        elevation: 8,
      }}
    >
      <View style={{ flex: 1, paddingHorizontal: 28, paddingTop: 24, paddingBottom: 22 }}>
        <View className="mb-4 flex-row items-center justify-between">
          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
            <Ionicons
              name={task.done ? "checkmark-done" : icon}
              size={24}
              color={colors.white}
            />
          </View>
          {task.done ? (
            <View className="rounded-full bg-white/20 px-3 py-1">
              <Text className="text-xs font-semibold text-white">{t("common.done")}</Text>
            </View>
          ) : null}
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 12 }}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Text
            className="text-2xl font-bold leading-8 text-white"
            style={task.done ? { opacity: 0.9 } : undefined}
          >
            {task.title}
          </Text>
          <Text className="mt-4 text-base leading-6 text-white/85">{task.text}</Text>
          {task.note ? (
            <View className="mt-4 rounded-2xl bg-white/15 px-3 py-2">
              <Text className="text-xs font-semibold uppercase tracking-wide text-white/70">
                {t("missions.yourNote")}
              </Text>
              <Text className="mt-1 text-sm leading-5 text-white/90" numberOfLines={3}>
                {task.note}
              </Text>
            </View>
          ) : null}
        </ScrollView>

        <View className="mt-2">
          {canSaveNotes && onOpenNote ? (
            <Pressable
              onPress={onOpenNote}
              className="mb-3 flex-row items-center justify-center gap-2 rounded-2xl border border-white/30 py-2.5 active:opacity-80"
            >
              <Ionicons name="create-outline" size={16} color={colors.white} />
              <Text className="text-sm font-semibold text-white">
                {task.note ? t("missions.editNote") : t("missions.addNote")}
              </Text>
            </Pressable>
          ) : null}

          {interactive && !task.done ? (
            <Pressable
              onPress={markDone}
              disabled={isToggling}
              className="items-center rounded-2xl bg-section py-3.5 active:opacity-90"
            >
              {isToggling ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <Text className="text-base font-semibold text-primary">{t("missions.markDone")}</Text>
              )}
            </Pressable>
          ) : interactive && task.done ? (
            <Pressable
              onPress={() => {
                if (isToggling) return;
                void onToggle(task.id, false);
              }}
              disabled={isToggling}
              className="items-center py-2 active:opacity-70"
            >
              {isToggling ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text className="text-sm font-semibold text-white/90">{t("missions.undo")}</Text>
              )}
            </Pressable>
          ) : null}

          {footer ? (
            <Text className="mt-4 text-xs font-semibold tracking-wider text-white/70">
              {footer}
            </Text>
          ) : (
            <View className="h-4" />
          )}
        </View>
      </View>

      {isToggling ? (
        <View
          className="absolute inset-0 items-center justify-center rounded-[28px] bg-black/20"
          pointerEvents="none"
        >
          <ActivityIndicator size="large" color={colors.white} />
        </View>
      ) : null}
    </View>
  );
}
