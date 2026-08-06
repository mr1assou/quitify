import type { RefObject } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
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
import { useTranslation } from "@/hooks/i18n/useTranslation";

/** Extra space between the composer and the keyboard. */
const KEYBOARD_GAP = 20;

type Props = {
  visible: boolean;
  value: string;
  placeholder: string;
  inputRef: RefObject<TextInput | null>;
  onChangeText: (text: string) => void;
  onClose: () => void;
};

export function OnboardingOtherComposer({
  visible,
  value,
  placeholder,
  inputRef,
  onChangeText,
  onClose,
}: Props) {
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <KeyboardProvider statusBarTranslucent navigationBarTranslucent>
          <ComposerBar
            inputRef={inputRef}
            value={value}
            placeholder={placeholder}
            onChangeText={onChangeText}
            onDone={onClose}
            doneLabel={t("common.done")}
            closeLabel={t("common.close")}
          />
        </KeyboardProvider>
      </SafeAreaProvider>
    </Modal>
  );
}

type BarProps = {
  inputRef: RefObject<TextInput | null>;
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  onDone: () => void;
  doneLabel: string;
  closeLabel: string;
};

function ComposerBar({
  inputRef,
  value,
  placeholder,
  onChangeText,
  onDone,
  doneLabel,
  closeLabel,
}: BarProps) {
  const { colors, resolved } = useTheme();
  const isDark = resolved === "dark";
  const insets = useSafeAreaInsets();
  const { height: keyboardHeight, progress } = useReanimatedKeyboardAnimation();

  const barStyle = useAnimatedStyle(() => ({
    paddingBottom:
      KEYBOARD_GAP +
      keyboardHeight.value +
      (1 - progress.value) * Math.max(insets.bottom - KEYBOARD_GAP, 0),
  }));

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <View className="flex-1 justify-end">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={closeLabel}
          className="absolute inset-0 bg-black/45"
          onPress={onDone}
        />

        <Animated.View
          style={barStyle}
          className={`border-t px-4 pt-3 ${
            isDark
              ? "border-d-border/60 bg-d-bg"
              : "border-border/70 bg-background"
          }`}
        >
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-sm font-semibold text-foreground dark:text-d-text">
              {placeholder}
            </Text>
            <Pressable onPress={onDone} hitSlop={8} className="active:opacity-70">
              <Text className="text-sm font-bold text-primary">{doneLabel}</Text>
            </Pressable>
          </View>

          <View
            className={`mb-2 rounded-2xl px-4 py-3 ${
              isDark ? "bg-d-elevated" : "bg-section"
            }`}
          >
            <TextInput
              ref={inputRef}
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              placeholderTextColor={colors.mutedForeground}
              multiline
              autoFocus
              textAlignVertical="top"
              style={{
                color: colors.foreground,
                fontSize: 15,
                lineHeight: 20,
                minHeight: 72,
                maxHeight: 140,
              }}
            />
          </View>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}
