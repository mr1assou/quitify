import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  View,
  useWindowDimensions,
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

import { OnboardingFieldLabel } from "@/components/feature/onboarding/shared/OnboardingFieldLabel";
import { useTheme } from "@/context/ThemeContext";
import type { Country } from "@/types/app/country";

type Props = {
  countries: readonly Country[];
  selectedCode?: string;
  loading?: boolean;
  onSelect: (country: Country) => void;
  /** When false, parent renders the label (e.g. side-by-side with currency). */
  showLabel?: boolean;
  controlHeight?: number;
};

export function CountrySelectField({
  countries,
  selectedCode,
  loading,
  onSelect,
  showLabel = true,
  controlHeight = 48,
}: Props) {
  const { colors } = useTheme();
  const { height: winH } = useWindowDimensions();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected = useMemo(
    () => countries.find((c) => c.code === selectedCode),
    [countries, selectedCode],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.currencyCode.toLowerCase().includes(q),
    );
  }, [countries, query]);

  const maxListH = Math.min(winH * 0.45, 360);

  const closeModal = () => {
    setOpen(false);
    setQuery("");
  };

  return (
    <View className="w-full">
      {showLabel ? <OnboardingFieldLabel>Country</OnboardingFieldLabel> : null}
      <Pressable
        onPress={() => !loading && countries.length > 0 && setOpen(true)}
        disabled={loading || countries.length === 0}
        className={[
          "flex-row items-center justify-between rounded-2xl bg-section px-3 dark:bg-d-surface",
          showLabel ? "mt-1.5" : "",
        ].join(" ")}
        style={{ height: controlHeight }}
      >
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : selected ? (
          <View className="flex-1 flex-row items-center gap-3">
            <Image
              source={{ uri: selected.flagPng }}
              style={{ width: 24, height: 17, borderRadius: 2 }}
              contentFit="cover"
            />
            <Text
              className="flex-1 text-sm text-foreground dark:text-d-text"
              numberOfLines={1}
            >
              {selected.name}
            </Text>
          </View>
        ) : (
          <Text className="flex-1 text-sm text-muted-foreground dark:text-d-muted">
            Select country
          </Text>
        )}
        <Ionicons name="chevron-down" size={18} color={colors.mutedForeground} />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={closeModal}
      >
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <CountrySearchSheet
            colors={colors}
            filtered={filtered}
            maxListH={maxListH}
            query={query}
            selectedCode={selectedCode}
            onClose={closeModal}
            onQueryChange={setQuery}
            onSelect={(country) => {
              onSelect(country);
              closeModal();
            }}
          />
        </SafeAreaProvider>
      </Modal>
    </View>
  );
}

type CountrySearchSheetProps = {
  colors: ReturnType<typeof useTheme>["colors"];
  filtered: readonly Country[];
  maxListH: number;
  query: string;
  selectedCode?: string;
  onClose: () => void;
  onQueryChange: (value: string) => void;
  onSelect: (country: Country) => void;
};

function CountrySearchSheet({
  colors,
  filtered,
  maxListH,
  query,
  selectedCode,
  onClose,
  onQueryChange,
  onSelect,
}: CountrySearchSheetProps) {
  const insets = useSafeAreaInsets();
  const { height: winH } = useWindowDimensions();
  const { progress, height: keyboardHeight } = useReanimatedKeyboardAnimation();

  const topInset = Math.max(
    insets.top,
    Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) : 0,
  );
  const topGap = topInset + 16;

  const MIN_BOTTOM_PADDING = 16;
  const sheetStyle = useAnimatedStyle(() => {
    const keyboardOpen = keyboardHeight.value;
    const usableHeight = winH - topGap - keyboardOpen - 12;

    return {
      maxHeight: Math.max(Math.min(usableHeight, winH * 0.72), 220),
      paddingBottom:
        MIN_BOTTOM_PADDING +
        (1 - progress.value) * Math.max(insets.bottom - MIN_BOTTOM_PADDING, 0),
    };
  });

  const listStyle = useAnimatedStyle(() => {
    const keyboardOpen = keyboardHeight.value;
    const usableHeight = winH - topGap - keyboardOpen - 12;
    const sheetCap = Math.max(Math.min(usableHeight, winH * 0.72), 220);
    const listCap = Math.min(maxListH, sheetCap - 112);

    return {
      maxHeight: Math.max(listCap, 120),
    };
  });

  return (
    <KeyboardProvider>
      <View style={{ flex: 1, paddingTop: topGap }}>
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <Pressable className="flex-1 justify-end bg-black/45" onPress={onClose}>
            <Animated.View
              className="rounded-t-3xl bg-background px-3 pt-3 dark:bg-d-bg"
              style={sheetStyle}
              onStartShouldSetResponder={() => true}
            >
              <Text className="mb-2 px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
                Country
              </Text>
              <TextInput
                value={query}
                onChangeText={onQueryChange}
                placeholder="Search country…"
                placeholderTextColor={colors.mutedForeground}
                autoCapitalize="none"
                autoCorrect={false}
                className="mb-2 rounded-2xl bg-section px-4 py-3 text-base text-foreground dark:bg-d-surface dark:text-d-text"
              />
              <Animated.FlatList
                data={[...filtered]}
                keyExtractor={(item) => item.code}
                style={listStyle}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                ListEmptyComponent={
                  <Text className="py-6 text-center text-sm text-muted-foreground dark:text-d-muted">
                    No countries found
                  </Text>
                }
                renderItem={({ item }) => {
                  const active = item.code === selectedCode;
                  return (
                    <Pressable
                      onPress={() => onSelect(item)}
                      className="flex-row items-center gap-3 rounded-xl px-3 py-3 active:bg-section dark:active:bg-d-surface"
                    >
                      <Image
                        source={{ uri: item.flagPng }}
                        style={{ width: 32, height: 22, borderRadius: 3 }}
                        contentFit="cover"
                      />
                      <View className="min-w-0 flex-1">
                        <Text
                          className={
                            active
                              ? "text-base font-semibold text-primary dark:text-d-primary"
                              : "text-base text-foreground dark:text-d-text"
                          }
                          numberOfLines={1}
                        >
                          {item.name}
                        </Text>
                        <Text className="text-xs text-muted-foreground dark:text-d-muted">
                          {item.currencyCode}
                        </Text>
                      </View>
                    </Pressable>
                  );
                }}
              />
            </Animated.View>
          </Pressable>
        </KeyboardAvoidingView>
      </View>
    </KeyboardProvider>
  );
}
