import type { ReactNode } from "react";

import { NoWifiScreen } from "@/components/layout/NoWifiScreen";
import { ThemedLoadingScreen } from "@/components/ui/ThemedLoadingScreen";
import { useInternetConnection } from "@/hooks/network/useInternetConnection";

type Props = {
  children: ReactNode;
};

/** Blocks the app until the device has an internet connection. */
export function WifiRequiredGate({ children }: Props) {
  const status = useInternetConnection();

  if (status === "checking") {
    return <ThemedLoadingScreen />;
  }

  if (status === "disconnected") {
    return <NoWifiScreen />;
  }

  return children;
}
