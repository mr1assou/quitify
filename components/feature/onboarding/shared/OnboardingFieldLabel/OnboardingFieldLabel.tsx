import { Text } from "react-native";

type Props = {
  children: string;
};

export function OnboardingFieldLabel({ children }: Props) {
  return (
    <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
      {children}
    </Text>
  );
}
