import { useCallback, useState } from "react";
import {
  FlatList,
  Text,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";

import type { PostMedia } from "@/types/community/community";
import { postMediaKey } from "@/utils/community/postMediaDisplay";

import { PostMedia as PostMediaItem } from "./PostMedia";

type Props = {
  media: PostMedia[];
};

function CarouselIndicators({
  index,
  total,
}: {
  index: number;
  total: number;
}) {
  return (
    <>
      <View
        pointerEvents="none"
        className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1"
      >
        <Text className="text-xs font-semibold text-white">
          {index + 1} / {total}
        </Text>
      </View>

      <View className="mt-3 flex-row items-center justify-center gap-1.5">
        {Array.from({ length: total }, (_, dotIndex) => (
          <View
            key={`dot-${dotIndex}`}
            className={`h-1.5 rounded-full ${
              dotIndex === index ? "w-5 bg-primary" : "w-1.5 bg-muted-foreground/40"
            }`}
          />
        ))}
      </View>
    </>
  );
}

export function PostMediaCarousel({ media }: Props) {
  const [slideWidth, setSlideWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const onLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    if (width > 0 && Math.abs(width - slideWidth) > 0.5) {
      setSlideWidth(width);
    }
  };

  const onScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (slideWidth <= 0) return;
      setActiveIndex(Math.round(event.nativeEvent.contentOffset.x / slideWidth));
    },
    [slideWidth],
  );

  const renderSlide = useCallback(
    ({ item }: { item: PostMedia }) => (
      <View style={{ width: slideWidth }}>
        <PostMediaItem media={item} roundedClassName="rounded-none" />
      </View>
    ),
    [slideWidth],
  );

  if (media.length === 1) {
    return (
      <View onLayout={onLayout}>
        <PostMediaItem media={media[0]} roundedClassName="rounded-none" />
      </View>
    );
  }

  const isReady = slideWidth > 0;

  return (
    <View className="relative" onLayout={onLayout}>
      {isReady ? (
        <FlatList
          data={media}
          horizontal
          pagingEnabled
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          disableIntervalMomentum
          snapToInterval={slideWidth}
          snapToAlignment="start"
          keyExtractor={postMediaKey}
          getItemLayout={(_, index) => ({
            length: slideWidth,
            offset: slideWidth * index,
            index,
          })}
          onMomentumScrollEnd={onScrollEnd}
          renderItem={renderSlide}
        />
      ) : null}

      {isReady ? <CarouselIndicators index={activeIndex} total={media.length} /> : null}
    </View>
  );
}
