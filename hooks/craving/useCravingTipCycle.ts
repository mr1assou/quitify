import { useCallback, useState } from "react";

import { CRAVING_TIPS, nextTip } from "@/constants/craving/cravingTips";
import type { CravingTip } from "@/types/craving/craving";

export function useCravingTipCycle(initialTip: CravingTip = CRAVING_TIPS[0]) {
  const [tip, setTip] = useState<CravingTip>(initialTip);

  const shuffle = useCallback(() => {
    setTip((current) => nextTip(current.id));
  }, []);

  return { tip, shuffle };
}
