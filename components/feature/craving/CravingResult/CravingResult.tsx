import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { Image, Text, useWindowDimensions, View } from "react-native";
import Animated, { FadeIn, FadeInUp, ZoomIn } from "react-native-reanimated";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SMOKED_QUESTION_IMAGE, SMOKED_RESULT_IMAGE } from "@/constants/assets";
import { useTheme } from "@/context/ThemeContext";
import type { CravingOutcome } from "@/types";

const AnimatedImage = Animated.createAnimatedComponent(Image);

/** Hero illustration size for slip / smoked follow-up screens. */
function useSmokedHeroSize() {
  const { width } = useWindowDimensions();
  return Math.round(Math.min(width * 0.82, 360));
}

type Props = {
  /** Called when the user picks an outcome — parent should log it. */
  onSubmit: (outcome: CravingOutcome) => void;
  /** Undo the last submit when the user goes back from a lapse/relapse result. */
  onUndoSubmit?: () => void;
  /** Called when the user closes the result screen. */
  onDone: () => void;
  /** Registers a header back handler while lapse/relapse result is visible. */
  onOutcomeBackChange?: (handler: (() => void) | null) => void;
  /** Skip the “you made it through” step and open the slip follow-up directly. */
  initialStage?: "ask" | "smoked";
};

type Stage = "ask" | "smoked" | "done-resisted" | "done-lapse" | "done-relapse";

export function CravingResult({
  onSubmit,
  onUndoSubmit,
  onDone,
  onOutcomeBackChange,
  initialStage = "ask",
}: Props) {
  const { colors } = useTheme();
  const heroSize = useSmokedHeroSize();
  const [stage, setStage] = useState<Stage>(initialStage);

  const handleOutcomeBack = useCallback(() => {
    onUndoSubmit?.();
    setStage("smoked");
  }, [onUndoSubmit]);

  useEffect(() => {
    const showBack = stage === "done-lapse" || stage === "done-relapse";
    onOutcomeBackChange?.(showBack ? handleOutcomeBack : null);
  }, [stage, handleOutcomeBack, onOutcomeBackChange]);

  useEffect(() => {
    return () => onOutcomeBackChange?.(null);
  }, [onOutcomeBackChange]);

  if (stage === "ask") {
    return (
      <Animated.View entering={FadeInUp.duration(400)} className="gap-4">
        <View className="items-center">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-accent-soft dark:bg-d-accent-soft">
            <Ionicons name="trophy" size={28} color={colors.accent} />
          </View>
          <Text className="mt-3 text-2xl font-bold text-foreground dark:text-d-text">
            You made it through
          </Text>
          <Text className="mt-1 px-6 text-center text-sm text-muted-foreground dark:text-d-muted">
            How did this one go? Be honest — there&apos;s no judgement here.
          </Text>
        </View>

        <View className="gap-3">
          <Button
            label="I resisted"
            variant="accent"
            size="lg"
            fullWidth
            leading={<Ionicons name="shield-checkmark" size={18} color={colors.white} />}
            onPress={() => {
              onSubmit("resisted");
              setStage("done-resisted");
            }}
          />
          <Button
            label="I smoked"
            variant="ghost"
            size="lg"
            fullWidth
            onPress={() => setStage("smoked")}
          />
        </View>
      </Animated.View>
    );
  }

  if (stage === "smoked") {
    return (
      <View className="gap-4">
        <View className="items-center">
          <AnimatedImage
            source={SMOKED_QUESTION_IMAGE}
            accessibilityLabel="Was it just one cigarette, or are you back to smoking?"
            entering={ZoomIn.springify().damping(14).stiffness(120)}
            style={{ width: heroSize, height: heroSize }}
            resizeMode="contain"
          />
          <Animated.View entering={FadeInUp.delay(220).duration(400)} className="items-center">
            <Text className="mt-3 text-2xl font-bold text-foreground dark:text-d-text">
              Was it just one, or are you back?
            </Text>
            <Text className="mt-1 px-6 text-center text-sm text-muted-foreground dark:text-d-muted">
              Be honest — your progress, rank and badges stay either way.
            </Text>
          </Animated.View>
        </View>

        <Animated.View entering={FadeInUp.delay(380).duration(400)} className="gap-3">
          <Button
            label="Just one — I'm still in"
            variant="primary"
            size="lg"
            fullWidth
            onPress={() => {
              onSubmit("lapse");
              setStage("done-lapse");
            }}
          />
          <Button
            label="I'm back to smoking"
            variant="ghost"
            size="lg"
            fullWidth
            onPress={() => {
              onSubmit("relapse");
              setStage("done-relapse");
            }}
          />
        </Animated.View>
      </View>
    );
  }

  if (stage === "done-lapse") {
    return <LapseResult heroSize={heroSize} onDone={onDone} />;
  }

  if (stage === "done-relapse") {
    return <RelapseResult heroSize={heroSize} onDone={onDone} />;
  }

  return (
    <Animated.View entering={FadeIn.duration(400)} className="gap-4">
      <Card variant="section" className="items-center">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-accent">
          <Ionicons name="shield-checkmark" size={28} color={colors.white} />
        </View>
        <Text className="mt-3 text-center text-2xl font-bold text-foreground dark:text-d-text">
          You&apos;re stronger than the urge
        </Text>
        <Text className="mt-1 px-2 text-center text-sm text-muted-foreground dark:text-d-muted">
          Every win makes the next craving smaller.
        </Text>
      </Card>

      <Button label="Back to home" size="lg" fullWidth onPress={onDone} />
    </Animated.View>
  );
}

