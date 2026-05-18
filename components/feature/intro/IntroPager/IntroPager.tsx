import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { AfterOnboardIntroSlide } from "@/components/feature/intro/AfterOnboardIntroSlide";
import { IntroDots } from "@/components/feature/intro/IntroDots";
import { IntroPagerGradient } from "@/components/feature/intro/IntroPagerGradient";
import { IntroSlide } from "@/components/feature/intro/IntroSlide";
import { AscendingSteps } from "@/components/feature/intro/visuals/AscendingSteps";
import { MountainPeak } from "@/components/feature/intro/visuals/MountainPeak";
import { Stopwatch } from "@/components/feature/intro/visuals/Stopwatch";
import { TargetArrow } from "@/components/feature/intro/visuals/TargetArrow";
import { Button } from "@/components/ui/Button";
import {
  INTRO_SLIDES,
  introUsesUnifiedGradient,
  type IntroSlideContent,
} from "@/constants/intro";
import { useTheme } from "@/context/ThemeContext";

const NEXT_ROUTE = "/onboarding/reasons";
const SWIPE_THRESHOLD_RATIO = 0.22;

export function IntroPager() {
  const { colors, resolved } = useTheme();
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const [pagerAndFooterH, setPagerAndFooterH] = useState(0);
  const translateX = useSharedValue(0);
  const total = INTRO_SLIDES.length;
  const isLast = index === total - 1;
  const currentSlide = INTRO_SLIDES[index];
  const unifiedGradient =
    currentSlide !== undefined && introUsesUnifiedGradient(currentSlide.id);

  const goTo = (page: number) => {
    const clamped = Math.max(0, Math.min(total - 1, page));
    setIndex(clamped);
    translateX.value = withTiming(-clamped * width, { duration: 320 });
  };

  const goNext = () => {
    if (isLast) {
      router.replace(NEXT_ROUTE);
      return;
    }
    goTo(index + 1);
  };

  const goBack = () => {
    if (index > 0) goTo(index - 1);
  };

  const pan = Gesture.Pan()
    .activeOffsetX([-12, 12])
    .failOffsetY([-20, 20])
    .onUpdate((e) => {
      const next = -index * width + e.translationX;
      const min = -(total - 1) * width;
      translateX.value = Math.max(min, Math.min(0, next));
    })
    .onEnd((e) => {
      const threshold = width * SWIPE_THRESHOLD_RATIO;
      let target = index;
      if (e.translationX < -threshold && index < total - 1) target = index + 1;
      else if (e.translationX > threshold && index > 0) target = index - 1;
      runOnJS(setIndex)(target);
      translateX.value = withTiming(-target * width, { duration: 280 });
    });

  const trackStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <SafeAreaView
      className="flex-1 bg-background dark:bg-d-bg"
      edges={["top", "bottom"]}
    >
      <View className="h-12 flex-row items-center px-4 pt-2">
        {index > 0 ? (
          <Pressable
            onPress={goBack}
            className="-ml-2 h-10 w-10 items-center justify-center rounded-full active:bg-section dark:active:bg-d-surface"
          >
            <Ionicons name="chevron-back" size={22} color={colors.foreground} />
          </Pressable>
        ) : (
          <View className="h-10 w-10" />
        )}
      </View>

      <View
        style={{ flex: 1, position: "relative" }}
        onLayout={(e) => {
          const w = Math.round(e.nativeEvent.layout.width);
          const h = Math.round(e.nativeEvent.layout.height);
          if (w > 0 && w !== width) {
            setWidth(w);
            translateX.value = -index * w;
          }
          if (h > 0 && h !== pagerAndFooterH) {
            setPagerAndFooterH(h);
          }
        }}
      >
        {unifiedGradient && pagerAndFooterH > 0 && width > 0 ? (
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <IntroPagerGradient
              gradientIdSuffix="intro-unified"
              width={width}
              height={pagerAndFooterH}
              colors={colors}
              isDark={resolved === "dark"}
            />
          </View>
        ) : null}

        <View className="flex-1 overflow-hidden">
          {width > 0 ? (
            <GestureDetector gesture={pan}>
              <Animated.View
                style={[
                  {
                    flex: 1,
                    flexDirection: "row",
                    width: width * total,
                  },
                  trackStyle,
                ]}
              >
                {INTRO_SLIDES.map((slide, i) => (
                  <Slide
                    key={slide.id}
                    slide={slide}
                    width={width}
                    active={i === index}
                  />
                ))}
              </Animated.View>
            </GestureDetector>
          ) : null}
        </View>

        <View
          className={[
            "gap-5 px-6 pb-6 pt-3",
            unifiedGradient ? "" : "bg-background dark:bg-d-bg",
          ].join(" ")}
          style={unifiedGradient ? { zIndex: 1 } : undefined}
        >
          <IntroDots total={total} active={index} />
          <Button
            label={isLast ? "Begin" : "Next"}
            size="lg"
            fullWidth
            onPress={goNext}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function Slide({
  slide,
  width,
  active,
}: {
  slide: IntroSlideContent;
  width: number;
  active: boolean;
}) {
  const { colors } = useTheme();

  const visual = (() => {
    switch (slide.id) {
      case "success":
        return <MountainPeak active={active} />;
      case "short-time":
        return <Stopwatch active={active} />;
      case "transformation":
        return <AscendingSteps active={active} />;
      case "chance":
        return <TargetArrow active={active} />;
    }
  })();

  if (slide.id === "after-onboard") {
    return (
      <View style={{ width, flex: 1 }}>
        <AfterOnboardIntroSlide slide={slide} />
      </View>
    );
  }

  return (
    <View style={{ width, flex: 1, backgroundColor: colors.background }}>
      <IntroSlide title={slide.title} body={slide.body} visual={visual} />
    </View>
  );
}
