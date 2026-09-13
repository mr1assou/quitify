import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/context/ThemeContext";
import type { StringDropdownOption } from "@/types/shared/ui";

type Props = {
  fieldLabel: string;
  value: string | undefined;
  placeholder: string;
  options: readonly StringDropdownOption[];
  onChange: (value: string | undefined) => void;
  /** When false, hides the Clear action (required fields). */
  allowClear?: boolean;
  showLabel?: boolean;
  controlHeight?: number;
  /** Caps the options list height inside the bottom sheet. */
  maxListHeight?: number;
  compact?: boolean;
  disabled?: boolean;
  loading?: boolean;
};

export function SelectFieldString({
  fieldLabel,
  value,
  placeholder,
  options,
  onChange,
  allowClear = true,
  showLabel = true,
  controlHeight,
  maxListHeight,
  compact = false,
  disabled = false,
  loading = false,
}: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { height: winH } = useWindowDimensions();
  const [open, setOpen] = useState(false);

  const selectedLabel =
    value !== undefined ? options.find((o) => o.value === value)?.label : undefined;

  const maxListH = maxListHeight ?? Math.min(winH * 0.45, 320);
  const useSimpleList = options.length <= 6;

  const renderOption = (item: StringDropdownOption) => {
    const active = item.value === value;
    return (
      <Pressable
        key={item.value}
        onPress={() => {
          onChange(item.value);
          setOpen(false);
        }}
        className="rounded-xl px-3 py-3.5 active:bg-section dark:active:bg-d-surface"
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
  };

  return (
    <View className="w-full">
      {showLabel ? (
        <Text className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
          {fieldLabel}
        </Text>
      ) : null}
      <Pressable
        onPress={() => !disabled && !loading && setOpen(true)}
        disabled={disabled || loading}
        className={[
          "flex-row items-center justify-between rounded-2xl bg-section dark:bg-d-surface",
          compact ? "px-2" : "px-4",
          controlHeight == null && !compact ? "py-3" : "",
          disabled || loading ? "opacity-50" : "",
        ].join(" ")}
        style={controlHeight != null ? { height: controlHeight } : undefined}
      >
        <Text
          className={
            selectedLabel
              ? `flex-1 ${compact ? "text-xs" : "text-base"} text-foreground dark:text-d-text`
              : `flex-1 ${compact ? "text-xs" : "text-base"} text-muted-foreground dark:text-d-muted`
          }
          numberOfLines={1}
        >
          {selectedLabel ?? placeholder}
        </Text>
        {loading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Ionicons
            name="chevron-down"
            size={compact ? 16 : 18}
            color={colors.mutedForeground}
          />
        )}
      </Pressable>

      <Modal visible={open} transparent animationType="fade">
        <Pressable
          className="flex-1 justify-end bg-black/45"
          onPress={() => setOpen(false)}
        >
          <Pressable
            className="rounded-t-3xl bg-background px-3 pt-3 dark:bg-d-bg"
            style={{ paddingBottom: Math.max(insets.bottom, 16) }}
            onPress={() => {}}
          >
            <Text className="mb-2 px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
              {fieldLabel}
            </Text>
            {useSimpleList ? (
              <View>{options.map(renderOption)}</View>
            ) : (
              <FlatList
                data={[...options]}
                keyExtractor={(item) => item.value}
                style={{ maxHeight: maxListH }}
                showsVerticalScrollIndicator
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => renderOption(item)}
              />
            )}
            {allowClear ? (
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
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
