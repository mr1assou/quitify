import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";

import type {
  AppFlags,
  AppState,
  CravingLog,
  CravingOutcome,
  MissionLog,
  UserAccount,
  UserProfile,
} from "@/types";
import { dayKey } from "@/utils/dates";

type Action =
  | { type: "COMPLETE_ONBOARDING"; profile: UserProfile }
  | { type: "UPDATE_PROFILE"; patch: Partial<UserProfile> }
  | {
      type: "LOG_CRAVING";
      outcome: CravingOutcome;
      intensity?: 1 | 2 | 3;
      durationMs?: number;
    }
  | { type: "DELETE_CRAVING"; id: string }
  | { type: "TOGGLE_MISSION_TASK"; missionDay: number; taskId: string; value: boolean }
  | { type: "COMPLETE_MISSION"; missionDay: number }
  | { type: "SET_PREMIUM"; value: boolean }
  | { type: "SET_ACCOUNT"; account: UserAccount | null }
  | { type: "SET_FLAG"; key: keyof AppFlags; value: boolean }
  | { type: "RESET" };

const initialFlags: AppFlags = {
  hasSeenSignupPrompt: false,
  hasSeenPaywall: false,
  hasLoggedFirstCraving: false,
};

const initialState: AppState = {
  isOnboarded: false,
  profile: null,
  cravings: [],
  missionLogs: {},
  isPremium: false,
  account: null,
  flags: initialFlags,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "COMPLETE_ONBOARDING":
      return { ...state, isOnboarded: true, profile: action.profile };
    case "UPDATE_PROFILE":
      if (!state.profile) return state;
      return { ...state, profile: { ...state.profile, ...action.patch } };
    case "LOG_CRAVING": {
      const now = Date.now();
      const log: CravingLog = {
        id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
        timestamp: now,
        outcome: action.outcome,
        intensity: action.intensity,
        durationMs: action.durationMs,
      };
      let profile = state.profile;
      if (action.outcome === "relapse" && profile) {
        profile = { ...profile, streakStart: now };
      }
      return {
        ...state,
        profile,
        cravings: [log, ...state.cravings],
        flags: { ...state.flags, hasLoggedFirstCraving: true },
      };
    }
    case "DELETE_CRAVING":
      return { ...state, cravings: state.cravings.filter((c) => c.id !== action.id) };
    case "TOGGLE_MISSION_TASK": {
      const key = dayKey();
      const existing: MissionLog =
        state.missionLogs[key] ?? {
          dayKey: key,
          missionDay: action.missionDay,
          taskStates: {},
        };
      const next: MissionLog = {
        ...existing,
        missionDay: action.missionDay,
        taskStates: { ...existing.taskStates, [action.taskId]: action.value },
      };
      return { ...state, missionLogs: { ...state.missionLogs, [key]: next } };
    }
    case "COMPLETE_MISSION": {
      const key = dayKey();
      const existing: MissionLog =
        state.missionLogs[key] ?? {
          dayKey: key,
          missionDay: action.missionDay,
          taskStates: {},
        };
      return {
        ...state,
        missionLogs: {
          ...state.missionLogs,
          [key]: { ...existing, completedAt: Date.now() },
        },
      };
    }
    case "SET_PREMIUM":
      return { ...state, isPremium: action.value };
    case "SET_ACCOUNT":
      return { ...state, account: action.account };
    case "SET_FLAG":
      return { ...state, flags: { ...state.flags, [action.key]: action.value } };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

type AppContextValue = {
  state: AppState;
  completeOnboarding: (profile: UserProfile) => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
  logCraving: (input: {
    outcome: CravingOutcome;
    intensity?: 1 | 2 | 3;
    durationMs?: number;
  }) => void;
  deleteCraving: (id: string) => void;
  toggleMissionTask: (missionDay: number, taskId: string, value: boolean) => void;
  completeMission: (missionDay: number) => void;
  setPremium: (value: boolean) => void;
  setAccount: (account: UserAccount | null) => void;
  setFlag: (key: keyof AppFlags, value: boolean) => void;
  reset: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const completeOnboarding = useCallback(
    (profile: UserProfile) => dispatch({ type: "COMPLETE_ONBOARDING", profile }),
    [],
  );
  const updateProfile = useCallback(
    (patch: Partial<UserProfile>) => dispatch({ type: "UPDATE_PROFILE", patch }),
    [],
  );
  const logCraving = useCallback(
    (input: { outcome: CravingOutcome; intensity?: 1 | 2 | 3; durationMs?: number }) =>
      dispatch({ type: "LOG_CRAVING", ...input }),
    [],
  );
  const deleteCraving = useCallback(
    (id: string) => dispatch({ type: "DELETE_CRAVING", id }),
    [],
  );
  const toggleMissionTask = useCallback(
    (missionDay: number, taskId: string, value: boolean) =>
      dispatch({ type: "TOGGLE_MISSION_TASK", missionDay, taskId, value }),
    [],
  );
  const completeMission = useCallback(
    (missionDay: number) => dispatch({ type: "COMPLETE_MISSION", missionDay }),
    [],
  );
  const setPremium = useCallback((value: boolean) => dispatch({ type: "SET_PREMIUM", value }), []);
  const setAccount = useCallback(
    (account: UserAccount | null) => dispatch({ type: "SET_ACCOUNT", account }),
    [],
  );
  const setFlag = useCallback(
    (key: keyof AppFlags, value: boolean) => dispatch({ type: "SET_FLAG", key, value }),
    [],
  );
  const reset = useCallback(() => dispatch({ type: "RESET" }), []);

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      completeOnboarding,
      updateProfile,
      logCraving,
      deleteCraving,
      toggleMissionTask,
      completeMission,
      setPremium,
      setAccount,
      setFlag,
      reset,
    }),
    [
      state,
      completeOnboarding,
      updateProfile,
      logCraving,
      deleteCraving,
      toggleMissionTask,
      completeMission,
      setPremium,
      setAccount,
      setFlag,
      reset,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within an AppProvider");
  return ctx;
}
