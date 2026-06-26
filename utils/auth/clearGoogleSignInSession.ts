import { GoogleSignin } from "@react-native-google-signin/google-signin";

/** Clears the cached Google account so the next sign-in shows the account picker. */
export async function clearGoogleSignInSession(): Promise<void> {
  try {
    await GoogleSignin.signOut();
  } catch {
    // No cached Google session — safe to ignore.
  }
}
