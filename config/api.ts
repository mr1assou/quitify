/**
 * Local backend URL for API calls (no ngrok — saves request quota).
 * localhost only works on iOS simulator. On a real phone use your PC's Wi‑Fi IP.
 * Android emulator: http://10.0.2.2:3000
 *
 * Google OAuth callback uses ngrok — see backend-smoking/.env → GOOGLE_REDIRECT_URI
 * (Google Cloud Console redirect URI: https://unsightly-preoccupy-parlor.ngrok-free.dev/auth/google/callback)
 */
export const API_URL = "http://192.168.100.162:3000";
