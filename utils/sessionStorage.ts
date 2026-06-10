import AsyncStorage from "@react-native-async-storage/async-storage";

import type { UserAccount, UserProfile } from "@/types";

const SESSION_KEY = "@quit_smoking/app_session";

export type PersistedAppSession = {
  isOnboarded: boolean;
  profile: UserProfile | null;
  account: UserAccount | null;
};

export async function loadAppSession(): Promise<PersistedAppSession | null> {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PersistedAppSession;
  } catch {
    return null;
  }
}

export async function saveAppSession(session: PersistedAppSession): Promise<void> {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export async function clearAppSession(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}
