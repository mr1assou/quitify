import { CravingToolScreen } from "@/components/feature/craving/CravingToolScreen";
import { GamesHub } from "@/components/feature/craving/games/GamesHub";

/** All games in the app — pick one to open its detail screen. */
export function GamesScreen() {
  return (
    <CravingToolScreen toolId="games">
      <GamesHub />
    </CravingToolScreen>
  );
}
