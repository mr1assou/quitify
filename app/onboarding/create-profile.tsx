import { safeRouter } from "@/utils/app/safeRouter";
import { useCallback, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";

import { CountryFields } from "@/components/feature/onboarding/CountryFields";
import { CreateProfileStep } from "@/components/feature/onboarding/CreateProfileStep";
import { QuitDateFields } from "@/components/feature/onboarding/QuitDateFields";
import { OnboardingShell } from "@/components/feature/onboarding/OnboardingShell";
import { OnboardingSectionDivider } from "@/components/feature/onboarding/shared/OnboardingSectionDivider";
import { ONBOARDING_TOTAL_STEPS } from "@/constants/onboarding/onboardingFlow";
import type { ProfileSex } from "@/types";
import { useOnboarding } from "@/context/OnboardingContext";
import { useQuitPlanHandlers } from "@/hooks/onboarding/useQuitPlanHandlers";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import {
  getCreateProfileFieldErrors,
  isCreateProfileStepComplete,
} from "@/utils/onboarding/createProfileOnboarding";
import { pickDefaultProfileImageForSex } from "@/utils/profile/pickDefaultProfileImage";

export default function OnboardingCreateProfile() {
  const { t } = useTranslation();
  const { draft, patch } = useOnboarding();
  const quitDateHandlers = useQuitPlanHandlers(draft, patch);
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [attemptedContinue, setAttemptedContinue] = useState(false);

  const canContinue = useMemo(
    () => isCreateProfileStepComplete(draft) && usernameAvailable,
    [draft, usernameAvailable],
  );

  const fieldErrors = useMemo(() => {
    if (!attemptedContinue) return {};
    return getCreateProfileFieldErrors(draft, { usernameTaken });
  }, [attemptedContinue, draft, usernameTaken]);

  const onAvailabilityChange = useCallback(
    (state: { canUse: boolean; taken: boolean; checking: boolean }) => {
      setUsernameAvailable(state.canUse);
      setUsernameTaken(state.taken);
    },
    [],
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <OnboardingShell
        step={5}
        total={ONBOARDING_TOTAL_STEPS}
        title={t("onboarding.profile.title")}
        primaryLabel={t("common.continue")}
        primaryDisabled={!canContinue}
        primaryPressWhenDisabled
        onPrimary={() => {
          if (!canContinue) {
            setAttemptedContinue(true);
            return;
          }
          safeRouter.push("/onboarding/nicotine-consumption");
        }}
        showBack
        scrollBody
      >
        <ScrollView
          className="w-full flex-1"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 8 }}
        >
          <View className="gap-8 pb-2">
            <CreateProfileStep
              username={draft.username}
              onUsernameChange={(username) => patch({ username })}
              onAvailabilityChange={onAvailabilityChange}
              sex={draft.sex}
              onSexChange={(sex: ProfileSex) =>
                patch({
                  sex,
                  defaultProfileImage: pickDefaultProfileImageForSex(sex),
                })
              }
              usernameError={
                fieldErrors.username
                  ? t("onboarding.profile.username.required")
                  : fieldErrors.usernameTaken
                    ? t("onboarding.profile.username.taken")
                    : undefined
              }
              sexError={
                fieldErrors.sex ? t("onboarding.profile.sex.required") : undefined
              }
            />
            <OnboardingSectionDivider />
            <CountryFields
              draft={draft}
              patch={patch}
              fieldError={
                fieldErrors.country
                  ? t("onboarding.profile.country.required")
                  : undefined
              }
            />
            <OnboardingSectionDivider />
            <QuitDateFields
              draft={draft}
              onSelectPreset={quitDateHandlers.selectPreset}
              onMonthChange={quitDateHandlers.updateCustomMonth}
              onDayChange={quitDateHandlers.updateCustomDay}
              onYearChange={quitDateHandlers.updateCustomYear}
              error={
                fieldErrors.quitDate
                  ? t("onboarding.profile.quitDate.required")
                  : undefined
              }
            />
          </View>
        </ScrollView>
      </OnboardingShell>
    </KeyboardAvoidingView>
  );
}
