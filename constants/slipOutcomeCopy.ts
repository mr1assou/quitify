export type SlipOutcomeCopy = {
  imageAccessibilityLabel: string;
  title: string;
  subtitle: string;
  buttonLabel: string;
};

export const LAPSE_OUTCOME_COPY: SlipOutcomeCopy = {
  imageAccessibilityLabel: "One slip doesn't undo your progress",
  title: "One slip. Not the end.",
  subtitle: "Be proud you showed up to log it. Tomorrow is still yours.",
  buttonLabel: "Keep going",
};

export const RELAPSE_OUTCOME_COPY: SlipOutcomeCopy = {
  imageAccessibilityLabel: "You can start fresh — your progress still counts",
  title: "Let's restart, stronger.",
  subtitle: "You're still moving forward — and that matters.",
  buttonLabel: "Start fresh",
};
