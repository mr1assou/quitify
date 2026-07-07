import { type ReactNode } from "react";
import { View, type ViewProps } from "react-native";

type Variant = "section" | "surface" | "outline" | "primary" | "secondary";

type CardProps = ViewProps & {
  children: ReactNode;
  variant?: Variant;
  padded?: boolean;
  className?: string;
};

const variants: Record<Variant, string> = {
  section:
    "bg-section dark:bg-d-surface/95 border border-border/70 dark:border-d-border/70",
  surface:
    "bg-elevated dark:bg-d-elevated/95 border border-border/60 dark:border-d-border/60",
  outline:
    "bg-section/95 dark:bg-d-elevated/90 border border-border dark:border-d-border",
  primary: "bg-primary",
  secondary: "bg-secondary dark:bg-primary",
};

export function Card({
  children,
  variant = "section",
  padded = true,
  className,
  ...rest
}: CardProps) {
  return (
    <View
      {...rest}
      className={[
        "rounded-3xl",
        variants[variant],
        padded ? "p-4" : "",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </View>
  );
}
