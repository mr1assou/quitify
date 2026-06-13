import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect, useState } from "react";

import {
  getGoogleAuthUrl,
  parseGoogleAuthRedirect,
} from "@/services/auth";
import { saveAuthTokens } from "@/utils/authStorage";

WebBrowser.maybeCompleteAuthSession();

/** Web OAuth via backend (uses web client_id + client_secret on server only). */
export function useGoogleSignIn() {
  const [isReady, setIsReady] = useState(true);

  useEffect(() => {
    // Optional Android perf hint — fails harmlessly if Chrome Custom Tabs isn't available.
    void WebBrowser.warmUpAsync().catch(() => {});
    return () => {
      void WebBrowser.coolDownAsync().catch(() => {});
    };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const returnUrl = Linking.createURL("oauth/google");
    const authUrl = await getGoogleAuthUrl(returnUrl);

    const result = await WebBrowser.openAuthSessionAsync(authUrl, returnUrl);

    if (result.type === "cancel" || result.type === "dismiss") {
      throw new Error("Google sign-in was cancelled");
    }

    if (result.type !== "success") {
      throw new Error("Google sign-in failed");
    }

    const auth = parseGoogleAuthRedirect(result.url);
    await saveAuthTokens(auth.accessToken, auth.refreshToken);
    return auth;
  }, []);

  return { signInWithGoogle, isReady };
}
