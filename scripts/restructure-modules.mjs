import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const moves = {
  constants: {
    "constants/achievementSections.ts": "constants/progress/achievementSections.ts",
    "constants/assets.ts": "constants/app/assets.ts",
    "constants/badgeImages.ts": "constants/progress/badgeImages.ts",
    "constants/badges.ts": "constants/progress/badges.ts",
    "constants/breathing.ts": "constants/craving/breathing.ts",
    "constants/calmFocusPuzzle.ts": "constants/craving/games/calmFocusPuzzle.ts",
    "constants/chatMessages.ts": "constants/chat/chatMessages.ts",
    "constants/chatThreads.ts": "constants/chat/chatThreads.ts",
    "constants/communityFeedFilter.ts": "constants/community/communityFeedFilter.ts",
    "constants/communityPosts.ts": "constants/community/communityPosts.ts",
    "constants/communityUsers.ts": "constants/community/communityUsers.ts",
    "constants/cravingGameAssets.ts": "constants/craving/games/cravingGameAssets.ts",
    "constants/cravingGames.ts": "constants/craving/games/cravingGames.ts",
    "constants/cravingMotivation.ts": "constants/craving/cravingMotivation.ts",
    "constants/cravingSession.ts": "constants/craving/cravingSession.ts",
    "constants/cravingTips.ts": "constants/craving/cravingTips.ts",
    "constants/cravingTools.ts": "constants/craving/cravingTools.ts",
    "constants/dailyFocus.ts": "constants/progress/dailyFocus.ts",
    "constants/dragCigarettes.ts": "constants/craving/games/dragCigarettes.ts",
    "constants/fallbackCountries.ts": "constants/app/fallbackCountries.ts",
    "constants/health.ts": "constants/progress/health.ts",
    "constants/holdToControl.ts": "constants/craving/games/holdToControl.ts",
    "constants/intro.ts": "constants/app/intro.ts",
    "constants/journeyMilestones.ts": "constants/progress/journeyMilestones.ts",
    "constants/leaderboardCountries.ts": "constants/leaderboard/leaderboardCountries.ts",
    "constants/leaderboardNames.ts": "constants/leaderboard/leaderboardNames.ts",
    "constants/leaderboardPagination.ts": "constants/leaderboard/leaderboardPagination.ts",
    "constants/leaderboardPlaceholders.ts": "constants/leaderboard/leaderboardPlaceholders.ts",
    "constants/leaderboardProfiles.ts": "constants/leaderboard/leaderboardProfiles.ts",
    "constants/levels.ts": "constants/progress/levels.ts",
    "constants/memoryMatch.ts": "constants/craving/games/memoryMatch.ts",
    "constants/missions.ts": "constants/progress/missions.ts",
    "constants/motivationQuotes.ts": "constants/craving/motivationQuotes.ts",
    "constants/onboardingCountryRow.ts": "constants/onboarding/onboardingCountryRow.ts",
    "constants/onboardingFlow.ts": "constants/onboarding/onboardingFlow.ts",
    "constants/onboardingMotivation.ts": "constants/onboarding/onboardingMotivation.ts",
    "constants/onboardingNicotineBands.ts": "constants/onboarding/onboardingNicotineBands.ts",
    "constants/onboardingNicotineForm.ts": "constants/onboarding/onboardingNicotineForm.ts",
    "constants/onboardingPrimaryInterest.ts": "constants/onboarding/onboardingPrimaryInterest.ts",
    "constants/onboardingPriorQuitAttempts.ts": "constants/onboarding/onboardingPriorQuitAttempts.ts",
    "constants/onboardingQuitPlan.ts": "constants/onboarding/onboardingQuitPlan.ts",
    "constants/onboardingReasons.ts": "constants/onboarding/onboardingReasons.ts",
    "constants/onboardingSex.ts": "constants/onboarding/onboardingSex.ts",
    "constants/postCommentsPagination.ts": "constants/community/postCommentsPagination.ts",
    "constants/postImages.ts": "constants/community/postImages.ts",
    "constants/postTags.ts": "constants/community/postTags.ts",
    "constants/profileActivityTabs.ts": "constants/community/profileActivityTabs.ts",
    "constants/profileImage.ts": "constants/profile/profileImage.ts",
    "constants/ranks.ts": "constants/progress/ranks.ts",
    "constants/recoveryRings.ts": "constants/progress/recoveryRings.ts",
    "constants/reflexTap.ts": "constants/craving/games/reflexTap.ts",
    "constants/routes.ts": "constants/app/routes.ts",
    "constants/slipCigaretteCounts.ts": "constants/stats/slipCigaretteCounts.ts",
    "constants/slipOutcomeCopy.ts": "constants/stats/slipOutcomeCopy.ts",
    "constants/statsListPagination.ts": "constants/stats/statsListPagination.ts",
    "constants/statsRanges.ts": "constants/stats/statsRanges.ts",
    "constants/theme.ts": "constants/app/theme.ts",
  },
  hooks: {
    "hooks/useAppHydration.ts": "hooks/auth/useAppHydration.ts",
    "hooks/useBreathingCycle.ts": "hooks/craving/breathing/useBreathingCycle.ts",
    "hooks/useBreathingSession.ts": "hooks/craving/breathing/useBreathingSession.ts",
    "hooks/useBreathingSessionTimer.ts": "hooks/craving/breathing/useBreathingSessionTimer.ts",
    "hooks/useCalmFocusPuzzleGame.ts": "hooks/craving/games/useCalmFocusPuzzleGame.ts",
    "hooks/useChat.ts": "hooks/chat/useChat.ts",
    "hooks/useChatParticipantPresence.ts": "hooks/chat/useChatParticipantPresence.ts",
    "hooks/useChatSocket.ts": "hooks/chat/useChatSocket.ts",
    "hooks/useChatThreadRealtime.ts": "hooks/chat/useChatThreadRealtime.ts",
    "hooks/useCommunityFeed.ts": "hooks/community/useCommunityFeed.ts",
    "hooks/useCommunityPlayerProfile.ts": "hooks/community/useCommunityPlayerProfile.ts",
    "hooks/useCommunityPost.ts": "hooks/community/useCommunityPost.ts",
    "hooks/useCountries.ts": "hooks/onboarding/useCountries.ts",
    "hooks/useCountrySelection.ts": "hooks/onboarding/useCountrySelection.ts",
    "hooks/useCravingCountdown.ts": "hooks/craving/useCravingCountdown.ts",
    "hooks/useCravingMotivationMessage.ts": "hooks/craving/useCravingMotivationMessage.ts",
    "hooks/useCravingResultFlow.ts": "hooks/craving/useCravingResultFlow.ts",
    "hooks/useCravingTipCycle.ts": "hooks/craving/useCravingTipCycle.ts",
    "hooks/useDailyFocus.ts": "hooks/progress/useDailyFocus.ts",
    "hooks/useDragCigarettesGame.ts": "hooks/craving/games/useDragCigarettesGame.ts",
    "hooks/useElapsedTimer.ts": "hooks/shared/useElapsedTimer.ts",
    "hooks/useGates.ts": "hooks/app/useGates.ts",
    "hooks/useGoogleSignIn.ts": "hooks/auth/useGoogleSignIn.ts",
    "hooks/useHoldToControlGame.ts": "hooks/craving/games/useHoldToControlGame.ts",
    "hooks/useLeaderboard.ts": "hooks/leaderboard/useLeaderboard.ts",
    "hooks/useLeaderboardPlayer.ts": "hooks/leaderboard/useLeaderboardPlayer.ts",
    "hooks/useLogout.ts": "hooks/auth/useLogout.ts",
    "hooks/useMemoryMatchGame.ts": "hooks/craving/games/useMemoryMatchGame.ts",
    "hooks/useMotivationCardsSession.ts": "hooks/craving/useMotivationCardsSession.ts",
    "hooks/useNow.ts": "hooks/shared/useNow.ts",
    "hooks/useOutcomeBackHandler.ts": "hooks/app/useOutcomeBackHandler.ts",
    "hooks/usePaginatedList.ts": "hooks/shared/usePaginatedList.ts",
    "hooks/usePlayerProfileStreak.ts": "hooks/profile/usePlayerProfileStreak.ts",
    "hooks/usePresenceSocket.ts": "hooks/community/usePresenceSocket.ts",
    "hooks/useProfileActivity.ts": "hooks/community/useProfileActivity.ts",
    "hooks/useProgress.ts": "hooks/progress/useProgress.ts",
    "hooks/useQuitPlanHandlers.ts": "hooks/onboarding/useQuitPlanHandlers.ts",
    "hooks/useRecoveryProgress.ts": "hooks/progress/useRecoveryProgress.ts",
    "hooks/useReflexTapGame.ts": "hooks/craving/games/useReflexTapGame.ts",
    "hooks/useRefreshAccount.ts": "hooks/auth/useRefreshAccount.ts",
    "hooks/useSelfPlayerProfile.ts": "hooks/community/useSelfPlayerProfile.ts",
    "hooks/useSlipSubmit.ts": "hooks/stats/useSlipSubmit.ts",
    "hooks/useStats.ts": "hooks/stats/useStats.ts",
    "hooks/useStatsAttempts.ts": "hooks/stats/useStatsAttempts.ts",
    "hooks/useStatsDashboard.ts": "hooks/stats/useStatsDashboard.ts",
    "hooks/useStatsOverview.ts": "hooks/stats/useStatsOverview.ts",
    "hooks/useTapDestroyGame.ts": "hooks/craving/games/useTapDestroyGame.ts",
    "hooks/useTodayMission.ts": "hooks/progress/useTodayMission.ts",
    "hooks/useUserSearch.ts": "hooks/community/useUserSearch.ts",
    "hooks/useUserTimezone.ts": "hooks/shared/useUserTimezone.ts",
  },
  utils: {
    "utils/achievementProgress.ts": "utils/progress/achievementProgress.ts",
    "utils/authStorage.ts": "utils/auth/authStorage.ts",
    "utils/badges.ts": "utils/progress/badges.ts",
    "utils/birthdate.ts": "utils/profile/birthdate.ts",
    "utils/calculations.ts": "utils/progress/calculations.ts",
    "utils/community.ts": "utils/community/community.ts",
    "utils/countries.ts": "utils/shared/countries.ts",
    "utils/createProfileOnboarding.ts": "utils/onboarding/createProfileOnboarding.ts",
    "utils/dailyFocus.ts": "utils/progress/dailyFocus.ts",
    "utils/dates.ts": "utils/shared/dates.ts",
    "utils/format.ts": "utils/shared/format.ts",
    "utils/formatDuration.ts": "utils/shared/formatDuration.ts",
    "utils/leaderboard.ts": "utils/leaderboard/leaderboard.ts",
    "utils/nicotineBands.ts": "utils/onboarding/nicotineBands.ts",
    "utils/nicotineFormParsing.ts": "utils/onboarding/nicotineFormParsing.ts",
    "utils/nicotineOnboarding.ts": "utils/onboarding/nicotineOnboarding.ts",
    "utils/profileConsumptionLabel.ts": "utils/profile/profileConsumptionLabel.ts",
    "utils/progress.ts": "utils/progress/progress.ts",
    "utils/quitPlan.ts": "utils/onboarding/quitPlan.ts",
    "utils/recoveryProgress.ts": "utils/progress/recoveryProgress.ts",
    "utils/safeRouter.ts": "utils/app/safeRouter.ts",
    "utils/sessionStorage.ts": "utils/auth/sessionStorage.ts",
    "utils/statsSeries.ts": "utils/stats/statsSeries.ts",
  },
};

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "dist") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(ts|tsx|mjs|js)$/.test(entry.name)) files.push(full);
  }
  return files;
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function moveFile(fromRel, toRel) {
  const from = path.join(root, fromRel);
  const to = path.join(root, toRel);
  if (!fs.existsSync(from)) {
    if (fs.existsSync(to)) return;
    throw new Error(`Missing source file: ${fromRel}`);
  }
  ensureDir(to);
  fs.renameSync(from, to);
}

