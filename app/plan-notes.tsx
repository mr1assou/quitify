import { MissionPlanNotesScreen } from "@/components/feature/missions/MissionPlanNotesScreen";
import { PremiumRoute } from "@/components/premium/PremiumRoute";

export default function PlanNotesRoute() {
  return (
    <PremiumRoute>
      <MissionPlanNotesScreen />
    </PremiumRoute>
  );
}
