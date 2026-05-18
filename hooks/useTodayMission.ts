import { useCallback, useEffect, useMemo } from "react";

import { getMissionForDay } from "@/constants/missions";
import { useApp } from "@/context/AppContext";
import { useNow } from "@/hooks/useNow";
import type { ResolvedTask, TodayMission } from "@/types";
import { dayKey } from "@/utils/dates";
import { currentMissionDay } from "@/utils/streak";

import { useTodayCravings } from "./useStats";

export type { ResolvedTask, TodayMission } from "@/types";

export function useTodayMission(): TodayMission | null {
  const { state, toggleMissionTask, completeMission } = useApp();
  const now = useNow(60_000);
  const todayCravings = useTodayCravings();

  const computed = useMemo(() => {
    if (!state.profile) return null;
    const day = currentMissionDay(state.profile, now);
    const mission = getMissionForDay(day);
    const key = dayKey(now);
    const log = state.missionLogs[key];

    const handledToday = todayCravings.some((c) => c.outcome === "resisted");
    const sessionLoggedToday = todayCravings.length > 0;
    const noSmokeToday = !todayCravings.some(
      (c) => c.outcome === "lapse" || c.outcome === "relapse",
    );

    const tasks: ResolvedTask[] = mission.tasks.map((t) => {
      let done = false;
      switch (t.type) {
        case "no-smoke-today":
          done = noSmokeToday;
          break;
        case "handle-craving-today":
          done = handledToday;
          break;
        case "log-craving-session":
          done = sessionLoggedToday;
          break;
        case "manual":
          done = log?.taskStates?.[t.id] ?? false;
          break;
      }
      return { ...t, done };
    });

    const completedCount = tasks.filter((t) => t.done).length;
    const totalCount = tasks.length;
    const progress = totalCount === 0 ? 0 : completedCount / totalCount;
    const isComplete = completedCount === totalCount && totalCount > 0;

    return {
      day,
      mission,
      tasks,
      completedCount,
      totalCount,
      progress,
      isComplete,
      alreadyMarkedComplete: !!log?.completedAt,
    };
  }, [state.profile, state.missionLogs, todayCravings, now]);

  useEffect(() => {
    if (computed?.isComplete && !computed.alreadyMarkedComplete) {
      completeMission(computed.day);
    }
  }, [computed?.isComplete, computed?.alreadyMarkedComplete, computed?.day, completeMission]);

  const toggleTask = useCallback(
    (taskId: string, value: boolean) => {
      if (!computed) return;
      toggleMissionTask(computed.day, taskId, value);
    },
    [computed, toggleMissionTask],
  );

  return useMemo(() => {
    if (!computed) return null;
    const {
      mission,
      tasks,
      completedCount,
      totalCount,
      progress,
      isComplete,
    } = computed;
    return {
      mission,
      tasks,
      completedCount,
      totalCount,
      progress,
      isComplete,
      toggleTask,
    };
  }, [computed, toggleTask]);
}
