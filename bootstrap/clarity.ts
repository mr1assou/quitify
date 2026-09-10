import * as Clarity from "@microsoft/react-native-clarity";

import { CLARITY_PROJECT_ID } from "@/constants/analytics/clarity";

/** Start Clarity session recording once at app bootstrap. */
Clarity.initialize(CLARITY_PROJECT_ID, {
  logLevel: __DEV__ ? Clarity.LogLevel.Verbose : Clarity.LogLevel.None,
});
