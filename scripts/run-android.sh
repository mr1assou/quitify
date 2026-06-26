#!/usr/bin/env bash
set -e

PROJECT="$(cd "$(dirname "$0")/.." && pwd -W 2>/dev/null || pwd)"
# Normalize to Windows backslashes for subst
PROJECT_WIN="${PROJECT//\//\\}"

export GRADLE_USER_HOME=/c/gradle
export TEMP=/c/tmp
export TMP=/c/tmp
mkdir -p /c/gradle /c/tmp

# Junction C:\q still resolves to the long real path — use subst Q: instead.
cmd //c "subst Q: /d" 2>/dev/null || true
cmd //c "subst Q: ${PROJECT_WIN}"

cleanup() { cmd //c "subst Q: /d" 2>/dev/null || true; }
trap cleanup EXIT

cd /q

# Stop Gradle daemon (may cache old long paths)
if [[ -f android/gradlew.bat ]]; then
  (cd android && cmd //c gradlew.bat --stop) 2>/dev/null || true
fi

rm -rf android/app/.cxx android/app/build 2>/dev/null || true

echo "Building from Q:\\ (short path) ..."
exec npx expo run:android "$@"
