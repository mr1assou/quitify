import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useApp } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";

const FEATURES = [
  { icon: "remove-circle", text: "No ads, ever" },
  { icon: "bar-chart", text: "Advanced stats & habit insights" },
  { icon: "flag", text: "Unlimited daily missions" },
  { icon: "bulb", text: "All craving tools & techniques" },
  { icon: "trophy", text: "Exclusive premium rewards" },
] as const;

export default function Paywall() {
  const { setPremium, setFlag } = useApp();
  const { colors } = useTheme();

  const start = () => {
    setPremium(true);
    setFlag("hasSeenPaywall", true);
    router.back();
  };
  const skip = () => {
    setFlag("hasSeenPaywall", true);
    router.back();
  };

  return (
    <SafeAreaView
      className="flex-1 bg-background dark:bg-d-bg"
      edges={["top", "bottom"]}
    >
      <View className="flex-row items-center justify-end px-4 pt-2">
        <Pressable
          onPress={skip}
          className="h-10 w-10 items-center justify-center rounded-full active:bg-section dark:active:bg-d-surface"
        >
          <Ionicons name="close" size={22} color={colors.foreground} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
        <Animated.View entering={FadeIn.duration(450)} className="items-center">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-primary">
            <Ionicons name="diamond" size={32} color={colors.white} />
          </View>
          <Text className="mt-5 text-center text-3xl font-bold text-foreground dark:text-d-text">
            You&apos;ve made great progress
          </Text>
          <Text className="mt-2 px-2 text-center text-sm text-muted-foreground dark:text-d-muted">
            Go further with Premium. Cancel any time.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(120).duration(450)} className="mt-8">
          <Card variant="section">
            <View className="items-center">
              <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
                Premium
              </Text>
              <View className="mt-1 flex-row items-baseline">
                <Text className="text-5xl font-bold text-foreground dark:text-d-text">
                  $3.99
                </Text>
                <Text className="ml-1 text-base font-semibold text-muted-foreground dark:text-d-muted">
                  /month
                </Text>
              </View>
              <Text className="mt-1 text-xs text-muted-foreground dark:text-d-muted">
                7-day free trial
              </Text>
            </View>

            <View className="mt-6 gap-3">
              {FEATURES.map((f) => (
                <View key={f.text} className="flex-row items-center">
                  <View className="mr-3 h-8 w-8 items-center justify-center rounded-2xl bg-accent-soft dark:bg-d-accent-soft">
                    <Ionicons name={f.icon} size={16} color={colors.accent} />
                  </View>
                  <Text className="flex-1 text-sm text-foreground dark:text-d-text">
                    {f.text}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        </Animated.View>

        <View className="mt-8 gap-3">
          <Button label="Try free for 7 days" size="lg" fullWidth onPress={start} />
          <Pressable onPress={skip} className="items-center py-3 active:opacity-70">
            <Text className="text-sm font-semibold text-muted-foreground dark:text-d-muted">
              Maybe later
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
