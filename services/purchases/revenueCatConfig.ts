let configured = false;
let configurePromise: Promise<void> | null = null;

export function isRevenueCatConfigured(): boolean {
  return configured;
}

export function markRevenueCatConfigured(): void {
  configured = true;
}

export function getRevenueCatConfigurePromise(): Promise<void> | null {
  return configurePromise;
}

export function setRevenueCatConfigurePromise(promise: Promise<void>): void {
  configurePromise = promise;
}
