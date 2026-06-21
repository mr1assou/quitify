import { createContext, useContext, type ReactNode } from "react";

import { useRelaxSoundsCatalog } from "@/hooks/craving/useRelaxSoundsCatalog";

type RelaxSoundsCatalogContextValue = ReturnType<typeof useRelaxSoundsCatalog>;

const RelaxSoundsCatalogContext =
  createContext<RelaxSoundsCatalogContextValue | null>(null);

export function RelaxSoundsCatalogProvider({ children }: { children: ReactNode }) {
  const catalog = useRelaxSoundsCatalog();
  return (
    <RelaxSoundsCatalogContext.Provider value={catalog}>
      {children}
    </RelaxSoundsCatalogContext.Provider>
  );
}

export function useRelaxSoundsCatalogContext(): RelaxSoundsCatalogContextValue {
  const value = useContext(RelaxSoundsCatalogContext);
  if (!value) {
    throw new Error(
      "useRelaxSoundsCatalogContext must be used within RelaxSoundsCatalogProvider",
    );
  }
  return value;
}
