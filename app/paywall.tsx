import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { AppScreenBackground } from "@/components/layout/AppScreenBackground";
import { Button } from "@/components/ui/Button";
import { getThemeColors } from "@/constants/app/theme";
import { useApp } from "@/context/AppContext";
import type { PaywallPlanId } from "@/constants/paywall/paywallPlans";
import { usePaywallPlans } from "@/hooks/paywall/usePaywallPlans";
import { safeRouter } from "@/utils/app/safeRouter";

const BENEFITS = [
  "Making a payment builds financial accountability and strengthens your chances of achieving your goal.",
  "The subscription costs little compared to the money you'll save over time.",
] as const;

/** Paywall is always presented in the premium dark palette. */
const PAYWALL_COLORS = getThemeColors("dark");

export default function Paywall() {
  const { setFlag, setPremium } = useApp();
  const insets = useSafeAreaInsets();
  const plans = usePaywallPlans();
  const [selectedPlan, setSelectedPlan] = useState<PaywallPlanId>("yearly");

  const primaryCtaLabel = selectedPlan === "yearly" ? "Try free" : "Continue";

  const finishPaywall = () => {
    setFlag("hasSeenPaywall", true);
    router.back();
  };

  const closePaywallToComparison = () => {
    setFlag("hasSeenPaywall", true);
    router.replace("/paywall-comparison");
  };

  const handlePrimaryCta = () => {
    setPremium(true);
    finishPaywall();
  };

  return (
    <View className="flex-1">
      <AppScreenBackground isDark showOrbs={false} />

      <View
        pointerEvents="none"
        className="absolute -right-10 top-16 h-52 w-52 rounded-full bg-primary/20"
      />
      <View
        pointerEvents="none"
        className="absolute -left-16 top-56 h-44 w-44 rounded-full bg-primary/10"
      />

      <SafeAreaView className="flex-1 bg-transparent" edges={["top"]}>
        <View className="flex-row items-center justify-end px-4 pt-2">
          <Pressable
            onPress={closePaywallToComparison}
            className="h-10 w-10 items-center justify-center rounded-full bg-d-surface/85 active:opacity-70"
          >
            <Ionicons name="close" size={20} color={PAYWALL_COLORS.foreground} />
          </Pressable>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingTop: 4,
            paddingBottom: Math.max(insets.bottom, 24) + 24,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-4xl font-extrabold leading-tight text-d-text">
            Invest in your health today.
          </Text>

          <View className="mt-7 gap-4">
            {BENEFITS.map((text) => (
              <View key={text} className="flex-row items-start">
                <View className="mr-3 mt-0.5 h-7 w-7 items-center justify-center rounded-full bg-d-accent-soft">
                  <Ionicons name="checkmark" size={17} color={PAYWALL_COLORS.accent} />
                </View>
                <Text className="flex-1 text-sm leading-5 text-d-muted">{text}</Text>
              </View>
            ))}
          </View>

          <View className="mt-10">
            <Text className="text-xl font-bold text-d-text">Show your offer</Text>
            <Text className="mt-1.5 text-sm text-d-muted">
              Auto-renewing subscription, cancel anytime
            </Text>

            <View className="mt-6 gap-3">
              {plans.map((plan) => {
                const selected = selectedPlan === plan.id;

                return (
                  <View key={plan.id} className={plan.recommended ? "relative mt-4" : undefined}>
                    {plan.recommended ? (
                      <View className="absolute -top-3 right-4 z-10">
                        <View className="rounded-full bg-primary px-3 py-1 shadow-sm">
                          <Text className="text-[10px] font-bold uppercase text-white">
                            Recommended
                          </Text>
                        </View>
                      </View>
                    ) : null}

                    <Pressable
                      onPress={() => setSelectedPlan(plan.id)}
                      className={`rounded-2xl border px-5 py-4 shadow-sm ${
                        selected
                          ? "border-primary bg-d-elevated/95"
                          : "border-d-border bg-d-surface/90"
                      }`}
                    >
                      <View>
                        {plan.subPrice ? (
                          <>
                            <Text className="text-base font-bold text-d-text">{plan.label}</Text>
                            <View className="mt-1 flex-row items-center justify-between">
                              <View className="flex-row items-center">
                                <Text className="text-2xl font-bold text-d-text">
                                  {plan.subPrice}
                                </Text>
                                <Text className="ml-1 text-sm text-d-muted">{plan.subPeriod}</Text>
                              </View>
                              <View className="flex-row items-center">
                                <Text className="text-2xl font-bold text-d-text">
                                  {plan.rightPrice}
                                </Text>
                                <Text className="ml-1 text-sm text-d-muted">{plan.rightPeriod}</Text>
                              </View>
                            </View>
                            {plan.trial ? (
                              <Text className="mt-1 text-sm font-semibold text-primary">
                                {plan.trial}
                              </Text>
                            ) : null}
                          </>
                        ) : (
                          <View className="flex-row items-center justify-between">
                            <Text className="flex-1 pr-3 text-base font-bold text-d-text">
                              {plan.label}
                            </Text>
                            <View className="flex-row items-center">
                              <Text className="text-2xl font-bold text-d-text">
                                {plan.rightPrice}
                              </Text>
                              <Text className="ml-1 text-sm text-d-muted">{plan.rightPeriod}</Text>
                            </View>
                          </View>
                        )}
                      </View>
                    </Pressable>
                  </View>
                );
              })}
            </View>

            <View className="mt-5">
              <Button label={primaryCtaLabel} size="md" fullWidth onPress={handlePrimaryCta} />
            </View>

            <Pressable onPress={closePaywallToComparison} className="mt-3 items-center py-2 active:opacity-70">
              <Text className="text-sm font-semibold text-d-muted">
                Continue with the free version
              </Text>
            </Pressable>

            <View className="mt-2 flex-row items-center justify-between pb-2">
              <Pressable onPress={() => safeRouter.push("/privacy")} className="active:opacity-70">
                <Text className="text-sm text-d-muted">Privacy policy</Text>
              </Pressable>
              <Pressable onPress={() => safeRouter.push("/terms")} className="active:opacity-70">
                <Text className="text-sm text-d-muted">Terms of service</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
