import type { Mission } from "@/types";

export const MISSIONS: Mission[] = [
  {
    day: 1,
    title: "Make it through Day 1",
    description: "The first day is the hardest. Stay close to the app.",
    tasks: [
      { id: "no-smoke", label: "Stay smoke-free today", type: "no-smoke-today" },
      { id: "handle-craving", label: "Handle 1 craving", type: "handle-craving-today" },
      { id: "water", label: "Drink 2 glasses of water", type: "manual" },
    ],
  },
  {
    day: 2,
    title: "Spot your triggers",
    description: "Notice when you crave most. Coffee? Stress? Boredom?",
    tasks: [
      { id: "no-smoke", label: "Stay smoke-free today", type: "no-smoke-today" },
      { id: "log-trigger", label: "Note 1 personal trigger", type: "manual" },
      { id: "session", label: "Run 1 craving session", type: "log-craving-session" },
    ],
  },
  {
    day: 3,
    title: "Avoid triggers",
    description: "Change your route. Skip the smoke break. You choose.",
    tasks: [
      { id: "no-smoke", label: "Stay smoke-free today", type: "no-smoke-today" },
      { id: "swap", label: "Replace 1 trigger with a walk", type: "manual" },
      { id: "handle-craving", label: "Handle 1 craving", type: "handle-craving-today" },
    ],
  },
  {
    day: 4,
    title: "Move your body",
    description: "10 minutes of movement crushes cravings.",
    tasks: [
      { id: "no-smoke", label: "Stay smoke-free today", type: "no-smoke-today" },
      { id: "move", label: "Walk or stretch for 10 minutes", type: "manual" },
      { id: "handle-craving", label: "Handle 1 craving", type: "handle-craving-today" },
    ],
  },
  {
    day: 5,
    title: "Reward yourself",
    description: "You saved money. Spend a little on something kind.",
    tasks: [
      { id: "no-smoke", label: "Stay smoke-free today", type: "no-smoke-today" },
      { id: "reward", label: "Pick a small reward to look forward to", type: "manual" },
      { id: "session", label: "Run 1 craving session", type: "log-craving-session" },
    ],
  },
  {
    day: 6,
    title: "Share your win",
    description: "Tell 1 person. Saying it makes it real.",
    tasks: [
      { id: "no-smoke", label: "Stay smoke-free today", type: "no-smoke-today" },
      { id: "share", label: "Tell someone you're quitting", type: "manual" },
      { id: "handle-craving", label: "Handle 1 craving", type: "handle-craving-today" },
    ],
  },
  {
    day: 7,
    title: "One week strong",
    description: "Your lungs are already clearing. Keep going.",
    tasks: [
      { id: "no-smoke", label: "Stay smoke-free today", type: "no-smoke-today" },
      { id: "reflect", label: "Note how you feel today", type: "manual" },
      { id: "handle-craving", label: "Handle 1 craving", type: "handle-craving-today" },
    ],
  },
  {
    day: 8,
    title: "Hydrate hard",
    description: "Water flushes nicotine and dampens urges.",
    tasks: [
      { id: "no-smoke", label: "Stay smoke-free today", type: "no-smoke-today" },
      { id: "water", label: "Drink 6 glasses of water", type: "manual" },
      { id: "handle-craving", label: "Handle 1 craving", type: "handle-craving-today" },
    ],
  },
  {
    day: 9,
    title: "Plan a hard moment",
    description: "Predict your toughest hour. Plan a response.",
    tasks: [
      { id: "no-smoke", label: "Stay smoke-free today", type: "no-smoke-today" },
      { id: "plan", label: "Write 1 if/then plan", type: "manual" },
      { id: "session", label: "Run 1 craving session", type: "log-craving-session" },
    ],
  },
  {
    day: 10,
    title: "Double digits",
    description: "10 days. The cravings are shorter and weaker now.",
    tasks: [
      { id: "no-smoke", label: "Stay smoke-free today", type: "no-smoke-today" },
      { id: "deep-breath", label: "Do 10 slow breaths", type: "manual" },
      { id: "handle-craving", label: "Handle 1 craving", type: "handle-craving-today" },
    ],
  },
  {
    day: 11,
    title: "Clean your space",
    description: "Remove every reminder of smoking from your home.",
    tasks: [
      { id: "no-smoke", label: "Stay smoke-free today", type: "no-smoke-today" },
      { id: "clean", label: "Toss lighters, ashtrays, leftovers", type: "manual" },
      { id: "handle-craving", label: "Handle 1 craving", type: "handle-craving-today" },
    ],
  },
  {
    day: 12,
    title: "Energy day",
    description: "Walk further than yesterday. Notice your breath.",
    tasks: [
      { id: "no-smoke", label: "Stay smoke-free today", type: "no-smoke-today" },
      { id: "walk", label: "Take a 15-minute walk", type: "manual" },
      { id: "handle-craving", label: "Handle 1 craving", type: "handle-craving-today" },
    ],
  },
  {
    day: 13,
    title: "Sleep early",
    description: "Tired = vulnerable. Give your body real rest.",
    tasks: [
      { id: "no-smoke", label: "Stay smoke-free today", type: "no-smoke-today" },
      { id: "sleep", label: "Be in bed before midnight", type: "manual" },
      { id: "session", label: "Run 1 craving session", type: "log-craving-session" },
    ],
  },
  {
    day: 14,
    title: "Two weeks free",
    description: "Your circulation is up. Stairs feel easier already.",
    tasks: [
      { id: "no-smoke", label: "Stay smoke-free today", type: "no-smoke-today" },
      { id: "celebrate", label: "Celebrate quietly. You earned it.", type: "manual" },
      { id: "handle-craving", label: "Handle 1 craving", type: "handle-craving-today" },
    ],
  },
];

export function getMissionForDay(day: number): Mission {
  if (day <= 0) return MISSIONS[0];
  if (day <= MISSIONS.length) return MISSIONS[day - 1];
  const idx = ((day - 1) % MISSIONS.length + MISSIONS.length) % MISSIONS.length;
  return { ...MISSIONS[idx], day };
}
