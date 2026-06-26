import { API_URL } from "@/config/api";
import type { GoogleAuthResponse } from "@/services/auth/types";

export class GoogleAccountNotFoundError extends Error {
  constructor() {
    super("No account found for this email");
    this.name = "GoogleAccountNotFoundError";
  }
}

export class GoogleAccountAlreadyExistsError extends Error {
  constructor() {
    super("An account already exists for this email");
    this.name = "GoogleAccountAlreadyExistsError";
  }
}

type SignInWithGoogleOptions = {
  loginOnly?: boolean;
  signupOnly?: boolean;
};

function googleAuthPath(options: SignInWithGoogleOptions): string {
  if (options.loginOnly) return "/auth/google/login";
  if (options.signupOnly) return "/auth/google/signup";
  return "/auth/google";
}

function readErrorMessage(body: unknown, fallback: string): string {
  if (
    body &&
    typeof body === "object" &&
    "message" in body &&
    (typeof body.message === "string" || Array.isArray(body.message))
  ) {
    return Array.isArray(body.message)
      ? body.message.join(", ")
      : body.message;
  }
  return fallback;
}

/** Exchange a native Google id_token for app JWTs. */
export async function signInWithGoogleIdToken(
  idToken: string,
  options: SignInWithGoogleOptions = {},
): Promise<GoogleAuthResponse> {
  const path = googleAuthPath(options);
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "1",
      },
      credentials: "include",
      body: JSON.stringify({ idToken }),
    });
  } catch {
    throw new Error(
      `Cannot reach the backend at ${API_URL}. ` +
        `Ensure npm run start:dev is running and your phone is on the same Wi‑Fi.`,
    );
  }

  const raw = await res.text();
  let body: Record<string, unknown> | null = null;
  try {
    body = raw ? (JSON.parse(raw) as Record<string, unknown>) : null;
  } catch {
    // non-JSON
  }

  if (!res.ok) {
    if (options.loginOnly && res.status === 404) {
      throw new GoogleAccountNotFoundError();
    }
    if (options.signupOnly && res.status === 409) {
      throw new GoogleAccountAlreadyExistsError();
    }
    throw new Error(
      readErrorMessage(body, `Google sign-in failed (HTTP ${res.status})`),
    );
  }

  const accessToken =
    typeof body?.accessToken === "string" ? body.accessToken : "";
  const refreshToken =
    typeof body?.refreshToken === "string" ? body.refreshToken : "";
  const email = typeof body?.email === "string" ? body.email : "";

  if (!accessToken || !refreshToken || !email) {
    throw new Error("Google sign-in did not return auth tokens");
  }

  return {
    accessToken,
    refreshToken,
    email,
    isNewUser: body?.isNewUser === true,
  };
}
