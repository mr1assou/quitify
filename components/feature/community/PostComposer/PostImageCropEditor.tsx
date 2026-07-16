import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Image, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from "react-native-reanimated";

import type { PostImageCrop } from "@/types/community/community";
import {
  cropFromPixelOffsets,
  getCoverScale,
  MAX_CROP_SCALE,
  migrateCropForAspectRatio,
  MIN_CROP_SCALE,
  normalizePostImageCrop,
  resolvePixelOffsets,
} from "@/utils/community/postImageCrop";

import { PostImageCropGrid } from "./PostImageCropGrid";

export type PostImageCropEditorHandle = {
  /** Commits in-progress pan/zoom and returns the latest crop. */
  flush: () => PostImageCrop;
};

type Props = {
  uri: string;
  aspectRatio: number;
  crop: PostImageCrop;
  onCropChange: (crop: PostImageCrop) => void;
  maskShape?: "rectangle" | "circle";
};

function clampOffsetsWorklet(
  containerW: number,
  containerH: number,
  imageW: number,
  imageH: number,
  coverScale: number,
  scale: number,
  offsetX: number,
  offsetY: number,
): { offsetX: number; offsetY: number } {
  "worklet";
  if (containerW <= 0 || imageW <= 0) {
    return { offsetX: 0, offsetY: 0 };
  }

  const displayedW = imageW * coverScale * scale;
  const displayedH = imageH * coverScale * scale;
  const maxOffsetX = Math.max(0, (displayedW - containerW) / 2);
  const maxOffsetY = Math.max(0, (displayedH - containerH) / 2);

  return {
    offsetX: Math.min(maxOffsetX, Math.max(-maxOffsetX, offsetX)),
    offsetY: Math.min(maxOffsetY, Math.max(-maxOffsetY, offsetY)),
  };
}

function applyClampedOffsets(
  containerW: SharedValue<number>,
  containerH: SharedValue<number>,
  imageW: SharedValue<number>,
  imageH: SharedValue<number>,
  coverScale: SharedValue<number>,
  scale: SharedValue<number>,
  offsetX: SharedValue<number>,
  offsetY: SharedValue<number>,
) {
  "worklet";
  const clamped = clampOffsetsWorklet(
    containerW.value,
    containerH.value,
    imageW.value,
    imageH.value,
    coverScale.value,
    scale.value,
    offsetX.value,
    offsetY.value,
  );
  offsetX.value = clamped.offsetX;
  offsetY.value = clamped.offsetY;
}

