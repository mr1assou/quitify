import { Text } from "react-native";

type Props = {
  title: string;
};

export function HomeSectionTitle({ title }: Props) {
  return (
    <Text className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
      {title}
    </Text>
  );
}