function buildReplacements() {
  const replacements = [];
  for (const group of Object.values(moves)) {
    for (const [from, to] of Object.entries(group)) {
      const fromNoExt = from.replace(/\.ts$/, "");
      const toNoExt = to.replace(/\.ts$/, "");
      replacements.push([`@/${fromNoExt}`, `@/${toNoExt}`]);
      replacements.push([fromNoExt, toNoExt]);
    }
  }
  replacements.sort((a, b) => b[0].length - a[0].length);
  return replacements;
}

function updateImports(content, replacements) {
  let next = content;
  for (const [from, to] of replacements) {
    next = next.split(from).join(to);
  }
  return next;
}

function createDomainBarrels(baseDir) {
  if (!fs.existsSync(baseDir)) return;
  for (const entry of fs.readdirSync(baseDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const domainDir = path.join(baseDir, entry.name);
    const lines = [];
    for (const sub of fs.readdirSync(domainDir, { withFileTypes: true })) {
      if (sub.isDirectory()) {
        const subIndex = path.join(domainDir, sub.name, "index.ts");
        if (!fs.existsSync(subIndex)) {
          const files = fs
            .readdirSync(path.join(domainDir, sub.name))
            .filter((f) => f.endsWith(".ts") && f !== "index.ts");
          if (files.length === 1) {
            const exportName = files[0].replace(/\.ts$/, "");
            fs.writeFileSync(
              subIndex,
              `export * from "./${exportName}";\n`,
            );
          } else if (files.length > 1) {
            const subLines = files
              .map((f) => `export * from "./${f.replace(/\.ts$/, "")}";`)
              .join("\n");
            fs.writeFileSync(subIndex, `${subLines}\n`);
          }
        }
        lines.push(`export * from "./${sub.name}";`);
        continue;
      }
      if (sub.name.endsWith(".ts") && sub.name !== "index.ts") {
        lines.push(`export * from "./${sub.name.replace(/\.ts$/, "")}";`);
      }
    }
    if (lines.length > 0) {
      fs.writeFileSync(path.join(domainDir, "index.ts"), `${lines.sort().join("\n")}\n`);
    }
  }
}

// 1. Move files
for (const group of Object.values(moves)) {
  for (const [from, to] of Object.entries(group)) {
    moveFile(from, to);
  }
}

// 2. Update imports project-wide
const replacements = buildReplacements();
const files = walk(root).filter((f) => !f.includes(`${path.sep}scripts${path.sep}`));
for (const file of files) {
  const content = fs.readFileSync(file, "utf8");
  const updated = updateImports(content, replacements);
  if (updated !== content) fs.writeFileSync(file, updated);
}

// 3. Domain barrel index files
createDomainBarrels(path.join(root, "constants"));
createDomainBarrels(path.join(root, "hooks"));
createDomainBarrels(path.join(root, "utils"));

console.log("Restructure complete.");
