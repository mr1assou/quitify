import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";

import { useAppHydration } from "@/hooks/auth/useAppHydration";
import type { UserSessionFromApi } from "@/services/auth/loadUserSessionFromApi";
import type {
  AppFlags,
  AppState,
  CravingLog,
  CravingOutcome,
  MissionLog,
  UserAccount,
  UserProfile,
} from "@/types";
import { clearStoredAuth } from "@/utils/auth/clearStoredAuth";
import { dayKey } from "@/utils/shared/dates";
import { syncRevenueCatUser } from "@/services/purchases/revenueCat";
type Action =
  | {
      type: "RESTORE_SESSION";
      isOnboarded: boolean;
      profile: UserProfile | null;
      account: UserAccount | null;
    }
  | { type: "COMPLETE_ONBOARDING"; profile: UserProfile }
  | { type: "UPDATE_PROFILE"; patch: Partial<UserProfile> }
  | {
      type: "LOG_CRAVING";
      outcome: CravingOutcome;
      cigarettesCount?: number;
      intensity?: 1 | 2 | 3;
      durationMs?: number;
      serverId?: number;
    }
  | { type: "DELETE_CRAVING"; id: string }
  | { type: "TOGGLE_MISSION_TASK"; missionDay: number; taskId: string; value: boolean }
  | { type: "COMPLETE_MISSION"; missionDay: number }
  | { type: "SET_ACCOUNT"; account: UserAccount | null }
  | { type: "ADD_LOCAL_FREEDOM_POINTS"; amount: number }
  | { type: "SET_FLAG"; key: keyof AppFlags; value: boolean }
  | {
      type: "RESET_JOURNEY";
      profile: UserProfile;
      account: UserAccount;
    }
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
  account: null,
  localFreedomPoints: 0,
  flags: initialFlags,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "RESTORE_SESSION":
      return {
        ...state,
        isOnboarded: action.isOnboarded,
        profile: action.profile,
        account: action.account,
      };
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
        cigarettesCount: action.cigarettesCount,
        intensity: action.intensity,
        durationMs: action.durationMs,
        serverId: action.serverId,
      };
      return {
        ...state,
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
    case "SET_ACCOUNT":
      return { ...state, account: action.account };
    case "SET_FLAG":
      return { ...state, flags: { ...state.flags, [action.key]: action.value } };
    case "RESET_JOURNEY":
      return {
        ...state,
        isOnboarded: true,
        profile: action.profile,
        account: action.account,
        cravings: [],
        missionLogs: {},
        localFreedomPoints: 0,
        flags: initialFlags,
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

type AppContextValue = {
  state: AppState;
  isHydrated: boolean;
  completeOnboarding: (profile: UserProfile) => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
  logCraving: (input: {
    outcome: CravingOutcome;
    cigarettesCount?: number;
    intensity?: 1 | 2 | 3;
    durationMs?: number;
    serverId?: number;
  }) => void;
  deleteCraving: (id: string) => void;
  toggleMissionTask: (missionDay: number, taskId: string, value: boolean) => void;
  completeMission: (missionDay: number) => void;
  setAccount: (account: UserAccount | null) => void;
  addLocalFreedomPoints: (amount: number) => void;
  logout: () => Promise<void>;
  applyJourneyReset: (session: UserSessionFromApi) => void;
  setFlag: (key: keyof AppFlags, value: boolean) => void;
  reset: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const onRestore = useCallback(
    (payload: {
      isOnboarded: boolean;
      profile: UserProfile | null;
      account: UserAccount | null;
    }) => {
      dispatch({ type: "RESTORE_SESSION", ...payload });
    },
    [],
  );

  const isHydrated = useAppHydration(onRestore);

  const completeOnboarding = useCallback((profile: UserProfile) => {
    dispatch({ type: "COMPLETE_ONBOARDING", profile });
  }, []);

  const updateProfile = useCallback(
    (patch: Partial<UserProfile>) => dispatch({ type: "UPDATE_PROFILE", patch }),
    [],
  );
  const logCraving = useCallback(
    (input: {
      outcome: CravingOutcome;
      cigarettesCount?: number;
      intensity?: 1 | 2 | 3;
      durationMs?: number;
      serverId?: number;
    }) => dispatch({ type: "LOG_CRAVING", ...input }),
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
  const setAccount = useCallback(
    (account: UserAccount | null) => dispatch({ type: "SET_ACCOUNT", account }),
    [],
  );
  const addLocalFreedomPoints = useCallback(
    (amount: number) => dispatch({ type: "ADD_LOCAL_FREEDOM_POINTS", amount }),
    [],
  );

  const logout = useCallback(async () => {
    await syncRevenueCatUser(undefined);
    await clearStoredAuth();
    dispatch({ type: "RESET" });
  }, []);

  const applyJourneyReset = useCallback((session: UserSessionFromApi) => {
    if (!session.profile || !session.account) return;
    dispatch({
      type: "RESET_JOURNEY",
      profile: session.profile,
      account: session.account,
    });
  }, []);

  const setFlag = useCallback(
    (key: keyof AppFlags, value: boolean) => dispatch({ type: "SET_FLAG", key, value }),
    [],
  );
  const reset = useCallback(() => dispatch({ type: "RESET" }), []);

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      isHydrated,
      completeOnboarding,
      updateProfile,
      logCraving,
      deleteCraving,
      toggleMissionTask,
      completeMission,
      setAccount,
      addLocalFreedomPoints,
      logout,
      applyJourneyReset,
      setFlag,
      reset,
    }),
    [
      state,
      isHydrated,
      completeOnboarding,
      updateProfile,
      logCraving,
      deleteCraving,
      toggleMissionTask,
      completeMission,
      setAccount,
      addLocalFreedomPoints,
      logout,
      applyJourneyReset,
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
