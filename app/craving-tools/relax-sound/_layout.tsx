import { Stack } from "expo-router";

import { RelaxSoundPlayerProvider } from "@/context/RelaxSoundPlayerContext";
import { RelaxSoundsCatalogProvider } from "@/context/RelaxSoundsCatalogContext";

export default function RelaxSoundLayout() {
  return (
    <RelaxSoundsCatalogProvider>
      <RelaxSoundPlayerProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
            contentStyle: { backgroundColor: "transparent" },
          }}
        />
      </RelaxSoundPlayerProvider>
    </RelaxSoundsCatalogProvider>
  );
}
