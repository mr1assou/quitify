import { useApp } from "@/context/AppContext";

/** Premium status from the server account (DB source of truth). */
export function useIsPremium(): boolean {
  const { state } = useApp();
  return Boolean(state.account?.isPremium);
}
