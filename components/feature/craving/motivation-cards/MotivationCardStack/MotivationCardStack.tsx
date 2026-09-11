import { useEffect, useMemo, useRef } from "react";
import { View, useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  cancelAnimation,
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { MotivationQuoteCard } from "@/components/feature/craving/motivation-cards/MotivationQuoteCard";
import type { MotivationQuote } from "@/constants/craving/motivationQuotes";

const SWIPE_THRESHOLD_RATIO = 0.25;
const CARD_HEIGHT_RATIO = 0.62;
const SWIPE_OUT_DURATION_MS = 700;
const NEW_CARD_FADE_DURATION_MS = 900;
const SPRING_BACK = { damping: 22, stiffness: 90, mass: 1.1 } as const;

type Props = {
  quotes: readonly MotivationQuote[];
  currentIndex: number;
  onIndexChange: (next: number) => void;
  /** When set, swipes that would land on a disallowed index are cancelled. */
  canGoToIndex?: (nextIndex: number) => boolean;
  onSwipeBlocked?: () => void;
  /** Footer total override (defaults to quotes.length). Free tier still only unlocks 2 cards. */
  displayTotal?: number;
};

export function MotivationCardStack({
  quotes,
  currentIndex,
  onIndexChange,
  canGoToIndex,
  onSwipeBlocked,
  displayTotal,
}: Props) {
  const { width, height } = useWindowDimensions();
  const cardWidth = Math.min(width - 48, 360);
  const cardHeight = Math.min(height * CARD_HEIGHT_RATIO, 520);

  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const mountedRef = useRef(true);
  const swipeLockRef = useRef(false);

  const total = quotes.length;
  const safeIndex = total === 0 ? 0 : Math.min(Math.max(currentIndex, 0), total - 1);
  const currentQuote = quotes[safeIndex];
  const footerTotal = displayTotal ?? total;

  const currentIndexRef = useRef(safeIndex);
  const totalRef = useRef(total);
  const canGoToIndexRef = useRef(canGoToIndex);
  const onSwipeBlockedRef = useRef(onSwipeBlocked);
  const onIndexChangeRef = useRef(onIndexChange);

  currentIndexRef.current = safeIndex;
  totalRef.current = total;
  canGoToIndexRef.current = canGoToIndex;
  onSwipeBlockedRef.current = onSwipeBlocked;
  onIndexChangeRef.current = onIndexChange;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      swipeLockRef.current = false;
      cancelAnimation(translateX);
      cancelAnimation(opacity);
    };
  }, [opacity, translateX]);

  // Reset visuals when the quote list size changes (tab / catalog refresh).
  useEffect(() => {
    swipeLockRef.current = false;
    cancelAnimation(translateX);
    cancelAnimation(opacity);
    translateX.value = 0;
    opacity.value = 1;
  }, [total, opacity, translateX]);

  const nextIndexForDirection = (direction: 1 | -1, index: number, count: number) =>
    direction > 0 ? (index + 1) % count : (index - 1 + count) % count;

  const commitIndexChange = (direction: 1 | -1) => {
    if (!mountedRef.current) return;
    const count = totalRef.current;
    if (count <= 0) {
      swipeLockRef.current = false;
      return;
    }

    const nextIndex = nextIndexForDirection(direction, currentIndexRef.current, count);
    onIndexChangeRef.current(nextIndex);
    opacity.value = withTiming(1, {
      duration: NEW_CARD_FADE_DURATION_MS,
      easing: Easing.out(Easing.cubic),
    });
    swipeLockRef.current = false;
  };

  const rejectSwipe = () => {
    if (!mountedRef.current) return;
    swipeLockRef.current = false;
    translateX.value = withSpring(0, SPRING_BACK);
    onSwipeBlockedRef.current?.();
  };

  const trySwipe = (direction: 1 | -1) => {
    if (!mountedRef.current || swipeLockRef.current) return;
    const count = totalRef.current;
    if (count <= 0) return;

    const nextIndex = nextIndexForDirection(direction, currentIndexRef.current, count);
    if (canGoToIndexRef.current && !canGoToIndexRef.current(nextIndex)) {
      rejectSwipe();
      return;
    }

    swipeLockRef.current = true;
    animateSwipeOut(direction);
  };

  const animateSwipeOut = (direction: 1 | -1) => {
    "worklet";
    const target = direction > 0 ? -cardWidth * 1.4 : cardWidth * 1.4;
    translateX.value = withTiming(
      target,
      { duration: SWIPE_OUT_DURATION_MS, easing: Easing.inOut(Easing.cubic) },
      (finished) => {
        if (!finished) return;
        // Hide the card BEFORE we reset position + swap content,
        // so the snap-back to center is invisible (no flash).
        opacity.value = 0;
        translateX.value = 0;
        runOnJS(commitIndexChange)(direction);
      },
    );
  };

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-12, 12])
        .failOffsetY([-30, 30])
        .onUpdate((event) => {
          translateX.value = event.translationX;
        })
        .onEnd((event) => {
          const threshold = cardWidth * SWIPE_THRESHOLD_RATIO;
          if (event.translationX < -threshold) {
            runOnJS(trySwipe)(1);
          } else if (event.translationX > threshold) {
            runOnJS(trySwipe)(-1);
          } else {
            translateX.value = withSpring(0, SPRING_BACK);
          }
        }),
    // Gesture captures shared values / cardWidth; recreate when width changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- trySwipe uses refs
    [cardWidth, translateX],
  );

  const cardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-cardWidth, 0, cardWidth],
      [-10, 0, 10],
      Extrapolation.CLAMP,
    );
    return {
      opacity: opacity.value,
      transform: [
        { translateX: translateX.value },
        { rotateZ: `${rotate}deg` },
      ],
    };
  });

  if (!currentQuote) return null;

  const footer = `${Math.min(safeIndex + 1, footerTotal)} / ${footerTotal}`;

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
        <Animated.View
          style={[{ width: cardWidth, height: cardHeight }, cardStyle]}
        >
          <MotivationQuoteCard
            quote={currentQuote}
            width={cardWidth}
            height={cardHeight}
            footer={footer}
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
