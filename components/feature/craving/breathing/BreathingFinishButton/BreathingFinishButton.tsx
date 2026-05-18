import { Button } from "@/components/ui/Button";

type Props = {
  onPress: () => void;
};

export function BreathingFinishButton({ onPress }: Props) {
  return (
    <Button
      label="Finish craving session"
      variant="accent"
      size="lg"
      fullWidth
      onPress={onPress}
    />
  );
}
