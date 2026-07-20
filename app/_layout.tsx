import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppProvider } from "@/context/AppContext";
import { CommunityProvider } from "@/context/CommunityContext";
import { GoalsProvider } from "@/context/GoalsContext";
import { PlanProvider } from "@/context/PlanContext";
import { RelaxSoundPlayerProvider } from "@/context/RelaxSoundPlayerContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { LocaleProvider } from "@/context/LocaleContext";
import { OnboardingProvider } from "@/context/OnboardingContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { AppScreenBackground } from "@/components/layout/AppScreenBackground";
import { WifiRequiredGate } from "@/components/layout/WifiRequiredGate";
import { RevenueCatBridge } from "@/components/purchases/RevenueCatBridge";
import { PushNotificationsBridge } from "@/components/push/PushNotificationsBridge";
import { PresenceSocketBridge } from "@/components/realtime/PresenceSocketBridge";
import { ChatSocketBridge } from "@/components/realtime/ChatSocketBridge";
import { NotificationSocketBridge } from "@/components/realtime/NotificationSocketBridge";
import "@/bootstrap/splashScreen";
import "@/bootstrap/notifications";
import "@/global.css";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider
        statusBarTranslucent={Platform.OS === "android"}
        navigationBarTranslucent={Platform.OS === "android"}
      >
        <ThemeProvider>
          <LocaleProvider>
            <SafeAreaProvider>
              <AppProvider>
                <OnboardingProvider>
                  <CommunityProvider>
                    <NotificationProvider>
                      <GoalsProviderWrapper />
                    </NotificationProvider>
                  </CommunityProvider>
                </OnboardingProvider>
              </AppProvider>
            </SafeAreaProvider>
          </LocaleProvider>
        </ThemeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

function GoalsProviderWrapper() {
  return (
    <GoalsProvider>
      <PlanProvider>
        <RelaxSoundPlayerProvider>
          <WifiRequiredGate>
            <RevenueCatBridge />
            <PresenceSocketBridge />
            <ChatSocketBridge />
            <NotificationSocketBridge />
            <PushNotificationsBridge />
            <ThemedRoot />
          </WifiRequiredGate>
        </RelaxSoundPlayerProvider>
      </PlanProvider>
    </GoalsProvider>
  );
}

function ThemedRoot() {
  const { resolved } = useTheme();
  const isDark = resolved === "dark";

  return (
    <View style={{ flex: 1 }}>
      <AppScreenBackground isDark={isDark} showOrbs={false} />
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="intro" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="craving-session"
          options={{ presentation: "modal", animation: "slide_from_bottom" }}
        />
        <Stack.Screen
          name="plan-day/[day]"
          options={{ presentation: "modal", animation: "slide_from_bottom" }}
        />
        <Stack.Screen name="plan-notes" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="craving-tools" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="goals" options={{ animation: "slide_from_right" }} />
        <Stack.Screen
          name="signup"
          options={{ presentation: "modal", animation: "slide_from_bottom" }}
        />
        <Stack.Screen
          name="signup-verify-otp"
          options={{ animation: "fade", animationDuration: 200 }}
        />
        <Stack.Screen
          name="login-email"
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="login-verify-otp"
          options={{ animation: "fade", animationDuration: 200 }}
        />
        <Stack.Screen
          name="paywall"
          options={{ presentation: "modal", animation: "slide_from_bottom" }}
        />
        <Stack.Screen
          name="paywall-comparison"
          options={{
            presentation: "transparentModal",
            animation: "fade",
            contentStyle: { backgroundColor: "transparent" },
          }}
        />
        <Stack.Screen
          name="profile"
          options={{ presentation: "modal", animation: "slide_from_bottom" }}
        />
        <Stack.Screen name="player/[rank]" options={{ animation: "slide_from_right" }} />
        <Stack.Screen
          name="player/community/[id]"
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="terms"
          options={{ presentation: "modal", animation: "slide_from_bottom" }}
        />
        <Stack.Screen
          name="privacy"
          options={{ presentation: "modal", animation: "slide_from_bottom" }}
        />

        <Stack.Screen
          name="post/[id]"
          options={{
            animation: "slide_from_right",
            presentation: "card",
            gestureEnabled: true,
            fullScreenGestureEnabled: true,
          }}
        />
        <Stack.Screen name="post-composer" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="share-post/[id]" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="chats" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="community-search" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="reported-posts" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="notifications" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="chat/[id]" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="chat-by-user/[id]" options={{ animation: "slide_from_right" }} />
      </Stack>
    </View>
  );
}
