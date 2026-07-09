import { Pressable, Text, View } from "react-native";

import type { PaywallPlanDisplay } from "@/constants/paywall/paywallPlans";

type Props = {
  plan: PaywallPlanDisplay;
  selected: boolean;
  onSelect: () => void;
};

function PriceLine({
  amount,
  period,
  align = "left",
}: {
  amount: string;
  period: string;
  align?: "left" | "right";
}) {
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
  const hasYearlyBreakdown = plan.subPrice != null && plan.subPeriod != null;

  return (
    <View className={plan.recommended ? "relative mt-4" : undefined}>
      {plan.recommended ? (
        <View className="absolute -top-3 right-4 z-10">
          <View className="rounded-full bg-primary px-3 py-1 shadow-sm">
            <Text className="text-[10px] font-bold uppercase text-white">Recommended</Text>
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
            <Text className="text-base font-bold text-d-text">{plan.label}</Text>
            <View className="mt-1 flex-row items-baseline justify-between gap-2">
              <PriceLine amount={plan.subPrice!} period={plan.subPeriod!} />
              <PriceLine amount={plan.rightPrice} period={plan.rightPeriod} align="right" />
            </View>
            {plan.trial ? (
              <Text className="mt-1 text-sm font-semibold text-primary">{plan.trial}</Text>
            ) : null}
          </View>
        ) : (
          <View className="flex-row items-center justify-between gap-3">
            <Text className="shrink text-base font-bold text-d-text">{plan.label}</Text>
            <View className="min-w-0 max-w-[55%]">
              <PriceLine amount={plan.rightPrice} period={plan.rightPeriod} align="right" />
            </View>
          </View>
        )}
      </Pressable>
    </View>
  );
}
