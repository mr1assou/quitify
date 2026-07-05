import { ErrorCode, type PurchaseError } from "expo-iap";

export function isPurchaseError(error: unknown): error is PurchaseError {
  return error instanceof Error && "code" in error;
}

export function isPurchaseCancelledError(error: unknown): boolean {
  return isPurchaseError(error) && error.code === ErrorCode.UserCancelled;
}

export function purchaseErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }
  return fallback;
}
