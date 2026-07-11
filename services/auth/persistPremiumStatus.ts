import { updatePremiumOnServer } from "@/services/auth/premiumApi";
import type { UserAccount } from "@/types/app/account";

export async function persistPremiumStatus(
  isPremium: boolean,
  setAccount: (account: UserAccount) => void,
  account: UserAccount | null | undefined,
): Promise<boolean> {
  const me = await updatePremiumOnServer(isPremium);
  const resolved = Boolean(me.isPremium);

  if (account) {
    setAccount({ ...account, isPremium: resolved });
  }

  return resolved;
}
