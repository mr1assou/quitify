import { AppEventsLogger } from "react-native-fbsdk-next";

/** Fire-and-forget Meta App Event (no-op if native SDK is unavailable). */
export function logMetaEvent(
  name: string,
  params?: Record<string, string | number>,
): void {
  try {
    if (__DEV__) {
      console.log("[meta] sending event:", name, params ?? {});
    }
    AppEventsLogger.logEvent(name, params);
    AppEventsLogger.flush();
  } catch (error) {
    if (__DEV__) {
      console.warn("[meta] logEvent failed:", name, error);
    }
  }
}

/** Meta standard “Complete registration” with registration method. */
export function logMetaCompleteRegistration(method: "email" | "google"): void {
  try {
    AppEventsLogger.logEvent(AppEventsLogger.AppEvents.CompletedRegistration, {
      [AppEventsLogger.AppEventParams.RegistrationMethod]: method,
    });
    AppEventsLogger.flush();
    if (__DEV__) {
      console.log("[meta] CompleteRegistration sent:", method);
    }
  } catch (error) {
    if (__DEV__) {
      console.warn("[meta] CompleteRegistration failed:", error);
    }
  }
}
