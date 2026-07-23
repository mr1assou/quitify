import type { ReactNode } from "react";
import { StyleSheet } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

type Props = {
  children: ReactNode;
  /** Offset when a fixed header sits above this view (iOS). */
  keyboardVerticalOffset?: number;
};

/**
 * Screen body + bottom composer. Relies on Android
 * `softwareKeyboardLayoutMode: "resize"` so the window shrinks with the
 * keyboard; KeyboardAvoidingView covers iOS / edge cases.
 */
export function KeyboardAvoidingScreen({
  children,
  keyboardVerticalOffset = 0,
}: Props) {
  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}
      style={styles.root}
    >
      {children}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "transparent",
  },
});
