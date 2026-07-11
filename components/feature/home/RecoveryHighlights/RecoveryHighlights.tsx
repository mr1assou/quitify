import { useMemo } from "react";
import { View } from "react-native";

import { HomeSectionTitle } from "@/components/feature/home/HomeSectionTitle";
import { RECOVERY_RINGS } from "@/constants/progress/recoveryRings";
import { useRecoveryProgress } from "@/hooks/progress/useRecoveryProgress";
import { useTranslation } from "@/hooks/i18n/useTranslation";

import { RecoveryRingCard } from "./RecoveryRingCard";

const RING_LABEL_KEYS = {
  nicotine: "home.ringNicotine",
  breathing: "home.ringBreathing",
  heart: "home.ringHeart",
} as const;

export function RecoveryHighlights() {
  const { t } = useTranslation();
  const progressById = useRecoveryProgress();

  const rings = useMemo(
    () =>
      RECOVERY_RINGS.map((ring) => ({
        ...ring,
        label: t(RING_LABEL_KEYS[ring.id]),
      })),
    [t],
  );

  if (!progressById) return null;

  return (
    <View>
      <HomeSectionTitle title={t("home.recoveryTitle")} />

      <View className="flex-row justify-between gap-1">
        {rings.map((ring, index) => (
          <RecoveryRingCard
            key={ring.id}
            index={index}
            icon={ring.icon}
            label={ring.label}
            accent={ring.accent}
            progress={progressById[ring.id]}
          />
        ))}
      </View>
    </View>
  );
}
