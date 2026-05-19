import { useCallback } from "react";

import { CravingToolScreen } from "@/components/feature/craving/CravingToolScreen";
import { MotivationVideosIdleView } from "@/components/feature/craving/motivation-videos/MotivationVideosIdleView";
import { MotivationVideosSession } from "@/components/feature/craving/motivation-videos/MotivationVideosSession";
import type { MotivationVideo } from "@/constants/motivationVideos";
import { useMotivationVideosSession } from "@/hooks/useMotivationVideosSession";

export function MotivationVideosScreen() {
  const { isStarted, startSession, finishSession, elapsedMs, videos } =
    useMotivationVideosSession();

  const handleVideoPress = useCallback((_video: MotivationVideo) => {
    // Player will be wired in a follow-up task.
  }, []);

  return (
    <CravingToolScreen toolId="motivation-videos">
      {!isStarted ? (
        <MotivationVideosIdleView onStartSession={startSession} />
      ) : (
        <MotivationVideosSession
          elapsedMs={elapsedMs}
          videos={videos}
          onVideoPress={handleVideoPress}
          onFinish={finishSession}
        />
      )}
    </CravingToolScreen>
  );
}
