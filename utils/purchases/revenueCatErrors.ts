import { PURCHASES_ERROR_CODE } from "react-native-purchases";

type PurchasesErrorLike = {
  userCancelled?: boolean;
  code?: string;
  message?: string;
};

export function isPurchaseCancelledError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;

  const purchasesError = error as PurchasesErrorLike;
  return (
    purchasesError.userCancelled === true ||
    purchasesError.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR
  );
}

export function purchaseErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as PurchasesErrorLike).message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  return fallback;
}
