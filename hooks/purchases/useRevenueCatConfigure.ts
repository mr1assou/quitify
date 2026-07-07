import { useEffect } from "react";
import { Platform } from "react-native";
import Purchases, { LOG_LEVEL } from "react-native-purchases";

import {
  REVENUECAT_ANDROID_API_KEY,
  REVENUECAT_IOS_API_KEY,
} from "@/config/revenuecat";

let configured = false;

export function useRevenueCatConfigure() {
  useEffect(() => {
    if (configured) return;

    const apiKey =
      Platform.OS === "ios" ? REVENUECAT_IOS_API_KEY : REVENUECAT_ANDROID_API_KEY;

    if (!apiKey) {
      if (__DEV__) {
        console.warn(
          "[revenuecat] Missing API key. Set REVENUECAT_ANDROID_API_KEY in config/revenuecat.ts",
        );
      }
      return;
    }

    if (__DEV__) {
      Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
    }

    Purchases.configure({ apiKey });
    configured = true;
  }, []);
}
