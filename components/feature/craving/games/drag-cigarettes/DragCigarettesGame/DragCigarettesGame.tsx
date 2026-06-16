import { router } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import { View } from "react-native";
import * as Haptics from "expo-haptics";

import { ColorSwitchHud } from "@/components/feature/craving/games/drag-cigarettes/ColorSwitchHud";
import { ColorSwitchPlayField } from "@/components/feature/craving/games/drag-cigarettes/ColorSwitchPlayField";
import { DragIdleView } from "@/components/feature/craving/games/drag-cigarettes/DragIdleView";
import { DragResultView } from "@/components/feature/craving/games/drag-cigarettes/DragResultView";
import { GameDoneBar } from "@/components/feature/craving/games/GameDoneBar";
import { useColorSwitchGame } from "@/hooks/craving/games/useColorSwitchGame";

export function DragCigarettesGame() {
  const game = useColorSwitchGame();
  const handleDone = useCallback(() => router.back(), []);
  const lastStatus = useRef(game.status);

  useEffect(() => {
    if (lastStatus.current === "playing" && game.status === "dead") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(
        () => {},
      );
    }
    lastStatus.current = game.status;
  }, [game.status]);

  if (game.status === "idle") {
    return <DragIdleView onStart={game.start} />;
  }

  if (game.status === "dead" || game.status === "finished") {
    return (
      <DragResultView
        score={game.score}
        deathReason={game.deathReason}
        onPlayAgain={game.start}
        onDone={handleDone}
      />
    );
  }

  return (
    <View className="flex-1">
      <ColorSwitchHud score={game.score} ballColor={game.ballColor} />
      <ColorSwitchPlayField
        ballWorldY={game.ballWorldY}
        cameraWorldY={game.cameraWorldY}
        ballColor={game.ballColor}
        obstacles={game.obstacles}
        orbs={game.orbs}
        onLayoutField={game.setFieldSize}
        onTap={game.jump}
      />
      <GameDoneBar onPress={game.finish} />
    </View>
  );
}
