import { API_URL } from "@/config/api";
import type { GoogleAuthResponse } from "./types";

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

async function postJson<T>(path: string, payload: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "1",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      `Cannot reach the backend at ${API_URL}. ` +
        "Ensure the API server is running and your device is on the same network.",
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
    throw new EmailSignupApiError(
      readErrorMessage(body, "Something went wrong. Please try again."),
      res.status,
    );
  }

  return body as T;
}

export class EmailSignupApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "EmailSignupApiError";
  }
}

export function isEmailAlreadyExistsError(error: unknown): boolean {
  return error instanceof EmailSignupApiError && error.status === 409;
}

export function isEmailNotFoundError(error: unknown): boolean {
  return error instanceof EmailSignupApiError && error.status === 404;
}

export async function sendEmailSignupOtp(email: string): Promise<void> {
  await postJson<{ ok: true }>("/auth/email/signup/send-otp", {
    email: email.trim().toLowerCase(),
  });
}

export async function verifyEmailSignupOtp(
  email: string,
  code: string,
): Promise<GoogleAuthResponse> {
  const body = await postJson<GoogleAuthResponse>("/auth/email/signup/verify-otp", {
    email: email.trim().toLowerCase(),
    code: code.trim(),
  });

  if (
    typeof body.accessToken !== "string" ||
    typeof body.refreshToken !== "string"
  ) {
    throw new Error("Verification response was invalid. Please try again.");
  }

  return body;
}

export async function sendEmailLoginOtp(email: string): Promise<void> {
  await postJson<{ ok: true }>("/auth/email/login/send-otp", {
    email: email.trim().toLowerCase(),
  });
}

export async function verifyEmailLoginOtp(
  email: string,
  code: string,
): Promise<GoogleAuthResponse> {
  const body = await postJson<GoogleAuthResponse>("/auth/email/login/verify-otp", {
    email: email.trim().toLowerCase(),
    code: code.trim(),
  });

  if (
    typeof body.accessToken !== "string" ||
    typeof body.refreshToken !== "string"
  ) {
    throw new Error("Verification response was invalid. Please try again.");
  }

  return body;
}
