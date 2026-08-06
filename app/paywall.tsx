import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
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
import { parsePaywallSource } from "@/constants/analytics/paywall";
import { useApp } from "@/context/AppContext";
import type { PaywallPlanId } from "@/constants/paywall/paywallPlans";
import { usePaywallPlans } from "@/hooks/paywall/usePaywallPlans";
import { usePaywallPurchase } from "@/hooks/paywall/usePaywallPurchase";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import {
  trackPaywallDismiss,
  trackPaywallPurchaseSuccess,
  trackPaywallView,
} from "@/services/analytics";
import { openExternalUrl } from "@/utils/app/openExternalUrl";
import { safeRouter } from "@/utils/app/safeRouter";
import { markPostPaywallFlowComplete } from "@/utils/onboarding/postSignupFlowStorage";
import {
  getCachedSpecialPaywallOffer,
  prefetchSpecialPaywallOffer,
} from "@/utils/paywall/specialOfferCache";

const BENEFIT_KEYS = ["paywall.benefit1", "paywall.benefit2"] as const;

/** Paywall is always presented in the premium dark palette. */
const PAYWALL_COLORS = getThemeColors("dark");

/** Short gap after modal dismiss so the spin screen can slide in quickly. */
const PAYWALL_MODAL_DISMISS_MS = 120;

export default function Paywall() {
  const { t } = useTranslation();
  const { setFlag } = useApp();
  const insets = useSafeAreaInsets();
  const { source: sourceParam } = useLocalSearchParams<{ source?: string }>();
  const source = parsePaywallSource(
    Array.isArray(sourceParam) ? sourceParam[0] : sourceParam,
  );
  const { plans } = usePaywallPlans();
  const { purchasePlan, restore, busy, purchasing, restoring } = usePaywallPurchase();
  const [selectedPlan, setSelectedPlan] = useState<PaywallPlanId>("yearly");
  const comparisonTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const convertedRef = useRef(false);
  const dismissTrackedRef = useRef(false);

  useEffect(() => {
    trackPaywallView(source);
  }, [source]);

  // Prefetch special offer while the paywall is open so close can show spin instantly.
  useEffect(() => {
    void prefetchSpecialPaywallOffer();
  }, []);

  // Covers every dismissal path, including the Android back button/gesture,
  // so the deferred notification prompt is never lost.
  useEffect(() => {
    return () => {
      if (!convertedRef.current && !dismissTrackedRef.current) {
        dismissTrackedRef.current = true;
        trackPaywallDismiss(source);
      }
      void markPostPaywallFlowComplete();
    };
  }, [source]);

  const primaryCtaLabel = purchasing
    ? t("paywall.processing")
    : selectedPlan === "yearly"
      ? t("paywall.tryFree")
      : t("paywall.continue");

  const trackDismissOnce = () => {
    if (convertedRef.current || dismissTrackedRef.current) return;
    dismissTrackedRef.current = true;
    trackPaywallDismiss(source);
  };

  const finishPaywall = async () => {
    if (comparisonTimerRef.current) {
      clearTimeout(comparisonTimerRef.current);
      comparisonTimerRef.current = null;
    }
    setFlag("hasSeenPaywall", true);
    await markPostPaywallFlowComplete();
    safeRouter.back();
  };

  const openComparisonAfterDismiss = () => {
    trackDismissOnce();
    setFlag("hasSeenPaywall", true);

    const canGoBack = router.canGoBack();
    if (canGoBack) {
      safeRouter.back();
    }

    void (async () => {
      const cached = getCachedSpecialPaywallOffer();
      const offer =
        cached !== undefined ? cached : await prefetchSpecialPaywallOffer();

      if (!offer || offer.discountPercent <= 0) {
        await markPostPaywallFlowComplete();
        return;
      }

      if (comparisonTimerRef.current) {
        clearTimeout(comparisonTimerRef.current);
      }

      comparisonTimerRef.current = setTimeout(() => {
        comparisonTimerRef.current = null;
        if (canGoBack) {
          safeRouter.pushStack("/paywall-comparison");
        } else {
          safeRouter.replace("/paywall-comparison");
        }
      }, canGoBack ? PAYWALL_MODAL_DISMISS_MS : 0);
    })();
  };

  const handlePrimaryCta = async () => {
    const premium = await purchasePlan(selectedPlan);
    if (!premium) return;

    convertedRef.current = true;
    trackPaywallPurchaseSuccess({
      source,
      planId: selectedPlan,
      purchaseType: "purchase",
    });
    await finishPaywall();
  };

  const handleRestore = async () => {
    const premium = await restore();
    if (!premium) return;

    convertedRef.current = true;
    trackPaywallPurchaseSuccess({
      source,
      purchaseType: "restore",
    });
    await finishPaywall();
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
            {t("paywall.title")}
          </Text>

          <View className="mt-7 gap-4">
            {BENEFIT_KEYS.map((key) => (
              <View key={key} className="flex-row items-start">
                <View className="mr-3 mt-0.5 h-7 w-7 items-center justify-center rounded-full bg-d-accent-soft">
                  <Ionicons name="checkmark" size={17} color={PAYWALL_COLORS.accent} />
                </View>
                <Text className="flex-1 text-sm leading-5 text-d-muted">{t(key)}</Text>
              </View>
            ))}
          </View>

          <View className="mt-10">
            <Text className="text-xl font-bold text-d-text">{t("paywall.offerTitle")}</Text>
            <Text className="mt-1.5 text-sm text-d-muted">
              {t("paywall.offerSubtitle")}
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
                {restoring ? t("paywall.restoring") : t("paywall.restore")}
              </Text>
            </Pressable>

            <View className="mt-2 flex-row items-center justify-between pb-2">
              <Pressable
                onPress={() => openExternalUrl(WEBSITE_PRIVACY_URL)}
                className="active:opacity-70"
              >
                <Text className="text-sm text-d-muted">{t("paywall.privacy")}</Text>
              </Pressable>
              <Pressable
                onPress={() => openExternalUrl(WEBSITE_TERMS_URL)}
                className="active:opacity-70"
              >
                <Text className="text-sm text-d-muted">{t("paywall.terms")}</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
