import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Image as RNImage, type ImageSourcePropType, type StyleProp, type ViewStyle, View } from "react-native";

import type { PostImageCrop } from "@/types/community";
import {
  getCroppedImageLayout,
  normalizePostImageCrop,
} from "@/utils/community/postImageCrop";

type Props = {
  source: ImageSourcePropType;
  aspectRatio?: number;
  crop?: PostImageCrop;
  className?: string;
  /** Fill the parent bounds instead of locking to an aspect ratio. */
  fill?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function CroppedPostImage({
  source,
  aspectRatio,
  crop,
  className,
  fill = false,
  style,
}: Props) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const resolvedCrop = normalizePostImageCrop(crop);

  useEffect(() => {
    const uri = typeof source === "object" && source && "uri" in source ? source.uri : null;
    if (!uri) {
      setImageSize({ width: 1, height: 1 });
      return;
    }

    RNImage.getSize(
      uri,
      (width, height) => setImageSize({ width, height }),
      () => setImageSize({ width: 1, height: 1 }),
    );
  }, [source]);

  const resolvedHeight = fill
    ? containerHeight
    : aspectRatio && containerWidth > 0
      ? containerWidth / aspectRatio
      : 0;

  const layout =
    containerWidth > 0 && resolvedHeight > 0 && imageSize.width > 0
      ? getCroppedImageLayout(
          { width: containerWidth, height: resolvedHeight },
          imageSize,
          resolvedCrop,
        )
      : null;

  return (
    <View
      className={className ?? (fill ? "bg-section dark:bg-d-surface" : "w-full overflow-hidden rounded-xl bg-section dark:bg-d-surface")}
      style={[
        fill ? { flex: 1, overflow: "hidden" } : aspectRatio ? { aspectRatio } : undefined,
        style,
      ]}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setContainerWidth(width);
        if (fill) setContainerHeight(height);
      }}
    >
      {layout ? (
        <Image
          source={source}
          style={{
            position: "absolute",
            width: layout.width,
            height: layout.height,
            left: layout.left,
            top: layout.top,
          }}
          contentFit="cover"
        />
      ) : (
        <Image source={source} style={{ width: "100%", height: "100%" }} contentFit="cover" />
      )}
    </View>
  );
}
