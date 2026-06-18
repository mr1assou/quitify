import { View } from "react-native";

import { HomeSectionTitle } from "@/components/feature/home/HomeSectionTitle";
import { RECOVERY_RINGS } from "@/constants/progress/recoveryRings";
import { useRecoveryProgress } from "@/hooks/progress/useRecoveryProgress";

import { RecoveryRingCard } from "./RecoveryRingCard";

export function RecoveryHighlights() {
  const progressById = useRecoveryProgress();

  if (!progressById) return null;

  return (
    <View>
      <HomeSectionTitle title="Your recovery" />

      <View className="flex-row justify-between gap-1">
        {RECOVERY_RINGS.map((ring, index) => (
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
