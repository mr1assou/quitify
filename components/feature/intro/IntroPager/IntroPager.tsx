import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { safeRouter } from "@/utils/app/safeRouter";
import { useEffect, useRef, useState } from "react";
import {
  BackHandler,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
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
  introUsesUnifiedGradient,
  type IntroSlideContent,
} from "@/constants/app/intro";
import { useTheme } from "@/context/ThemeContext";
import { useIntroSlides } from "@/hooks/i18n/useIntroSlides";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { logIntroSlide } from "@/services/analytics/firebaseEvents";

const NEXT_ROUTE = "/onboarding/reasons";
const SWIPE_THRESHOLD_RATIO = 0.22;

export function IntroPager() {
  const navigation = useNavigation();
  const { colors, resolved } = useTheme();
  const { t } = useTranslation();
  const slides = useIntroSlides();
  const { width: windowWidth } = useWindowDimensions();
  // Ready on first paint so welcome→intro does not slide over an empty screen.
  const [width, setWidth] = useState(() => Math.round(windowWidth));
  const [index, setIndex] = useState(0);
  const [pagerAndFooterH, setPagerAndFooterH] = useState(0);
  const translateX = useSharedValue(0);
  const total = slides.length;
  const isLast = index === total - 1;
  const currentSlide = slides[index];
  const unifiedGradient =
    currentSlide !== undefined && introUsesUnifiedGradient(currentSlide.id);
  const pageWidth = Math.max(width, 1);
  const indexRef = useRef(index);
  indexRef.current = index;
  const pageWidthRef = useRef(pageWidth);
  pageWidthRef.current = pageWidth;
  const allowLeaveRef = useRef(false);

  useEffect(() => {
    logIntroSlide(index + 1);
  }, [index]);

  const goTo = (page: number) => {
    const clamped = Math.max(0, Math.min(total - 1, page));
    indexRef.current = clamped;
    setIndex(clamped);
    translateX.value = withTiming(-clamped * pageWidthRef.current, {
      duration: 320,
    });
  };

  const goNext = () => {
    if (isLast) {
      allowLeaveRef.current = true;
      safeRouter.replace(NEXT_ROUTE);
      return;
    }
    goTo(index + 1);
  };

  const goBack = () => {
    if (indexRef.current > 0) {
      goTo(indexRef.current - 1);
      return;
    }
    allowLeaveRef.current = true;
    safeRouter.backOr("/onboarding");
  };

  // System back / edge swipe: step slides first; leave only from slide 1.
  useEffect(() => {
    const onHardwareBack = () => {
      if (indexRef.current > 0) {
        goTo(indexRef.current - 1);
        return true;
      }
      return false;
    };
    const hardwareSub = BackHandler.addEventListener(
      "hardwareBackPress",
      onHardwareBack,
    );

    const removeNav = navigation.addListener("beforeRemove", (event) => {
      if (allowLeaveRef.current || indexRef.current <= 0) return;
      event.preventDefault();
      goTo(indexRef.current - 1);
    });

    return () => {
      hardwareSub.remove();
      removeNav();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, total, translateX]);

  const finishSwipe = (target: number) => {
    indexRef.current = target;
    setIndex(target);
  };

  const pan = Gesture.Pan()
    .activeOffsetX([-12, 12])
    .failOffsetY([-20, 20])
    .onUpdate((e) => {
      const next = -index * pageWidth + e.translationX;
      const min = -(total - 1) * pageWidth;
      translateX.value = Math.max(min, Math.min(0, next));
    })
    .onEnd((e) => {
      const threshold = pageWidth * SWIPE_THRESHOLD_RATIO;
      let target = index;
      if (e.translationX < -threshold && index < total - 1) target = index + 1;
      else if (e.translationX > threshold && index > 0) target = index - 1;
      runOnJS(finishSwipe)(target);
      translateX.value = withTiming(-target * pageWidth, { duration: 280 });
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
        <Pressable
          onPress={goBack}
          className="-ml-2 h-10 w-10 items-center justify-center rounded-full active:bg-section dark:active:bg-d-surface"
          accessibilityRole="button"
          accessibilityLabel={t("common.back")}
        >
          <Ionicons name="chevron-back" size={22} color={colors.foreground} />
        </Pressable>
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
          <GestureDetector gesture={pan}>
            <Animated.View
              style={[
                {
                  flex: 1,
                  flexDirection: "row",
                  width: pageWidth * total,
                },
                trackStyle,
              ]}
            >
              {slides.map((slide, i) => {
                // Mount active ± 1 so swipe still shows the next/prev slide.
                const mounted = Math.abs(i - index) <= 1;
                if (!mounted) {
                  return (
                    <View
                      key={slide.id}
                      style={{ width: pageWidth, flex: 1 }}
                    />
                  );
                }
                return (
                  <Slide
                    key={slide.id}
                    slide={slide}
                    width={pageWidth}
                    active={i === index}
                  />
                );
              })}
            </Animated.View>
          </GestureDetector>
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
            label={isLast ? t("intro.cta.begin") : t("intro.cta.next")}
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
