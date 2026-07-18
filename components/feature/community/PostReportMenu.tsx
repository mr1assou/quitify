import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { ActivityIndicator, Modal, Pressable, Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { reportPost as reportPostApi } from "@/services/posts/postsApi";

type Props = {
  postId: string;
};

type ReportModalState =
  | { type: "confirm" }
  | { type: "reporting" }
  | { type: "done" }
  | { type: "error" };

function ModalBackdrop({
  onClose,
  canDismiss,
  children,
}: {
  onClose: () => void;
  canDismiss: boolean;
  children: React.ReactNode;
}) {
  return (
    <Modal
      visible
      transparent
      animationType="fade"
      onRequestClose={canDismiss ? onClose : undefined}
    >
      <View className="flex-1 items-center justify-center px-6">
        {canDismiss ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            className="absolute inset-0 bg-black/50"
            onPress={onClose}
          />
        ) : (
          <View className="absolute inset-0 bg-black/50" />
        )}
        <View className="w-full max-w-sm overflow-hidden rounded-3xl bg-background px-6 py-7 dark:bg-d-bg">
          {children}
        </View>
      </View>
    </Modal>
  );
}

/** Report entry on community posts from other users (Play UGC policy). */
export function PostReportMenu({ postId }: Props) {
  const { colors } = useTheme();
  const [modal, setModal] = useState<ReportModalState | null>(null);

  const closeModal = () => {
    Haptics.selectionAsync().catch(() => {});
    setModal(null);
  };

  const onConfirmReport = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(
      () => {},
    );
    setModal({ type: "reporting" });
    void reportPostApi(postId)
      .then(() => setModal({ type: "done" }))
      .catch(() => setModal({ type: "error" }));
  };

  return (
    <>
      <Pressable
        hitSlop={8}
        onPress={() => setModal({ type: "confirm" })}
        className="ml-2 h-9 w-9 items-center justify-center rounded-full"
        accessibilityLabel="Report post"
      >
        <Ionicons
          name="alert-circle-outline"
          size={20}
          color={colors.mutedForeground}
        />
      </Pressable>

      {modal?.type === "confirm" ? (
        <ModalBackdrop onClose={closeModal} canDismiss>
          <View className="items-center">
            <View
              className="h-24 w-24 items-center justify-center rounded-full"
              style={{ backgroundColor: `${colors.alert}18` }}
            >
              <View className="h-16 w-16 items-center justify-center rounded-full bg-alert">
                <Ionicons name="flag-outline" size={32} color={colors.white} />
              </View>
            </View>

            <Text className="mt-5 text-center text-xl font-bold text-foreground dark:text-d-text">
              Report this post?
            </Text>
            <Text className="mt-2 text-center text-sm leading-5 text-muted-foreground dark:text-d-muted">
              Report content that is offensive, harmful, or not related to
              quitting smoking. Our team will review it.
            </Text>
          </View>

          <View className="mt-7 items-center gap-3">
            <Pressable
              accessibilityRole="button"
              onPress={onConfirmReport}
              className="w-full rounded-2xl bg-alert px-10 py-3.5"
            >
              <Text className="text-center text-base font-bold text-white">
                Report post
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={closeModal}
              className="items-center py-2"
            >
              <Text className="text-sm font-semibold text-muted-foreground dark:text-d-muted">
                Cancel
              </Text>
            </Pressable>
          </View>
        </ModalBackdrop>
      ) : null}

      {modal?.type === "reporting" ? (
        <ModalBackdrop onClose={closeModal} canDismiss={false}>
          <View className="items-center py-4">
            <ActivityIndicator size="large" color={colors.primary} />
            <Text className="mt-5 text-center text-base font-semibold text-foreground dark:text-d-text">
              Sending report…
            </Text>
          </View>
        </ModalBackdrop>
      ) : null}

      {modal?.type === "done" || modal?.type === "error" ? (
        <ModalBackdrop onClose={closeModal} canDismiss>
          <View className="items-center">
            <View
              className="h-24 w-24 items-center justify-center rounded-full"
              style={{
                backgroundColor:
                  modal.type === "done"
                    ? `${colors.primary}18`
                    : `${colors.alert}18`,
              }}
            >
              <View
                className={`h-16 w-16 items-center justify-center rounded-full ${
                  modal.type === "done" ? "bg-primary" : "bg-alert"
                }`}
              >
                <Ionicons
                  name={
                    modal.type === "done"
                      ? "checkmark-circle-outline"
                      : "alert-circle-outline"
                  }
                  size={32}
                  color={colors.white}
                />
              </View>
            </View>

            <Text className="mt-5 text-center text-xl font-bold text-foreground dark:text-d-text">
              {modal.type === "done" ? "Thanks for reporting" : "Could not report post"}
            </Text>
            <Text className="mt-2 text-center text-sm leading-5 text-muted-foreground dark:text-d-muted">
              {modal.type === "done"
                ? "Our team will review this post and take action if needed."
                : "Please try again."}
            </Text>
          </View>

          <View className="mt-7 items-center">
            <Pressable
              accessibilityRole="button"
              onPress={closeModal}
              className="rounded-2xl bg-primary px-10 py-3.5"
            >
              <Text className="text-center text-base font-bold text-white">
                Got it
              </Text>
            </Pressable>
          </View>
        </ModalBackdrop>
      ) : null}
    </>
  );
}