export const PostImageCropEditor = forwardRef<PostImageCropEditorHandle, Props>(
  function PostImageCropEditor(
    { uri, aspectRatio, crop, onCropChange, maskShape = "rectangle" },
    ref,
  ) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const prevAspectRatio = useRef(aspectRatio);
  const normalizedCrop = normalizePostImageCrop(crop);

  const containerW = useSharedValue(0);
  const containerH = useSharedValue(0);
  const imageW = useSharedValue(0);
  const imageH = useSharedValue(0);
  const coverScaleSV = useSharedValue(1);
  const isAdjusting = useSharedValue(0);

  const scale = useSharedValue(normalizedCrop.scale);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const pinchStartScale = useSharedValue(normalizedCrop.scale);
  const panStartX = useSharedValue(0);
  const panStartY = useSharedValue(0);

  const containerHeight = containerWidth / aspectRatio;
  const coverScale =
    containerWidth > 0 && imageSize.width > 0
      ? getCoverScale({ width: containerWidth, height: containerHeight }, imageSize)
      : 1;

  const container = useMemo(
    () => ({ width: containerWidth, height: containerHeight }),
    [containerHeight, containerWidth],
  );

  const syncPixelOffsetsFromCrop = useCallback(
    (nextCrop: PostImageCrop) => {
      if (containerWidth <= 0 || imageSize.width <= 0) return;

      const pixels = resolvePixelOffsets(container, imageSize, nextCrop);
      scale.value = pixels.scale;
      offsetX.value = pixels.offsetX;
      offsetY.value = pixels.offsetY;
    },
    [container, containerWidth, imageSize, offsetX, offsetY, scale],
  );

  useEffect(() => {
    syncPixelOffsetsFromCrop(normalizedCrop);
  }, [normalizedCrop, syncPixelOffsetsFromCrop]);

  useEffect(() => {
    Image.getSize(
      uri,
      (width, height) => setImageSize({ width, height }),
      () => setImageSize({ width: 1, height: 1 }),
    );
  }, [uri]);

  useEffect(() => {
    if (imageSize.width <= 0) return;
    if (prevAspectRatio.current === aspectRatio) return;

    const migrated = migrateCropForAspectRatio(
      prevAspectRatio.current,
      aspectRatio,
      imageSize,
      normalizedCrop,
    );

    prevAspectRatio.current = aspectRatio;
    syncPixelOffsetsFromCrop(migrated);
    onCropChange(migrated);
  }, [aspectRatio, imageSize, normalizedCrop, onCropChange, syncPixelOffsetsFromCrop]);

  useEffect(() => {
    containerW.value = containerWidth;
    containerH.value = containerHeight;
    imageW.value = imageSize.width;
    imageH.value = imageSize.height;
    coverScaleSV.value = coverScale;
    syncPixelOffsetsFromCrop(normalizedCrop);
  }, [
    containerHeight,
    containerWidth,
    containerH,
    containerW,
    coverScale,
    coverScaleSV,
    imageSize.height,
    imageSize.width,
    imageH,
    imageW,
    normalizedCrop,
    syncPixelOffsetsFromCrop,
  ]);

  const commitCrop = useCallback(
    (nextScale: number, nextX: number, nextY: number) => {
      if (containerWidth <= 0 || imageSize.width <= 0) return crop;

      const nextCrop = cropFromPixelOffsets(container, imageSize, nextScale, nextX, nextY);
      const pixels = resolvePixelOffsets(container, imageSize, nextCrop);

      scale.value = pixels.scale;
      offsetX.value = pixels.offsetX;
      offsetY.value = pixels.offsetY;
      onCropChange(nextCrop);
      return nextCrop;
    },
    [container, containerWidth, crop, imageSize, offsetX, offsetY, onCropChange, scale],
  );

  useImperativeHandle(
    ref,
    () => ({
      flush: () => commitCrop(scale.value, offsetX.value, offsetY.value),
    }),
    [commitCrop, offsetX, offsetY, scale],
  );

  const pinch = Gesture.Pinch()
    .onBegin(() => {
      isAdjusting.value = 1;
      pinchStartScale.value = scale.value;
    })
    .onUpdate((event) => {
      scale.value = Math.min(
        MAX_CROP_SCALE,
        Math.max(MIN_CROP_SCALE, pinchStartScale.value * event.scale),
      );
      applyClampedOffsets(containerW, containerH, imageW, imageH, coverScaleSV, scale, offsetX, offsetY);
    })
    .onEnd(() => {
      isAdjusting.value = 0;
      runOnJS(commitCrop)(scale.value, offsetX.value, offsetY.value);
    });

  const pan = Gesture.Pan()
    .onBegin(() => {
      isAdjusting.value = 1;
      panStartX.value = offsetX.value;
      panStartY.value = offsetY.value;
    })
    .onUpdate((event) => {
      const clamped = clampOffsetsWorklet(
        containerW.value,
        containerH.value,
        imageW.value,
        imageH.value,
        coverScaleSV.value,
        scale.value,
        panStartX.value + event.translationX,
        panStartY.value + event.translationY,
      );
      offsetX.value = clamped.offsetX;
      offsetY.value = clamped.offsetY;
    })
    .onEnd(() => {
      isAdjusting.value = 0;
      runOnJS(commitCrop)(scale.value, offsetX.value, offsetY.value);
    });

  const gesture = Gesture.Simultaneous(pinch, pan);

  const imageStyle = useAnimatedStyle(() => {
    const displayedWidth = imageW.value * coverScaleSV.value * scale.value;
    const displayedHeight = imageH.value * coverScaleSV.value * scale.value;
    const clamped = clampOffsetsWorklet(
      containerW.value,
      containerH.value,
      imageW.value,
      imageH.value,
      coverScaleSV.value,
      scale.value,
      offsetX.value,
      offsetY.value,
    );

    return {
      position: "absolute",
      width: displayedWidth,
      height: displayedHeight,
      left: (containerW.value - displayedWidth) / 2 + clamped.offsetX,
      top: (containerH.value - displayedHeight) / 2 + clamped.offsetY,
    };
  });

  const gridStyle = useAnimatedStyle(() => ({
    opacity: isAdjusting.value,
  }));

  const maskRadius =
    maskShape === "circle" && containerWidth > 0 ? containerWidth / 2 : 12;

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[styles.container, { aspectRatio, borderRadius: maskRadius }]}
        onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}
      >
        {containerWidth > 0 ? (
          <Animated.Image source={{ uri }} style={imageStyle} resizeMode="stretch" />
        ) : null}
        {containerWidth > 0 ? (
          <PostImageCropGrid style={gridStyle} shape={maskShape} radius={maskRadius} />
        ) : null}
      </Animated.View>
    </GestureDetector>
  );
},
);

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    backgroundColor: "#000",
  },
});
