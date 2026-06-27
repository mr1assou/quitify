import type { ReactNode } from "react";
import { View } from "react-native";
import {
  SafeAreaView,
  type Edge,
} from "react-native-safe-area-context";

import { AppScreenBackground } from "@/components/layout/AppScreenBackground";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  children: ReactNode;
  edges?: Edge[];
  showOrbs?: boolean;
  className?: string;
};

/** Full-screen shell: warm gradient canvas + transparent safe area. */
export function ScreenCanvas({
  children,
  edges = ["top"],
  showOrbs = false,
  className,
}: Props) {
  const { resolved } = useTheme();
  const isDark = resolved === "dark";

  return (
    <View className="flex-1">
      <AppScreenBackground isDark={isDark} showOrbs={showOrbs} />
      <SafeAreaView
        className={["flex-1 bg-transparent", className].filter(Boolean).join(" ")}
        edges={edges}
      >
        {children}
      </SafeAreaView>
    </View>
  );
}
