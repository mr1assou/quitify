import { Redirect } from "expo-router";

/** The More tab is a popup opened by the custom tab bar, not a destination screen. */
export default function MoreTabRoute() {
  return <Redirect href="/(tabs)" />;
}
