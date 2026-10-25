const { withAppBuildGradle } = require("@expo/config-plugins");

const LEGACY_PROGUARD_FILE =
  'getDefaultProguardFile("proguard-android.txt")';
const OPTIMIZED_PROGUARD_FILE =
  'getDefaultProguardFile("proguard-android-optimize.txt")';

/** Keep Expo prebuilds on Android's optimizing R8 rules instead of the legacy no-optimize rules. */
module.exports = function withOptimizedR8Proguard(config) {
  return withAppBuildGradle(config, (config) => {
    const contents = config.modResults.contents;

    if (contents.includes(OPTIMIZED_PROGUARD_FILE)) {
      return config;
    }

    if (!contents.includes(LEGACY_PROGUARD_FILE)) {
      throw new Error(
        "Could not find the default Android ProGuard file to enable R8 optimization.",
      );
    }

    config.modResults.contents = contents.replace(
      LEGACY_PROGUARD_FILE,
      OPTIMIZED_PROGUARD_FILE,
    );

    return config;
  });
};
