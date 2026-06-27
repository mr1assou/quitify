export type FreedomPointLedgerRow = {
  id: number;
  amount: number;
  sourceType: string;
  sourceKey: string;
  earnedAt: string;
};

export type StatsFreedomPointsResponse = {
  totalFreedomPoints: number;
  entries: FreedomPointLedgerRow[];
};
