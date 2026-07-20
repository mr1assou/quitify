import { Share } from "react-native";

import { WEBSITE_BASE_URL } from "@/constants/app/website";

const SHARE_MESSAGE = [
  "I'm using Quitify to quit smoking — check it out:",
  WEBSITE_BASE_URL,
].join("\n");

/** Opens the system share sheet so the user can send Quitify via WhatsApp, Instagram, etc. */
export async function shareApp(): Promise<void> {
  try {
    await Share.share({
      message: SHARE_MESSAGE,
      title: "Share Quitify",
    });
  } catch {
    // User dismissed or share failed — nothing to do.
  }
}
