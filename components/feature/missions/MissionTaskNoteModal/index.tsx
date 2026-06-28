import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import {
  KeyboardAvoidingView,
  KeyboardProvider,
  useReanimatedKeyboardAnimation,
} from "react-native-keyboard-controller";
import {
  SafeAreaProvider,
  initialWindowMetrics,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { useTheme } from "@/context/ThemeContext";
import type { ResolvedPlanTask } from "@/types";

const NOTE_MAX_LENGTH = 500;

type Props = {
  visible: boolean;
  task: ResolvedPlanTask | null;
  saving?: boolean;
  onClose: () => void;
  onSave: (taskId: string, note: string) => Promise<void>;
};

export function MissionTaskNoteModal({
  visible,
  task,
  saving = false,
  onClose,
  onSave,
}: Props) {
  const { colors } = useTheme();
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible || !task) return;
    setNote(task.note ?? "");
    setError(null);
  }, [task, visible]);

  const trimmed = note.trim();
  const canSave = Boolean(task) && trimmed !== (task?.note ?? "").trim();

  const handleSave = () => {
    if (!task || !canSave || saving) return;
    setError(null);
    void Promise.resolve(onSave(task.id, trimmed))
      .then(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
          () => {},
        );
        onClose();
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Could not save note.");
      });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <KeyboardProvider>
          <NoteSheet
            colors={colors}
            taskTitle={task?.title ?? "Task"}
            note={note}
            trimmed={trimmed}
            canSave={canSave}
            saving={saving}
            error={error}
            onClose={onClose}
            onNoteChange={setNote}
            onSave={handleSave}
          />
        </KeyboardProvider>
      </SafeAreaProvider>
    </Modal>
  );
}

type SheetProps = {
  colors: ReturnType<typeof useTheme>["colors"];
  taskTitle: string;
  note: string;
  trimmed: string;
  canSave: boolean;
  saving: boolean;
  error: string | null;
  onClose: () => void;
  onNoteChange: (value: string) => void;
  onSave: () => void;
};

function NoteSheet({
  colors,
  taskTitle,
  note,
  trimmed,
  canSave,
  saving,
  error,
  onClose,
  onNoteChange,
  onSave,
}: SheetProps) {
  const insets = useSafeAreaInsets();
  const { height: keyboardHeight, progress } = useReanimatedKeyboardAnimation();

  const sheetStyle = useAnimatedStyle(() => ({
    paddingBottom:
      32 +
      keyboardHeight.value +
      (1 - progress.value) * Math.max(insets.bottom, 0),
  }));

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <View className="flex-1 justify-end bg-black/50">
        <Pressable accessibilityRole="button" className="flex-1" onPress={onClose} />
        <Animated.View
          style={sheetStyle}
          className="rounded-t-3xl bg-background px-6 pt-5 dark:bg-d-bg"
        >
          <View className="mb-5 flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-xl font-bold text-foreground dark:text-d-text">
                Your note
              </Text>
              <Text
                className="mt-1 text-sm text-muted-foreground dark:text-d-muted"
                numberOfLines={1}
              >
                {taskTitle}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              className="h-9 w-9 items-center justify-center rounded-full bg-section dark:bg-d-surface"
            >
              <Ionicons name="close" size={20} color={colors.mutedForeground} />
            </Pressable>
          </View>

          <Text className="mb-4 text-sm leading-5 text-muted-foreground dark:text-d-muted">
            Write anything you want to remember about this task. It will appear in Your notes
            on the map screen.
          </Text>

          <View className="gap-2">
            <TextInput
              value={note}
              onChangeText={(text) => onNoteChange(text.slice(0, NOTE_MAX_LENGTH))}
              placeholder="How did this task go? What did you learn?"
              placeholderTextColor={colors.mutedForeground}
              multiline
              textAlignVertical="top"
              autoCapitalize="sentences"
              autoCorrect
              className="min-h-[120px] rounded-2xl bg-section px-4 py-3 text-base text-foreground dark:bg-d-surface dark:text-d-text"
            />
            <Text className="text-xs text-muted-foreground dark:text-d-muted">
              {trimmed.length}/{NOTE_MAX_LENGTH} characters
            </Text>
          </View>

          {error ? <Text className="mt-4 text-sm text-alert">{error}</Text> : null}

          <Pressable
            accessibilityRole="button"
            disabled={!canSave || saving}
            onPress={onSave}
            className={`mt-6 items-center rounded-2xl py-3.5 ${
              canSave && !saving ? "bg-primary" : "bg-muted opacity-60"
            }`}
          >
            {saving ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text className="text-base font-bold text-white">Save note</Text>
            )}
          </Pressable>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}
