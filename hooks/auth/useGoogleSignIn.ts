import { useCallback, useEffect, useState } from "react";
import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";

import { GOOGLE_WEB_CLIENT_ID } from "@/config/google";
import { signInWithGoogleIdToken } from "@/services/auth/googleNativeAuthApi";
import { clearGoogleSignInSession } from "@/utils/auth/clearGoogleSignInSession";
import { saveAuthTokens } from "@/utils/auth/authStorage";

let configured = false;

function ensureGoogleSignInConfigured() {
  if (configured) return;
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    offlineAccess: false,
  });
  configured = true;
}

/** Native Google Sign-In → backend `POST /auth/google` with id_token. */
export function useGoogleSignIn() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      ensureGoogleSignInConfigured();
      setIsReady(true);
    } catch {
      setIsReady(false);
    }
  }, []);

  const signInWithGoogle = useCallback(
    async (options?: { loginOnly?: boolean; signupOnly?: boolean }) => {
    ensureGoogleSignInConfigured();

    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    try {
      await clearGoogleSignInSession();
      const response = await GoogleSignin.signIn();

      if (response.type === "cancelled") {
        throw new Error("Google sign-in was cancelled");
      }

      const idToken = response.data.idToken;
      if (!idToken) {
        throw new Error("Google did not return an id token");
      }

      const auth = await signInWithGoogleIdToken(idToken, options);
      await saveAuthTokens(auth.accessToken, auth.refreshToken);
      return auth;
    } catch (error) {
      if (isErrorWithCode(error)) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          throw new Error("Google sign-in was cancelled");
        }
        if (error.code === statusCodes.IN_PROGRESS) {
          throw new Error("Google sign-in is already in progress");
        }
        if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          throw new Error("Google Play Services is not available on this device");
        }
      }
      throw error;
    }
  }, []);

  return { signInWithGoogle, isReady };
}