function LapseResult({ heroSize, onDone }: { heroSize: number; onDone: () => void }) {
  return (
    <SmokedOutcomeResult
      heroSize={heroSize}
      imageAccessibilityLabel="One slip doesn't undo your progress"
      title="One slip. Not the end."
      subtitle="Be proud you showed up to log it. Tomorrow is still yours."
      buttonLabel="Keep going"
      onDone={onDone}
    />
  );
}

function RelapseResult({ heroSize, onDone }: { heroSize: number; onDone: () => void }) {
  return (
    <SmokedOutcomeResult
      heroSize={heroSize}
      imageAccessibilityLabel="You can start fresh — your progress still counts"
      title="Let's restart, stronger."
      subtitle="You’re still moving forward — and that matters."
      buttonLabel="Start fresh"
      onDone={onDone}
    />
  );
}

function SmokedOutcomeResult({
  heroSize,
  imageAccessibilityLabel,
  title,
  subtitle,
  buttonLabel,
  onDone,
}: {
  heroSize: number;
  imageAccessibilityLabel: string;
  title: string;
  subtitle: string;
  buttonLabel: string;
  onDone: () => void;
}) {
  const { colors } = useTheme();

  return (
    <View className="items-center gap-5">
      <AnimatedImage
        source={SMOKED_RESULT_IMAGE}
        accessibilityLabel={imageAccessibilityLabel}
        entering={ZoomIn.springify().damping(13).stiffness(110)}
        style={{ width: heroSize, height: heroSize }}
        resizeMode="contain"
      />

      <Animated.View entering={FadeInUp.delay(220).duration(420)} className="items-center">
        <Text className="text-center text-2xl font-bold leading-7 text-foreground dark:text-d-text">
          {title}
        </Text>
        <Text className="mt-2 max-w-[300px] text-center text-[15px] leading-5 text-muted-foreground dark:text-d-muted">
          {subtitle}
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(380).duration(420)}
        className="w-full gap-2 rounded-3xl border border-section bg-section/40 p-4 dark:border-d-border dark:bg-d-surface"
      >
        <KeepsRow icon="trophy" tint={colors.accent} label="Your Freedom Points" value="Kept" />
        <KeepsRow icon="ribbon" tint={colors.primary} label="Your badges" value="Kept" />
        <KeepsRow icon="trending-up" tint={colors.primary} label="Your rank" value="Kept" />
        <View className="h-px bg-section dark:bg-d-border" />
        <KeepsRow
          icon="flame"
          tint={colors.alert}
          label="Smoke-free streak"
          value="Resets"
          valueTone="alert"
        />
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(540).duration(420)} className="w-full">
        <Button label={buttonLabel} size="lg" fullWidth onPress={onDone} />
      </Animated.View>
    </View>
  );
}

function KeepsRow({
  icon,
  tint,
  label,
  value,
  valueTone = "default",
}: {
  icon: keyof typeof Ionicons.glyphMap;
  tint: string;
  label: string;
  value: string;
  valueTone?: "default" | "alert";
}) {
  const { colors } = useTheme();
  const valueColor = valueTone === "alert" ? colors.alert : colors.primary;

  return (
    <View className="flex-row items-center">
      <View
        className="h-9 w-9 items-center justify-center rounded-full"
        style={{ backgroundColor: `${tint}22` }}
      >
        <Ionicons name={icon} size={16} color={tint} />
      </View>
      <Text className="ml-3 flex-1 text-sm font-semibold text-foreground dark:text-d-text">
        {label}
      </Text>
      <Text className="text-sm font-bold" style={{ color: valueColor }}>
        {value}
      </Text>
    </View>
  );
}
