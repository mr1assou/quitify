import { useMemo } from "react";

import { pickCravingMotivationMessage } from "@/constants/craving/cravingMotivation";

/** One random motivation line for the current craving session. */
export function useCravingMotivationMessage(): string {
  return useMemo(() => pickCravingMotivationMessage(), []);
}
