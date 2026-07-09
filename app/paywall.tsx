import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { AppScreenBackground } from "@/components/layout/AppScreenBackground";
import { PaywallPlanOption } from "@/components/paywall/PaywallPlanOption";
import { Button } from "@/components/ui/Button";
import { getThemeColors } from "@/constants/app/theme";
import { WEBSITE_PRIVACY_URL, WEBSITE_TERMS_URL } from "@/constants/app/website";
import { useApp } from "@/context/AppContext";
import type { PaywallPlanId } from "@/constants/paywall/paywallPlans";
import { usePaywallPlans } from "@/hooks/paywall/usePaywallPlans";
import { usePaywallPurchase } from "@/hooks/paywall/usePaywallPurchase";
import { openExternalUrl } from "@/utils/app/openExternalUrl";
import { safeRouter } from "@/utils/app/safeRouter";

const BENEFITS = [
  "Making a payment builds financial accountability and strengthens your chances of achieving your goal.",
  "The subscription costs little compared to the money you'll save over time.",
] as const;

/** Paywall is always presented in the premium dark palette. */
const PAYWALL_COLORS = getThemeColors("dark");

/** Wait for the modal slide-down before pushing the comparison sheet. */
const PAYWALL_MODAL_DISMISS_MS = 420;

export default function Paywall() {
  const { setFlag } = useApp();
  const insets = useSafeAreaInsets();
  const { plans } = usePaywallPlans();
  const { purchasePlan, restore, busy, purchasing, restoring } = usePaywallPurchase();
  const [selectedPlan, setSelectedPlan] = useState<PaywallPlanId>("yearly");
  const comparisonTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const primaryCtaLabel = purchasing
    ? "Processing..."
    : selectedPlan === "yearly"
      ? "Try free"
      : "Continue";

  const finishPaywall = () => {
    if (comparisonTimerRef.current) {
      clearTimeout(comparisonTimerRef.current);
      comparisonTimerRef.current = null;
    }
    setFlag("hasSeenPaywall", true);
    safeRouter.back();
  };

  const openComparisonAfterDismiss = () => {
    setFlag("hasSeenPaywall", true);
    if (!router.canGoBack()) {
      safeRouter.replace("/paywall-comparison");
      return;
    }

    safeRouter.back();
    comparisonTimerRef.current = setTimeout(() => {
      comparisonTimerRef.current = null;
      safeRouter.pushStack("/paywall-comparison");
    }, PAYWALL_MODAL_DISMISS_MS);
  };

  const handlePrimaryCta = async () => {
    const premium = await purchasePlan(selectedPlan);
    if (premium) finishPaywall();
  };

  const handleRestore = async () => {
    const premium = await restore();
    if (premium) finishPaywall();
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
            onPress={openComparisonAfterDismiss}
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
              {plans.map((plan) => (
                <PaywallPlanOption
                  key={plan.id}
                  plan={plan}
                  selected={selectedPlan === plan.id}
                  onSelect={() => setSelectedPlan(plan.id)}
                />
              ))}
            </View>

            <View className="mt-5">
              <Button
                label={primaryCtaLabel}
                size="md"
                fullWidth
                disabled={busy}
                onPress={() => void handlePrimaryCta()}
              />
            </View>

            <Pressable
              onPress={() => void handleRestore()}
              disabled={busy}
              className="mt-3 items-center py-2 active:opacity-70"
            >
              <Text className="text-sm font-semibold text-d-muted">
                {restoring ? "Restoring..." : "Restore purchases"}
              </Text>
            </Pressable>

            <View className="mt-2 flex-row items-center justify-between pb-2">
              <Pressable
                onPress={() => openExternalUrl(WEBSITE_PRIVACY_URL)}
                className="active:opacity-70"
              >
                <Text className="text-sm text-d-muted">Privacy policy</Text>
              </Pressable>
              <Pressable
                onPress={() => openExternalUrl(WEBSITE_TERMS_URL)}
                className="active:opacity-70"
              >
                <Text className="text-sm text-d-muted">Terms of service</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
