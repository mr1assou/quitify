import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { ThemedLoadingScreen } from "@/components/ui/ThemedLoadingScreen";
import { useApp } from "@/context/AppContext";
import { useOnboarding } from "@/context/OnboardingContext";
import { finalizeGoogleAuth } from "@/services/auth/finalizeGoogleAuth";
import type { GoogleAuthResponse } from "@/services/auth/types";
import { markSignupPushPromptPending } from "@/utils/push/signupPushPromptStorage";

function queryParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

/** Handles Google OAuth return URL — finishes auth and goes to home (no sign-in flash). */
export default function GoogleOAuthRedirect() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    error?: string;
    accessToken?: string;
    refreshToken?: string;
    email?: string;
    isNewUser?: string;
  }>();
  const { draft } = useOnboarding();
  const { completeOnboarding, setAccount } = useApp();
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;

    const error = queryParam(params.error);
    if (error) {
      startedRef.current = true;
      router.replace({
        pathname: "/onboarding/profile",
        params: { googleError: error },
      });
      return;
    }

    const accessToken = queryParam(params.accessToken);
    const refreshToken = queryParam(params.refreshToken);
    const email = queryParam(params.email);

    if (!accessToken || !refreshToken || !email) {
      return;
    }

    startedRef.current = true;

    const auth: GoogleAuthResponse = {
      accessToken,
      refreshToken,
      email,
      isNewUser: queryParam(params.isNewUser) === "1",
    };

    void (async () => {
      try {
        await finalizeGoogleAuth(auth, draft, { setAccount, completeOnboarding });
        if (auth.isNewUser) {
          await markSignupPushPromptPending();
        }
        router.replace("/(tabs)");
      } catch {
        router.replace({
          pathname: "/onboarding/profile",
          params: { googleError: "Google sign-in failed" },
        });
      }
    })();
  }, [
    params.accessToken,
    params.email,
    params.error,
    params.isNewUser,
    params.refreshToken,
    draft,
    completeOnboarding,
    setAccount,
    router,
  ]);

  return <ThemedLoadingScreen />;
}
