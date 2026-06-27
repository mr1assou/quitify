import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

import { isInternetConnected } from "@/utils/network/isInternetConnected";

export type InternetConnectionStatus = "checking" | "connected" | "disconnected";

export function useInternetConnection(): InternetConnectionStatus {
  const [status, setStatus] = useState<InternetConnectionStatus>("checking");

  useEffect(() => {
    const update = (state: Parameters<typeof isInternetConnected>[0]) => {
      setStatus(isInternetConnected(state) ? "connected" : "disconnected");
    };

    const unsubscribe = NetInfo.addEventListener(update);
    void NetInfo.fetch().then(update);

    return unsubscribe;
  }, []);

  return status;
}
