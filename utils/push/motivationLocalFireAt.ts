import { DateTime } from "luxon";

import {
  MOTIVATION_LOCAL_SCHEDULES,
  MOTIVATION_LOCAL_TIMEZONE,
} from "@/constants/push/motivationLocalNotifications";

export type MotivationLocalFireSlot = {
  fireAt: Date;
  slot: (typeof MOTIVATION_LOCAL_SCHEDULES)[number]["slot"];
  dayOffset: number;
  sequenceIndex: number;
};

/** Upcoming motivation fire times in US Eastern, skipping times already passed today. */
export function listUpcomingMotivationLocalFireSlots(
  daysAhead: number,
  now = DateTime.now().setZone(MOTIVATION_LOCAL_TIMEZONE),
): MotivationLocalFireSlot[] {
  const slots: MotivationLocalFireSlot[] = [];
  let sequenceIndex = 0;

  for (let dayOffset = 0; dayOffset < daysAhead; dayOffset++) {
    for (const schedule of MOTIVATION_LOCAL_SCHEDULES) {
      const fireAt = now
        .plus({ days: dayOffset })
        .set({
          hour: schedule.hour,
          minute: schedule.minute,
          second: 0,
          millisecond: 0,
        })
        .toJSDate();

      if (fireAt.getTime() <= Date.now()) continue;

      slots.push({
        fireAt,
        slot: schedule.slot,
        dayOffset,
        sequenceIndex: sequenceIndex++,
      });
    }
  }

  return slots;
}
