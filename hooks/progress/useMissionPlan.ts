import { useCallback, useMemo, useState } from "react";

import {
  arePlanTasksComplete,
  getChapterForDay,
  getDayPlan,
  getQuitPlanSnapshot,
} from "@/constants/progress/plan";
import { PLAN_PREVIEW_UNLOCK_ALL } from "@/config/plan";
import type { PlanDayLockedModalContent } from "@/components/feature/missions/PlanDayLockedModal";
import { usePlanProgress } from "@/hooks/progress/usePlanProgress";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import type { QuitPlanDay, ResolvedPlanTask } from "@/types";
import { getPlanDayLockedCopy } from "@/utils/progress/planDayLockedMessage";

export type MissionDayStatus = "locked" | "current" | "complete" | "available";

export type MissionMapDay = {
  day: number;
  title: string;
  status: MissionDayStatus;
};

export type MissionModuleTab = {
  chapterNumber: number;
  chapterName: string;
};

export type MissionPlan = {
  modules: MissionModuleTab[];
  chapterName: string;
  chapterRole: string;
  chapterNumber: number;
  selectedModule: number;
  selectModule: (chapterNumber: number) => void;
  currentDay: number;
  unlockedThroughDay: number;
  selectedDay: number;
  selectDay: (day: number) => void;
  mapDays: MissionMapDay[];
  selectedDayPlan: QuitPlanDay;
  tasks: ResolvedPlanTask[];
  completedCount: number;
  totalCount: number;
  progress: number;
  isComplete: boolean;
  canToggleTasks: boolean;
  toggleTask: (taskId: string, value: boolean) => void;
  planLoading: boolean;
  planError: string | null;
  refreshPlan: () => Promise<void>;
  hasQuitStreak: boolean;
  lockedDayModal: PlanDayLockedModalContent | null;
  showLockedDayMessage: (day: number) => void;
  closeLockedDayModal: () => void;
};

export function useMissionPlan(): MissionPlan {
  const { t, locale } = useTranslation();
  const {
    profile,
    currentDay,
    unlockedThroughDay,
    resolveTasksForDay,
    toggleTask: togglePlanTask,
    todayComplete,
    planLoading,
    planError,
    refreshPlan,
  } = usePlanProgress();

  const displayCurrentDay = currentDay > 0 ? currentDay : unlockedThroughDay > 0 ? 1 : 0;

  const currentChapter = useMemo(
    () => getChapterForDay(currentDay > 0 ? currentDay : 1),
    [currentDay, locale],
  );
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [lockedDayModal, setLockedDayModal] = useState<PlanDayLockedModalContent | null>(
    null,
  );
  const activeDay = selectedDay ?? (displayCurrentDay > 0 ? displayCurrentDay : 1);
  const activeModuleNumber = useMemo(() => {
    const preferred = selectedModule ?? currentChapter.chapter;
    if (PLAN_PREVIEW_UNLOCK_ALL) return preferred;
    return Math.min(preferred, currentChapter.chapter);
  }, [selectedModule, currentChapter.chapter]);
  const activeChapter =
    getQuitPlanSnapshot().chapters.find((chapter) => chapter.chapter === activeModuleNumber) ??
    currentChapter;

  const modules = useMemo(() => {
    const plan = getQuitPlanSnapshot();
    const chapters = PLAN_PREVIEW_UNLOCK_ALL
      ? plan.chapters
      : plan.chapters.filter((chapter) => chapter.chapter <= currentChapter.chapter);

    return chapters.map((chapter) => ({
      chapterNumber: chapter.chapter,
      chapterName: chapter.name,
    }));
  }, [currentChapter.chapter, locale]);

  const selectModule = useCallback(
    (chapterNumber: number) => {
      const exists = getQuitPlanSnapshot().chapters.some(
        (chapter) => chapter.chapter === chapterNumber,
      );
      if (!exists) return;
      if (!PLAN_PREVIEW_UNLOCK_ALL && chapterNumber > currentChapter.chapter) return;
      setSelectedModule(chapterNumber);
    },
    [currentChapter.chapter],
  );

  const selectDay = useCallback(
    (day: number) => {
      if (day < activeChapter.day_start || day > activeChapter.day_end) return;
      if (!PLAN_PREVIEW_UNLOCK_ALL && day > unlockedThroughDay) return;
      setSelectedDay(day);
    },
    [activeChapter.day_start, activeChapter.day_end, unlockedThroughDay],
  );

  const mapDays = useMemo((): MissionMapDay[] => {
    return activeChapter.days.map((dayPlan) => {
      let status: MissionDayStatus;

      if (PLAN_PREVIEW_UNLOCK_ALL) {
        if (
          dayPlan.day < displayCurrentDay ||
          (dayPlan.day === displayCurrentDay && todayComplete)
        ) {
          status = "complete";
        } else if (dayPlan.day === displayCurrentDay) {
          status = "current";
        } else {
          status = "available";
        }
      } else if (dayPlan.day > unlockedThroughDay) {
        status = "locked";
      } else if (displayCurrentDay > 0 && dayPlan.day < displayCurrentDay) {
        status = "complete";
      } else if (dayPlan.day === displayCurrentDay && todayComplete) {
        status = "complete";
      } else if (dayPlan.day === displayCurrentDay) {
        status = "current";
      } else {
        status = "complete";
      }

      return {
        day: dayPlan.day,
        title: dayPlan.title,
        status,
      };
    });
  }, [activeChapter.days, displayCurrentDay, unlockedThroughDay, todayComplete, locale]);

  const selectedDayPlan = useMemo(() => {
    return getDayPlan(activeDay) ?? activeChapter.days[0];
  }, [activeDay, activeChapter.days]);

  const tasks = useMemo(
    () => resolveTasksForDay(activeDay),
    [resolveTasksForDay, activeDay],
  );

  const completedCount = tasks.filter((task) => task.done).length;
  const totalCount = tasks.length;
  const progress = totalCount === 0 ? 0 : completedCount / totalCount;
  const isComplete = arePlanTasksComplete(tasks);
  const canToggleTasks = PLAN_PREVIEW_UNLOCK_ALL || activeDay === displayCurrentDay;

  const toggleTask = useCallback(
    (taskId: string, value: boolean) => {
      if (!canToggleTasks) return;
      void togglePlanTask(activeDay, taskId, value);
    },
    [canToggleTasks, togglePlanTask, activeDay],
  );

  const showLockedDayMessage = useCallback(
    (day: number) => {
      const copy = getPlanDayLockedCopy(day, (key, params) => t(key as Parameters<typeof t>[0], params));
      setLockedDayModal({ day, ...copy });
    },
    [t],
  );

  const closeLockedDayModal = useCallback(() => {
    setLockedDayModal(null);
  }, []);

  return {
    modules,
    chapterName: activeChapter.name,
    chapterRole: activeChapter.role,
    chapterNumber: activeChapter.chapter,
    selectedModule: activeChapter.chapter,
    selectModule,
    currentDay: displayCurrentDay,
    unlockedThroughDay,
    selectedDay: activeDay,
    selectDay,
    mapDays,
    selectedDayPlan,
    tasks,
    completedCount,
    totalCount,
    progress,
    isComplete,
    canToggleTasks,
    toggleTask,
    planLoading,
    planError,
    refreshPlan,
    hasQuitStreak: Boolean(profile?.streakStart ?? profile?.quitDate),
    lockedDayModal,
    showLockedDayMessage,
    closeLockedDayModal,
  };
}
