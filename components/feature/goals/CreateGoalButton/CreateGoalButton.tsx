import { Ionicons } from "@expo/vector-icons";

import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/hooks/i18n/useTranslation";

type Props = {
  onPress: () => void;
};

export function CreateGoalButton({ onPress }: Props) {
  const { t } = useTranslation();

  return (
    <Button
      label={t("goals.createTitle")}
      size="lg"
      fullWidth
      onPress={onPress}
      leading={<Ionicons name="flag-outline" size={22} color="#fff" />}
    />
  );
}
