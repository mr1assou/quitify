import { Redirect } from "expo-router";

/** Legacy root route — intro now lives in the onboarding stack for fast nav. */
export default function IntroRedirect() {
  return <Redirect href="/onboarding/intro" />;
}
