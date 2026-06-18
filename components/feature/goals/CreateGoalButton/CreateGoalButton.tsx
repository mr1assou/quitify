import { Ionicons } from "@expo/vector-icons";

import { Button } from "@/components/ui/Button";

type Props = {
  onPress: () => void;
};

export function CreateGoalButton({ onPress }: Props) {
  return (
    <Button
      label="Create a goal"
      size="lg"
      fullWidth
      onPress={onPress}
      leading={<Ionicons name="flag-outline" size={22} color="#fff" />}
    />
  );
}
