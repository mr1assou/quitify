/**
 * Backend URL for all app API calls (REST + WebSockets).
 * Use your PC's Wi‑Fi IP so a physical phone on the same network can reach the server.
 * Android emulator: http://10.0.2.2:3000
 *
 * Do NOT use ngrok here — ngrok is only for Google OAuth redirect (HTTPS callback).
 * See backend-smoking/.env → GOOGLE_REDIRECT_URI and Google Cloud Console redirect URI.
 */
export const API_URL = "http://192.168.1.18:3000";
