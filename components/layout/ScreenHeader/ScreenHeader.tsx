import { safeRouter } from "@/utils/safeRouter";
import { type ReactNode } from "react";
import { Text, View } from "react-native";

import { HamburgerButton } from "@/components/layout/HamburgerButton";

type Props = {
  /** Small uppercased label (e.g. "Today", "Health"). */
  eyebrow?: string;
  /** Replaces eyebrow when set (e.g. logo + app name). */
  leading?: ReactNode;
  title?: string;
  /** Override title typography; defaults to large screen title. */
  titleClassName?: string;
  subtitle?: string;
  /** Right-side override; defaults to the hamburger → profile button. */
  trailing?: ReactNode;
};

const DEFAULT_TITLE_CLASS =
  "mt-1 text-3xl font-bold text-foreground dark:text-d-text";

export function ScreenHeader({
  eyebrow,
  leading,
  title,
  titleClassName = DEFAULT_TITLE_CLASS,
  subtitle,
  trailing,
}: Props) {
  const hasTitle = Boolean(title);

  return (
    <View
      className={`flex-row justify-between px-6 pt-2 ${hasTitle ? "items-start" : "items-center"}`}
    >
      <View className="flex-1 pr-4">
        {leading ??
          (eyebrow ? (
            <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
              {eyebrow}
            </Text>
          ) : null)}
        {title ? <Text className={titleClassName}>{title}</Text> : null}
        {subtitle ? (
          <Text className="mt-1 text-sm text-muted-foreground dark:text-d-muted">{subtitle}</Text>
        ) : null}
      </View>
      <View>{trailing ?? <HamburgerButton onPress={() => safeRouter.push("/profile")} />}</View>
    </View>
  );
}
