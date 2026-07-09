import { useCallback, useEffect, useState } from "react";

import {
  mapApiRelaxSound,
  type RelaxSound,
} from "@/constants/craving/relaxSounds";
import {
  fetchRelaxSounds,
  type RelaxSoundApiRecord,
} from "@/services/relaxSounds/relaxSoundsApi";

export function useRelaxSoundsCatalog() {
  const [sounds, setSounds] = useState<RelaxSound[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const applyRecords = useCallback((records: RelaxSoundApiRecord[]) => {
    const sorted = [...records].sort(
      (a, b) => a.sortOrder - b.sortOrder || a.slug.localeCompare(b.slug),
    );
    setSounds(sorted.map(mapApiRelaxSound));
    setError(null);
  }, []);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const records = await fetchRelaxSounds();
      applyRecords(records);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load sounds");
    } finally {
      setIsLoading(false);
    }
  }, [applyRecords]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    sounds,
    isLoading,
    error,
    refresh,
    needsMigration: !isLoading && sounds.length === 0,
  };
}
