import { createContext, useContext, type ReactNode } from "react";

import { useRelaxSoundPlayer } from "@/hooks/craving/useRelaxSoundPlayer";

type RelaxSoundPlayerContextValue = ReturnType<typeof useRelaxSoundPlayer>;

const RelaxSoundPlayerContext =
  createContext<RelaxSoundPlayerContextValue | null>(null);

export function RelaxSoundPlayerProvider({ children }: { children: ReactNode }) {
  const player = useRelaxSoundPlayer();
  return (
    <RelaxSoundPlayerContext.Provider value={player}>
      {children}
    </RelaxSoundPlayerContext.Provider>
  );
}

export function useRelaxSoundPlayerContext(): RelaxSoundPlayerContextValue {
  const value = useContext(RelaxSoundPlayerContext);
  if (!value) {
    throw new Error(
      "useRelaxSoundPlayerContext must be used within RelaxSoundPlayerProvider",
    );
  }
  return value;
}
