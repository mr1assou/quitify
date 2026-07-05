import { API_URL } from "@/config/api";

export type EmailLoginResponse = {
  accessToken: string;
  refreshToken: string;
};

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

export async function loginWithEmail(
  email: string,
  password: string,
): Promise<EmailLoginResponse> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "1",
      },
      credentials: "include",
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        password,
      }),
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
    throw new Error(
      readErrorMessage(body, "Invalid email or password. Please try again."),
    );
  }

  const accessToken = body?.accessToken;
  const refreshToken = body?.refreshToken;
  if (typeof accessToken !== "string" || typeof refreshToken !== "string") {
    throw new Error("Login response was invalid. Please try again.");
  }

  return { accessToken, refreshToken };
}
