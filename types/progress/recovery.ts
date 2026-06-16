export type RecoveryRingId = "nicotine" | "breathing" | "heart";

export type RecoveryRingAccent = "primary" | "accent" | "alert";

export type RecoveryProgressValues = Record<RecoveryRingId, number>;

/** Center icon: Ionicons (default) or Material Community. */
export type RecoveryRingIcon =
  | { family: "ionicons"; name: string }
  | { family: "materialCommunity"; name: string };

export type RecoveryRingDefinition = {
  id: RecoveryRingId;
  icon: RecoveryRingIcon;
  label: string;
  accent: RecoveryRingAccent;
};
