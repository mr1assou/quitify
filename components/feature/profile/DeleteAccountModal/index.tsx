import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  DELETE_ACCOUNT_CONFIRMATION,
  matchesDeleteAccountConfirmation,
} from "@/constants/auth/deleteAccount";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

export function DeleteAccountModal({ visible, onClose, onConfirm }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [phrase, setPhrase] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    setPhrase("");
    setDeleting(false);
    setError(null);
  }, [visible]);

  const canConfirm = matchesDeleteAccountConfirmation(phrase) && !deleting;

  const handleClose = () => {
    if (deleting) return;
    onClose();
  };

  const handleConfirm = () => {
    if (!canConfirm) return;
    setDeleting(true);
    setError(null);
    void onConfirm().catch(() => {
      setDeleting(false);
      setError(t("settings.deleteAccountError"));
    });
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 items-center justify-center px-6"
      >
        {deleting ? (
          <View className="absolute inset-0 bg-black/50" />
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("settings.deleteAccountCancel")}
            className="absolute inset-0 bg-black/50"
            onPress={handleClose}
          />
        )}

        <View className="w-full max-w-sm rounded-3xl bg-background px-6 py-7 dark:bg-d-bg">
          {deleting ? (
            <View className="items-center py-4">
              <ActivityIndicator size="large" color={colors.primary} />
              <Text className="mt-5 text-center text-base font-semibold text-foreground dark:text-d-text">
                {t("settings.deleteAccountDeleting")}
              </Text>
            </View>
          ) : (
            <>
              <Text className="text-center text-xl font-bold text-foreground dark:text-d-text">
                {t("settings.deleteAccountTitle")}
              </Text>
              <Text className="mt-2 text-center text-sm leading-5 text-muted-foreground dark:text-d-muted">
                {t("settings.deleteAccountHintBefore")}
                <Text className="font-bold text-foreground dark:text-d-text">
                  {`'${DELETE_ACCOUNT_CONFIRMATION}'`}
                </Text>
                {t("settings.deleteAccountHintAfter")}
              </Text>

              <TextInput
                value={phrase}
                onChangeText={setPhrase}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder={t("settings.deleteAccountPlaceholder")}
                placeholderTextColor={colors.mutedForeground}
                className="mt-5 rounded-2xl bg-section px-4 py-3 text-base text-foreground dark:bg-d-surface dark:text-d-text"
              />

              {error ? <Text className="mt-3 text-sm text-alert">{error}</Text> : null}

              <Pressable
                accessibilityRole="button"
                disabled={!canConfirm}
                onPress={handleConfirm}
                className={`mt-6 items-center rounded-2xl py-3.5 ${
                  canConfirm ? "bg-alert" : "bg-alert/40"
                }`}
              >
                <Text className="text-base font-bold text-white">
                  {t("settings.deleteAccountConfirm")}
                </Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={handleClose}
                className="mt-3 items-center py-2"
              >
                <Text className="text-sm font-semibold text-muted-foreground dark:text-d-muted">
                  {t("settings.deleteAccountCancel")}
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
