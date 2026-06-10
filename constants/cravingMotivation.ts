/** Fixed line shown in the craving-session speech bubble. */
export const CRAVING_SESSION_BUBBLE_MESSAGE =
  "You are stronger, you are stronger you can do it!";

/** Short, punchy lines for the craving-session manga speech bubble. */
export const CRAVING_MOTIVATION_MESSAGES = [
  "This urge is loud — but you're louder!",
  "Five minutes. That's all you need to win.",
  "Future you is cheering right now!",
  "You've survived every craving so far. Keep going!",
  "Breathe. You're stronger than this feeling.",
  "Don't negotiate with the urge — outlast it!",
  "One more minute. You've got this!",
  "The craving passes. Your progress stays.",
  "You didn't come this far to stop now.",
  "Hold the line — you're doing amazing.",
] as const;

export function pickCravingMotivationMessage(): string {
  const index = Math.floor(Math.random() * CRAVING_MOTIVATION_MESSAGES.length);
  return CRAVING_MOTIVATION_MESSAGES[index] ?? CRAVING_MOTIVATION_MESSAGES[0];
}
