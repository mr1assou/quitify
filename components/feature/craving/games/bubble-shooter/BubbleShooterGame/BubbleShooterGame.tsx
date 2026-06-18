import { router } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import { View } from "react-native";
import * as Haptics from "expo-haptics";

import { GameDoneBar } from "@/components/feature/craving/games/GameDoneBar";
import { BubbleShooterHud } from "@/components/feature/craving/games/bubble-shooter/BubbleShooterHud";
import { BubbleShooterIdleView } from "@/components/feature/craving/games/bubble-shooter/BubbleShooterIdleView";
import { BubbleShooterPlayField } from "@/components/feature/craving/games/bubble-shooter/BubbleShooterPlayField";
import { BubbleShooterResultView } from "@/components/feature/craving/games/bubble-shooter/BubbleShooterResultView";
import { useBubbleShooterGame } from "@/hooks/craving/games/useBubbleShooterGame";

export function BubbleShooterGame() {
  const game = useBubbleShooterGame();
  const handleDone = useCallback(() => router.back(), []);
  const lastStatus = useRef(game.status);

  useEffect(() => {
    if (lastStatus.current === "playing" && game.status === "lost") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(
        () => {},
      );
    }
    if (lastStatus.current === "playing" && game.status === "won") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
        () => {},
      );
    }
    lastStatus.current = game.status;
  }, [game.status]);

  if (game.status === "idle") {
    return <BubbleShooterIdleView onStart={game.start} />;
  }

  if (
    game.status === "won" ||
    game.status === "lost" ||
    game.status === "finished"
  ) {
    return (
      <BubbleShooterResultView
        status={game.status}
        poppedTotal={game.poppedTotal}
        totalBubbles={game.totalBubbles}
        shotsLanded={game.shotsLanded}
        onPlayAgain={game.start}
        onDone={handleDone}
      />
    );
  }

  return (
    <View className="flex-1">
      <BubbleShooterHud
        poppedTotal={game.poppedTotal}
        bubblesInPool={game.bubblesInPool}
        clearProgress={game.clearProgress}
        shotsLanded={game.shotsLanded}
      />
      <BubbleShooterPlayField
        grid={game.grid}
        projectile={game.projectile}
        currentColor={game.currentColor}
        nextColor={game.nextColor}
        aimAngle={game.aimAngle}
        radius={game.radius}
        originX={game.origin.x}
        originY={game.origin.y}
        shooterX={game.shooter.x}
        shooterY={game.shooter.y}
        fieldWidth={game.fieldWidth}
        canShoot={game.canShoot}
        onLayoutField={game.setFieldSize}
        onAimAt={game.aimAt}
        onShoot={game.shoot}
      />
      <GameDoneBar onPress={game.finish} />
    </View>
  );
}
