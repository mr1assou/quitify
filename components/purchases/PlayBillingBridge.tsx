import { usePlayBillingSync } from "@/hooks/purchases/usePlayBillingSync";

export function PlayBillingBridge() {
  usePlayBillingSync();
  return null;
}
