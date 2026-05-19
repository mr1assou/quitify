import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppProvider } from "@/context/AppContext";
import { CommunityProvider } from "@/context/CommunityContext";
import { OnboardingProvider } from "@/context/OnboardingContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import "@/global.css";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <SafeAreaProvider>
          <AppProvider>
            <OnboardingProvider>
              <CommunityProvider>
                <ThemedRoot />
              </CommunityProvider>
            </OnboardingProvider>
          </AppProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
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
        <Stack.Screen name="craving-tools" options={{ animation: "slide_from_right" }} />
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
        <Stack.Screen
          name="terms"
          options={{ presentation: "modal", animation: "slide_from_bottom" }}
        />

        <Stack.Screen name="post/[id]" options={{ animation: "slide_from_right" }} />
        <Stack.Screen
          name="post-composer"
          options={{ presentation: "modal", animation: "slide_from_bottom" }}
        />
        <Stack.Screen name="user/[id]" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="chats" options={{ animation: "slide_from_right" }} />
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
