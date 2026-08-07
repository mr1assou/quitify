import { Pressable, Text, View } from "react-native";

import type { PaywallPlanDisplay } from "@/constants/paywall/paywallPlans";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import type { PaywallPlanId } from "@/constants/paywall/paywallPlans";

type Props = {
  plan: PaywallPlanDisplay;
  selected: boolean;
  onSelect: () => void;
};

const PLAN_LABEL_KEYS: Record<PaywallPlanId, "paywall.monthlyPlan" | "paywall.yearlyPlan"> = {
  monthly: "paywall.monthlyPlan",
  yearly: "paywall.yearlyPlan",
};

const PLAN_TRIAL_KEYS: Record<
  PaywallPlanId,
  "paywall.trialBadge" | "paywall.trialBadge3Days"
> = {
  monthly: "paywall.trialBadge3Days",
  yearly: "paywall.trialBadge",
};

function PriceLine({
  amount,
  period,
  align = "left",
  compareAt,
}: {
  amount: string;
  period: string;
  align?: "left" | "right";
  compareAt?: string | null;
}) {
  const alignClass = align === "right" ? "items-end" : "items-start";

  if (compareAt) {
    return (
      <View className={`min-w-0 flex-1 ${alignClass}`}>
        <View className="flex-row items-baseline">
          <Text
            className="shrink text-xl font-extrabold text-d-text"
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
          >
            {amount}
          </Text>
          <Text className="ml-1 shrink-0 text-sm text-d-muted">{period}</Text>
        </View>
        <Text className="mt-0.5 text-xs text-d-muted line-through">{compareAt}</Text>
      </View>
    );
  }

  return (
    <View
      className={`min-w-0 flex-1 flex-row items-baseline ${
        align === "right" ? "justify-end" : ""
      }`}
    >
      <Text
        className="shrink text-lg font-bold text-d-text"
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
      >
        {amount}
      </Text>
      <Text className="ml-0.5 shrink-0 text-xs text-d-muted">{period}</Text>
    </View>
  );
}

export function PaywallPlanOption({ plan, selected, onSelect }: Props) {
  const { t } = useTranslation();
  const hasYearlyBreakdown = plan.subPrice != null && plan.subPeriod != null;
  const planLabel = t(PLAN_LABEL_KEYS[plan.id]);
  const trialLabel = plan.trial ? t(PLAN_TRIAL_KEYS[plan.id]) : null;

  return (
    <View className={plan.recommended ? "relative mt-4" : undefined}>
      {plan.recommended ? (
        <View className="absolute -top-3 right-4 z-10">
          <View className="rounded-full bg-primary px-3 py-1 shadow-sm">
            <Text className="text-[10px] font-bold uppercase text-white">
              {t("paywall.recommended")}
            </Text>
          </View>
        </View>
      ) : null}

      <Pressable
        onPress={onSelect}
        className={`rounded-2xl border px-5 py-4 shadow-sm ${
          selected ? "border-primary bg-d-elevated/95" : "border-d-border bg-d-surface/90"
        }`}
      >
        {hasYearlyBreakdown ? (
          <View>
            <Text className="text-base font-bold text-d-text">{planLabel}</Text>
            <View className="mt-2 flex-row items-start justify-between gap-2">
              <PriceLine
                amount={plan.subPrice!}
                period={plan.subPeriod!}
                compareAt={plan.originalSubPrice}
              />
              <PriceLine
                amount={plan.rightPrice}
                period={plan.rightPeriod}
                align="right"
                compareAt={plan.originalRightPrice}
              />
            </View>
            {trialLabel ? (
              <Text className="mt-2 text-sm font-semibold text-primary">{trialLabel}</Text>
            ) : null}
          </View>
        ) : (
          <View>
            <View className="flex-row items-center justify-between gap-3">
              <Text className="shrink text-base font-bold text-d-text">{planLabel}</Text>
              <View className="min-w-0 max-w-[55%]">
                <PriceLine
                  amount={plan.rightPrice}
                  period={plan.rightPeriod}
                  align="right"
                  compareAt={plan.originalRightPrice}
                />
              </View>
            </View>
            {trialLabel ? (
              <Text className="mt-2 text-sm font-semibold text-primary">{trialLabel}</Text>
            ) : null}
          </View>
        )}
      </Pressable>
    </View>
  );
}
