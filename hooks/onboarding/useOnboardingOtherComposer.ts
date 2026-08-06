import { useEffect, useRef, useState } from "react";
import type { TextInput } from "react-native";

/** Shared open/focus/close behavior for onboarding "Other" free-text composers. */
export function useOnboardingOtherComposer(
  otherSelected: boolean,
  otherText: string,
  onDeselectOther: () => void,
) {
  const [composerOpen, setComposerOpen] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (otherSelected) {
      setComposerOpen(true);
      const timer = setTimeout(() => inputRef.current?.focus(), 220);
      return () => clearTimeout(timer);
    }
    setComposerOpen(false);
  }, [otherSelected]);

  const openComposer = () => {
    setComposerOpen(true);
    setTimeout(() => inputRef.current?.focus(), 120);
  };

  const closeComposer = () => {
    setComposerOpen(false);
    inputRef.current?.blur();
    if (otherSelected && otherText.trim().length === 0) {
      onDeselectOther();
    }
  };

  return {
    composerOpen,
    inputRef,
    openComposer,
    closeComposer,
  };
}
