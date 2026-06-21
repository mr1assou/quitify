import { safeRouter } from "@/utils/app/safeRouter";
import { FlatList, Text, useWindowDimensions, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { CravingToolScreen } from "@/components/feature/craving/CravingToolScreen";
import { RelaxSoundCard } from "@/components/feature/craving/relax-sound/RelaxSoundCard";
import { ThemedLoadingScreen } from "@/components/ui/ThemedLoadingScreen";
import { useRelaxSoundsCatalogContext } from "@/context/RelaxSoundsCatalogContext";
import { useRelaxSoundPlayerContext } from "@/context/RelaxSoundPlayerContext";

const COLUMN_GAP = 12;
const ROW_GAP = 12;
const HORIZONTAL_PADDING = 48;

export function RelaxSoundScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = (width - HORIZONTAL_PADDING - COLUMN_GAP) / 2;
  const { activeId, loadingId, isPlaying, progress } = useRelaxSoundPlayerContext();
  const { sounds, isLoading, error } = useRelaxSoundsCatalogContext();

  return (
    <CravingToolScreen toolId="relax-sound">
      <View className="flex-1 px-6 pb-6 pt-2">
        <Animated.View entering={FadeInDown.duration(400)} className="mb-4">
          <Text className="text-center text-sm text-muted-foreground dark:text-d-muted">
            Tap a cover to open the player and adjust progress.
          </Text>
        </Animated.View>

        {isLoading ? (
          <ThemedLoadingScreen message="Loading sounds…" />
        ) : error ? (
          <View className="flex-1 items-center justify-center px-4">
            <Text className="text-center text-sm text-muted-foreground dark:text-d-muted">
              {error}
            </Text>
          </View>
        ) : sounds.length === 0 ? (
          <View className="flex-1 items-center justify-center px-4">
            <Text className="text-center text-sm text-muted-foreground dark:text-d-muted">
              No relax sounds available yet.
            </Text>
          </View>
        ) : (
          <FlatList
            data={sounds}
            numColumns={2}
            keyExtractor={(item) => item.id}
            columnWrapperStyle={{ gap: COLUMN_GAP }}
            ItemSeparatorComponent={() => <View style={{ height: ROW_GAP }} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
            renderItem={({ item, index }) => {
              const isActive = activeId === item.id;

              return (
                <Animated.View
                  entering={FadeInDown.delay(50 + index * 35).duration(380)}
                  style={{ width: cardWidth }}
                >
                  <RelaxSoundCard
                    sound={item}
                    isActive={isActive}
                    isPlaying={isActive && isPlaying}
                    isLoading={loadingId === item.id}
                    progress={isActive ? progress : null}
                    onPress={() => {
                      safeRouter.push(`/craving-tools/relax-sound/${item.id}`);
                    }}
                  />
                </Animated.View>
              );
            }}
          />
        )}
      </View>
    </CravingToolScreen>
  );
}
