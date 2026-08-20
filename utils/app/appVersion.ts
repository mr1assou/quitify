import Constants from "expo-constants";

/** Version of the installed build (app.json `version` baked in at build time). */
export function getCurrentAppVersion(): string {
  return Constants.expoConfig?.version ?? "0.0.0";
}

/** True when `current` is strictly older than `minimum` ("1.2.3" style). */
export function isVersionOlder(current: string, minimum: string): boolean {
  const currentParts = parseVersion(current);
  const minimumParts = parseVersion(minimum);
  const length = Math.max(currentParts.length, minimumParts.length);

  for (let i = 0; i < length; i += 1) {
    const left = currentParts[i] ?? 0;
    const right = minimumParts[i] ?? 0;
    if (left !== right) return left < right;
  }
  return false;
}

function parseVersion(version: string): number[] {
  return version.split(".").map((part) => Number.parseInt(part, 10) || 0);
}
