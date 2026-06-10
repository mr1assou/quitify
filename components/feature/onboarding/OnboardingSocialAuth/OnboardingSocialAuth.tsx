import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

import { GoogleGLogo } from "@/components/feature/onboarding/OnboardingSocialAuth/GoogleGLogo";

const BUTTON_HEIGHT = 52;
const ICON_SLOT = 24;

type Props = {
  onGoogle: () => void;
  onEmail: () => void;
  disabled?: boolean;
  googleDisabled?: boolean;
  emailDisabled?: boolean;
};

type SocialButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  icon: ReactNode;
};

function SocialSignInButton({ label, onPress, disabled, icon }: SocialButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      className={[
        "flex-row items-center rounded-2xl bg-white px-4",
        disabled ? "opacity-50" : "active:opacity-90",
      ].join(" ")}
      style={{
        height: BUTTON_HEIGHT,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View
        className="items-center justify-center"
        style={{ width: ICON_SLOT, height: ICON_SLOT }}
      >
        {icon}
      </View>
      <Text
        className="flex-1 text-center text-[15px] font-semibold tracking-tight text-[#1f1f1f]"
        style={{ marginRight: ICON_SLOT }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/** Google sign-in + email link on the post-onboarding celebration screen. */
export function OnboardingSocialAuth({
  onGoogle,
  onEmail,
  disabled,
  googleDisabled,
  emailDisabled,
}: Props) {
  const googleOff = googleDisabled ?? disabled;
  const emailOff = emailDisabled ?? disabled;

  return (
    <View>
      <SocialSignInButton
        label="Continue with Google"
        onPress={onGoogle}
        disabled={googleOff}
        icon={<GoogleGLogo size={22} />}
      />
      <Pressable
        onPress={onEmail}
        disabled={emailOff}
        accessibilityRole="link"
        accessibilityLabel="Continue with email"
        className="items-center pt-5 active:opacity-70"
      >
        <Text className="text-center text-base font-semibold text-foreground dark:text-d-text">
          Continue with email
        </Text>
      </Pressable>
    </View>
  );
}
