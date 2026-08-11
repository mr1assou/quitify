import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/hooks/i18n/useTranslation";

type Props = {
  onPress: () => void;
  disabled?: boolean;
};

export function BreathingFinishButton({ onPress, disabled = false }: Props) {
  const { t } = useTranslation();

  return (
    <Button
      label={t("craving.finishSession")}
      variant="accent"
      size="lg"
      fullWidth
      disabled={disabled}
      preventDoublePress
      onPress={onPress}
    />
  );
}
