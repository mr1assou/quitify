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
  section: "bg-section dark:bg-d-surface",
  surface: "bg-background dark:bg-d-elevated",
  outline:
    "bg-background dark:bg-d-elevated border border-secondary dark:border-d-border",
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
