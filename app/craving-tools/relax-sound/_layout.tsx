import { Stack } from "expo-router";

import { RelaxSoundsCatalogProvider } from "@/context/RelaxSoundsCatalogContext";

export default function RelaxSoundLayout() {
  return (
    <RelaxSoundsCatalogProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: { backgroundColor: "transparent" },
        }}
      />
    </RelaxSoundsCatalogProvider>
  );
}
