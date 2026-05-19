import { safeRouter } from "@/utils/safeRouter";
import { type ReactNode } from "react";
import { Text, View } from "react-native";

import { HamburgerButton } from "@/components/layout/HamburgerButton";

type Props = {
  /** Small uppercased label (e.g. "Today", "Health"). */
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Right-side override; defaults to the hamburger → profile button. */
  trailing?: ReactNode;
};

export function ScreenHeader({ eyebrow, title, subtitle, trailing }: Props) {
  return (
    <View className="flex-row items-start justify-between px-6 pt-2">
      <View className="flex-1 pr-4">
        {eyebrow ? (
          <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
            {eyebrow}
          </Text>
        ) : null}
        <Text className="mt-1 text-3xl font-bold text-foreground dark:text-d-text">{title}</Text>
        {subtitle ? (
          <Text className="mt-1 text-sm text-muted-foreground dark:text-d-muted">{subtitle}</Text>
        ) : null}
      </View>
      <View>{trailing ?? <HamburgerButton onPress={() => safeRouter.push("/profile")} />}</View>
    </View>
  );
}
