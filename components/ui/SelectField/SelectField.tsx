import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/context/ThemeContext";

import type { DropdownOption } from "@/types";

type Props = {
  /** e.g. "Month" — shown above the control */
  fieldLabel: string;
  value: number | undefined;
  placeholder: string;
  options: readonly DropdownOption[];
  onChange: (value: number | undefined) => void;
  /** Short label on the row e.g. "Mo" / "Day" / "Yr" when compact */
  compactHint?: string;
};

export function SelectField({
  fieldLabel,
  value,
  placeholder,
  options,
  onChange,
  compactHint,
}: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { height: winH } = useWindowDimensions();
  const [open, setOpen] = useState(false);

  const selectedLabel =
    value !== undefined ? options.find((o) => o.value === value)?.label : undefined;

  const maxListH = Math.min(winH * 0.45, 320);

  return (
    <View className="min-w-0 flex-1">
      <Text className="mb-1 text-xs text-muted-foreground dark:text-d-muted">
        {compactHint ?? fieldLabel}
      </Text>
      <Pressable
        onPress={() => setOpen(true)}
        className="flex-row items-center justify-between rounded-2xl bg-section px-3 py-3 dark:bg-d-surface"
      >
        <Text
          className="flex-1 text-base text-foreground dark:text-d-text"
          numberOfLines={1}
        >
          {selectedLabel ?? placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color={colors.mutedForeground} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade">
        <Pressable
          className="flex-1 justify-end bg-black/45"
          onPress={() => setOpen(false)}
        >
          <View
            className="rounded-t-3xl bg-background px-3 pt-3 dark:bg-d-bg"
            style={{ paddingBottom: Math.max(insets.bottom, 16) }}
          >
            <Text className="mb-2 px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
              {fieldLabel}
            </Text>
            <FlatList
              data={[...options]}
              keyExtractor={(item) => String(item.value)}
              style={{ maxHeight: maxListH }}
              showsVerticalScrollIndicator
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                const active = item.value === value;
                return (
                  <Pressable
                    onPress={() => {
                      onChange(item.value);
                      setOpen(false);
                    }}
                    className="rounded-xl px-3 py-3 active:bg-section dark:active:bg-d-surface"
                  >
                    <Text
                      className={
                        active
                          ? "text-base font-semibold text-primary dark:text-d-primary"
                          : "text-base text-foreground dark:text-d-text"
                      }
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              }}
            />
            <Pressable
              onPress={() => {
                onChange(undefined);
                setOpen(false);
              }}
              className="mt-1 items-center py-3"
            >
              <Text className="text-base font-semibold text-muted-foreground dark:text-d-muted">
                Clear
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
