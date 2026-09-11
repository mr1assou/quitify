import { View, useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { MissionTaskSwipeCard } from "@/components/feature/missions/MissionTaskSwipeCard";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import type { ResolvedPlanTask } from "@/types";

const SWIPE_THRESHOLD_RATIO = 0.25;
const CARD_HEIGHT_RATIO = 0.62;
const SWIPE_OUT_DURATION_MS = 700;
const NEW_CARD_FADE_DURATION_MS = 900;
const SPRING_BACK = { damping: 22, stiffness: 90, mass: 1.1 } as const;

type Props = {
  tasks: readonly ResolvedPlanTask[];
  currentIndex: number;
  onIndexChange: (next: number) => void;
  interactive: boolean;
  canSaveNotes?: boolean;
  onToggle: (taskId: string, value: boolean) => void;
  onOpenNote?: (taskId: string) => void;
  togglingTaskId?: string | null;
};

const MIN_CARD_WIDTH = 280;
const MIN_CARD_HEIGHT = 400;

export function MissionTaskCardStack({
  tasks,
  currentIndex,
  onIndexChange,
  interactive,
  canSaveNotes = false,
  onToggle,
  onOpenNote,
  togglingTaskId = null,
}: Props) {
  const { t } = useTranslation();
  const { width, height } = useWindowDimensions();
  const cardWidth = Math.min(Math.max(width - 48, MIN_CARD_WIDTH), 360);
  const cardHeight = Math.max(
    Math.min(height * CARD_HEIGHT_RATIO, 520),
    MIN_CARD_HEIGHT,
  );

  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const total = tasks.length;
  const currentTask = tasks[currentIndex];

  const commitIndexChange = (direction: 1 | -1) => {
    const nextIndex =
      direction > 0
        ? (currentIndex + 1) % total
        : (currentIndex - 1 + total) % total;
    onIndexChange(nextIndex);
    opacity.value = withTiming(1, {
      duration: NEW_CARD_FADE_DURATION_MS,
      easing: Easing.out(Easing.cubic),
    });
  };

  const animateSwipeOut = (direction: 1 | -1) => {
    "worklet";
    const target = direction > 0 ? -cardWidth * 1.4 : cardWidth * 1.4;
    translateX.value = withTiming(
      target,
      { duration: SWIPE_OUT_DURATION_MS, easing: Easing.inOut(Easing.cubic) },
      (finished) => {
        if (!finished) return;
        opacity.value = 0;
        translateX.value = 0;
        runOnJS(commitIndexChange)(direction);
      },
    );
  };

  const pan = Gesture.Pan()
    .enabled(!togglingTaskId)
    .activeOffsetX([-12, 12])
    .failOffsetY([-30, 30])
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      const threshold = cardWidth * SWIPE_THRESHOLD_RATIO;
      if (event.translationX < -threshold) {
        animateSwipeOut(1);
      } else if (event.translationX > threshold) {
        animateSwipeOut(-1);
      } else {
        translateX.value = withSpring(0, SPRING_BACK);
      }
    });

  const cardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-cardWidth, 0, cardWidth],
      [-10, 0, 10],
      Extrapolation.CLAMP,
    );
    return {
      opacity: opacity.value,
      transform: [{ translateX: translateX.value }, { rotateZ: `${rotate}deg` }],
    };
  });

  if (!currentTask) return null;

  const footer = t("missions.taskOf", {
    current: currentIndex + 1,
    total,
  });

  return (
    <View
      style={{
        width: cardWidth,
        height: cardHeight,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <GestureDetector gesture={pan}>
        <Animated.View style={[{ width: cardWidth, height: cardHeight }, cardStyle]}>
          <MissionTaskSwipeCard
            task={currentTask}
            width={cardWidth}
            height={cardHeight}
            footer={footer}
            interactive={interactive}
            canSaveNotes={canSaveNotes}
            isToggling={togglingTaskId === currentTask.id}
            onToggle={onToggle}
            onOpenNote={onOpenNote ? () => onOpenNote(currentTask.id) : undefined}
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
