import { AwardsRankSection } from "@/components/feature/achievement/AwardsRankSection";
import { AppBrandMark } from "@/components/layout/AppBrandMark";
import { ScreenCanvas } from "@/components/layout/ScreenCanvas";
import { ScreenHeader } from "@/components/layout/ScreenHeader";

export default function GlobalRankScreen() {
  return (
    <ScreenCanvas edges={["top"]}>
      <AwardsRankSection screenHeader={<ScreenHeader leading={<AppBrandMark />} />} />
    </ScreenCanvas>
  );
}
