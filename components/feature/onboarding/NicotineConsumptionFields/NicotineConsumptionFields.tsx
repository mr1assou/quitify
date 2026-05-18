import { Platform, Text, TextInput, View } from "react-native";

import type { OnboardingDraft } from "@/types";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  draft: OnboardingDraft;
  patch: (next: Partial<OnboardingDraft>) => void;
};

function parseOptionalPositiveDecimal(raw: string): number | undefined {
  const t = raw.trim().replace(",", ".");
  if (!t.length) return undefined;
  const n = Number(t);
  if (!Number.isFinite(n) || n <= 0) return undefined;
  return Math.round(n * 10_000) / 10_000;
}

function parseOptionalNonNegativeDecimal(raw: string): number | undefined {
  const t = raw.trim().replace(",", ".");
  if (!t.length) return undefined;
  const n = Number(t);
  if (!Number.isFinite(n) || n < 0) return undefined;
  return Math.round(n * 10_000) / 10_000;
}

function NumberLine({
  label,
  keyboardType,
  value,
  treatZeroAsEmpty,
  onRawChangeText,
}: {
  label: string;
  keyboardType: "decimal-pad" | "number-pad";
  value?: number;
  treatZeroAsEmpty?: boolean;
  onRawChangeText: (raw: string) => void;
}) {
  const { colors } = useTheme();

  const hide = value === undefined || (treatZeroAsEmpty && value === 0);
  const display = hide ? "" : String(value);

  return (
    <View className="gap-1.5">
      <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
        {label}
      </Text>
      <TextInput
        value={display}
        onChangeText={onRawChangeText}
        placeholder="—"
        placeholderTextColor={colors.mutedForeground}
        keyboardType={keyboardType}
        className="rounded-2xl bg-section px-4 py-3 text-base text-foreground dark:bg-d-surface dark:text-d-text"
      />
    </View>
  );
}

const decPad = Platform.OS === "android" ? "number-pad" : ("decimal-pad" as const);

export function NicotineConsumptionFields({ draft, patch }: Props) {
  return (
    <View className="w-full gap-4">
      <NumberLine
        label="How many cigarettes do you smoke per day?"
        keyboardType={decPad}
        value={draft.cigarettesPerDay}
        treatZeroAsEmpty
        onRawChangeText={(raw) => {
          if (raw.trim() === "") {
            patch({ cigarettesPerDay: 0 });
            return;
          }
          const v = parseOptionalPositiveDecimal(raw);
          if (v !== undefined) patch({ cigarettesPerDay: v });
        }}
      />
      <NumberLine
        label="How much does one pack cost?"
        keyboardType={decPad}
        value={draft.packCost}
        onRawChangeText={(raw) => {
          if (raw.trim() === "") {
            patch({ packCost: undefined });
            return;
          }
          const v = parseOptionalNonNegativeDecimal(raw);
          if (v === undefined) return;
          patch({ packCost: v });
        }}
      />
      <NumberLine
        label="How many cigarettes are in one pack?"
        keyboardType={decPad}
        value={draft.cigarettesPerPack}
        treatZeroAsEmpty
        onRawChangeText={(raw) => {
          if (raw.trim() === "") {
            patch({ cigarettesPerPack: 0 });
            return;
          }
          const v = parseOptionalPositiveDecimal(raw);
          if (v !== undefined) patch({ cigarettesPerPack: v });
        }}
      />
      <NumberLine
        label="For how many years have you been smoking?"
        keyboardType={decPad}
        value={draft.nicotineHabitYears}
        onRawChangeText={(raw) => {
          if (!raw.trim()) {
            patch({ nicotineHabitYears: undefined });
            return;
          }
          const v = parseOptionalNonNegativeDecimal(raw);
          if (v === undefined) return;
          patch({ nicotineHabitYears: v });
        }}
      />
    </View>
  );
}
