import { useCallback, useRef, useState } from "react";

export function useOutcomeBackHandler() {
  const handlerRef = useRef<(() => void) | null>(null);
  const [showBack, setShowBack] = useState(false);

  const register = useCallback((handler: (() => void) | null) => {
    handlerRef.current = handler;
    setShowBack(!!handler);
  }, []);

  const goBack = useCallback(() => {
    handlerRef.current?.();
  }, []);

  return { showBack, register, goBack };
}
