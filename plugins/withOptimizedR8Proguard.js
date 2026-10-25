const {
  withAppBuildGradle,
  withGradleProperties,
} = require("@expo/config-plugins");

const LEGACY_PROGUARD_FILE =
  'getDefaultProguardFile("proguard-android.txt")';
const OPTIMIZED_PROGUARD_FILE =
  'getDefaultProguardFile("proguard-android-optimize.txt")';
const R8_GRADLE_JVM_ARGS =
  "-Xmx4096m -XX:MaxMetaspaceSize=1024m -Dfile.encoding=UTF-8";

/** Configure managed Android builds for optimized R8 with enough Gradle heap. */
module.exports = function withOptimizedR8Proguard(config) {
  config = withAppBuildGradle(config, (config) => {
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

  return withGradleProperties(config, (config) => {
    const jvmArgs = config.modResults.find(
      (property) =>
        property.type === "property" && property.key === "org.gradle.jvmargs",
    );

    if (jvmArgs) {
      jvmArgs.value = R8_GRADLE_JVM_ARGS;
    } else {
      config.modResults.push({
        type: "property",
        key: "org.gradle.jvmargs",
        value: R8_GRADLE_JVM_ARGS,
      });
    }

    return config;
  });
};
