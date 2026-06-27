import type { NetInfoState } from "@react-native-community/netinfo";

/** True when the device has an active network with internet access. */
export function isInternetConnected(state: NetInfoState): boolean {
  if (state.isConnected !== true) {
    return false;
  }

  // NetInfo may return null while reachability is still being checked.
  if (state.isInternetReachable === false) {
    return false;
  }

  return true;
}
