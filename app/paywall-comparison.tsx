import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { AppScreenBackground } from "@/components/layout/AppScreenBackground";
import { PaywallPlanOption } from "@/components/paywall/PaywallPlanOption";
import { PaywallSpinWheel } from "@/components/paywall/PaywallSpinWheel";
import { Button } from "@/components/ui/Button";
import { getThemeColors } from "@/constants/app/theme";
import { WEBSITE_PRIVACY_URL, WEBSITE_TERMS_URL } from "@/constants/app/website";
import { useSpecialPaywallOffer } from "@/hooks/paywall/useSpecialPaywallOffer";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { openExternalUrl } from "@/utils/app/openExternalUrl";
import { safeRouter } from "@/utils/app/safeRouter";
import { markPostPaywallFlowComplete } from "@/utils/onboarding/postSignupFlowStorage";

const BENEFIT_KEYS = ["paywall.benefit1", "paywall.benefit2"] as const;
const PAYWALL_COLORS = getThemeColors("dark");

export default function PaywallOffer() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { offer, loading, purchasing, purchaseOffer } = useSpecialPaywallOffer();
  const [phase, setPhase] = useState<"spin" | "offer">("spin");

  const dismiss = useCallback(async () => {
    await markPostPaywallFlowComplete();
    safeRouter.back();
  }, []);

  useEffect(() => {
    return () => {
      void markPostPaywallFlowComplete();
    };
  }, []);

  // Safety: if we landed here without a real discount, leave immediately (no UI).
  useEffect(() => {
    if (loading) return;
    if (offer != null && offer.discountPercent > 0) return;
    void dismiss();
  }, [dismiss, loading, offer]);

  const claimOffer = async () => {
    const premium = await purchaseOffer();
    if (!premium) return;

    await markPostPaywallFlowComplete();
    safeRouter.back();
  };

  const handleWon = useCallback(() => {
    setTimeout(() => setPhase("offer"), 600);
  }, []);

  // Don't mount spin/offer UI until the discounted offer is ready.
  if (loading || !offer || offer.discountPercent <= 0) {
    return <View className="flex-1" />;
  }

  const discountPercent = offer.discountPercent;
  const winLabel = `${discountPercent}% OFF`;

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
            onPress={() => void dismiss()}
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
          {phase === "spin" ? (
            <View className="flex-1 justify-center py-4">
              <Text className="mb-8 text-center text-3xl font-extrabold leading-tight text-d-text">
                {t("paywall.spinTitle")}
              </Text>
              <PaywallSpinWheel winLabel={winLabel} onWon={handleWon} />
            </View>
          ) : (
            <Animated.View entering={FadeInDown.duration(420)}>
              <View className="self-start rounded-full bg-primary px-3 py-1.5">
                <Text className="text-xs font-bold uppercase tracking-wide text-white">
                  {t("paywall.offerBadge", { percent: discountPercent })}
                </Text>
              </View>

              <Text className="mt-4 text-4xl font-extrabold leading-tight text-d-text">
                {t("paywall.staticOfferTitle")}
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
                  {t("paywall.staticOfferSubtitle")}
                </Text>

                <View className="mt-6 gap-3">
                  <PaywallPlanOption
                    plan={offer.plan}
                    selected
                    onSelect={() => undefined}
                  />
                </View>

                <View className="mt-5">
                  <Button
                    label={
                      purchasing ? t("paywall.processing") : t("paywall.claimOffer")
                    }
                    size="md"
                    fullWidth
                    disabled={purchasing}
                    onPress={() => void claimOffer()}
                  />
                </View>

                <Pressable
                  onPress={() => void dismiss()}
                  className="mt-3 items-center py-2 active:opacity-70"
                >
                  <Text className="text-sm font-semibold text-d-muted">
                    {t("paywall.declineOffer")}
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
            </Animated.View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
