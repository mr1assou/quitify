import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppProvider } from "@/context/AppContext";
import { CommunityProvider } from "@/context/CommunityContext";
import { GoalsProvider } from "@/context/GoalsContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { OnboardingProvider } from "@/context/OnboardingContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { PresenceSocketBridge } from "@/components/realtime/PresenceSocketBridge";
import { ChatSocketBridge } from "@/components/realtime/ChatSocketBridge";
import { NotificationSocketBridge } from "@/components/realtime/NotificationSocketBridge";
import "@/global.css";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider
        statusBarTranslucent={Platform.OS === "android"}
        navigationBarTranslucent={Platform.OS === "android"}
      >
        <ThemeProvider>
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
        </ThemeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

function GoalsProviderWrapper() {
  return (
    <GoalsProvider>
      <PresenceSocketBridge />
      <ChatSocketBridge />
      <NotificationSocketBridge />
      <ThemedRoot />
    </GoalsProvider>
  );
}

function ThemedRoot() {
  const { resolved, colors } = useTheme();
  const isDark = resolved === "dark";

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
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
        <Stack.Screen name="craving-tools" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="goals" options={{ animation: "slide_from_right" }} />
        <Stack.Screen
          name="signup"
          options={{ presentation: "modal", animation: "slide_from_bottom" }}
        />
        <Stack.Screen
          name="paywall"
          options={{ presentation: "modal", animation: "slide_from_bottom" }}
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
          name="post/[id]"
          options={{
            animation: "slide_from_right",
            presentation: "card",
            gestureEnabled: true,
            fullScreenGestureEnabled: true,
          }}
        />
        <Stack.Screen name="post-composer" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="chats" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="community-search" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="notifications" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="chat/[id]" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="chat-by-user/[id]" options={{ animation: "none" }} />
        <Stack.Screen
          name="call-by-user/[id]"
          options={{ presentation: "fullScreenModal", animation: "slide_from_bottom" }}
        />
      </Stack>
    </View>
  );
}
