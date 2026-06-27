import * as SplashScreen from "expo-splash-screen";

/** Keep the native splash visible until JS paints the themed gradient. */
void SplashScreen.preventAutoHideAsync().catch(() => {});
