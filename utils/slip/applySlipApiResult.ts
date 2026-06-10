import type { SlipEventResponse, SlipUndoResponse } from "@/types/slip";
import type { UserProfile } from "@/types";

export function profilePatchFromSlipCreate(
  result: SlipEventResponse,
): Partial<UserProfile> {
  const now = Date.parse(result.streakStart);
  return {
    streakStart: now,
    quitDate: Date.parse(result.quitDate),
    currentAttemptNumber: result.currentAttemptNumber,
    slipCigarettesTotal: 0,
  };
}

export function profilePatchFromSlipUndo(
  result: SlipUndoResponse,
): Partial<UserProfile> {
  const patch: Partial<UserProfile> = { slipCigarettesTotal: 0 };

  if (result.streakStart) patch.streakStart = Date.parse(result.streakStart);
  if (result.quitDate) patch.quitDate = Date.parse(result.quitDate);
  if (result.currentAttemptNumber != null) {
    patch.currentAttemptNumber = result.currentAttemptNumber;
  }

  return patch;
}
