import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/hooks/i18n/useTranslation";

type Props = {
  onPress: () => void;
};

export function BreathingFinishButton({ onPress }: Props) {
  const { t } = useTranslation();

  return (
    <Button
      label={t("craving.finishSession")}
      variant="accent"
      size="lg"
      fullWidth
      onPress={onPress}
    />
  );
}
