import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCESS_TOKEN_KEY = "@quit_smoking/access_token";
const REFRESH_TOKEN_KEY = "@quit_smoking/refresh_token";

export async function saveAuthTokens(
  accessToken: string,
  refreshToken: string,
): Promise<void> {
  await AsyncStorage.multiSet([
    [ACCESS_TOKEN_KEY, accessToken],
    [REFRESH_TOKEN_KEY, refreshToken],
  ]);
}

export async function getAccessToken(): Promise<string | null> {
  return AsyncStorage.getItem(ACCESS_TOKEN_KEY);
}

export async function clearAuthTokens(): Promise<void> {
  await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);
}
