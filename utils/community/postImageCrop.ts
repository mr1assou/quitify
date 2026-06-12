import type { PostImageCrop } from "@/types/community";

export const DEFAULT_POST_IMAGE_CROP: PostImageCrop = {
  scale: 1,
  panX: 0,
  panY: 0,
};

export const MIN_CROP_SCALE = 1;
export const MAX_CROP_SCALE = 4;

type Size = { width: number; height: number };

type LegacyPostImageCrop = PostImageCrop & {
  offsetX?: number;
  offsetY?: number;
};

export function normalizePostImageCrop(crop?: PostImageCrop | null): PostImageCrop {
  if (!crop) return DEFAULT_POST_IMAGE_CROP;

  const legacy = crop as LegacyPostImageCrop;
  if (typeof legacy.offsetX === "number" || typeof legacy.offsetY === "number") {
    return {
      scale: Math.min(MAX_CROP_SCALE, Math.max(MIN_CROP_SCALE, crop.scale ?? 1)),
      panX: 0,
      panY: 0,
    };
  }

  return clampCropPan(crop);
}

export function getCoverScale(container: Size, image: Size): number {
  if (image.width <= 0 || image.height <= 0) return 1;
  return Math.max(container.width / image.width, container.height / image.height);
}

export function getDisplayedImageSize(container: Size, image: Size, crop: PostImageCrop): Size {
  const normalized = normalizePostImageCrop(crop);
  const coverScale = getCoverScale(container, image);
  return {
    width: image.width * coverScale * normalized.scale,
    height: image.height * coverScale * normalized.scale,
  };
}

export function getMaxPanOffsets(
  container: Size,
  image: Size,
  scale: number,
): { maxOffsetX: number; maxOffsetY: number } {
  const displayed = getDisplayedImageSize(container, image, { scale, panX: 0, panY: 0 });
  return {
    maxOffsetX: Math.max(0, (displayed.width - container.width) / 2),
    maxOffsetY: Math.max(0, (displayed.height - container.height) / 2),
  };
}

export function resolvePixelOffsets(
  container: Size,
  image: Size,
  crop: PostImageCrop,
): { scale: number; offsetX: number; offsetY: number } {
  const normalized = clampCropPan(crop);
  const { maxOffsetX, maxOffsetY } = getMaxPanOffsets(container, image, normalized.scale);

  return {
    scale: normalized.scale,
    offsetX: normalized.panX * maxOffsetX,
    offsetY: normalized.panY * maxOffsetY,
  };
}

export function cropFromPixelOffsets(
  container: Size,
  image: Size,
  scale: number,
  offsetX: number,
  offsetY: number,
): PostImageCrop {
  const safeScale = Math.min(MAX_CROP_SCALE, Math.max(MIN_CROP_SCALE, scale));
  const { maxOffsetX, maxOffsetY } = getMaxPanOffsets(container, image, safeScale);

  return clampCropPan({
    scale: safeScale,
    panX: maxOffsetX > 0 ? offsetX / maxOffsetX : 0,
    panY: maxOffsetY > 0 ? offsetY / maxOffsetY : 0,
  });
}

export function clampCropPan(crop: PostImageCrop): PostImageCrop {
  return {
    scale: Math.min(MAX_CROP_SCALE, Math.max(MIN_CROP_SCALE, crop.scale)),
    panX: Math.min(1, Math.max(-1, crop.panX)),
    panY: Math.min(1, Math.max(-1, crop.panY)),
  };
}

/** @deprecated Use clampCropPan — kept as alias for call sites resolving pixel offsets externally. */
export function clampCropOffset(
  container: Size,
  image: Size,
  crop: PostImageCrop | { scale: number; offsetX: number; offsetY: number },
): PostImageCrop {
  if ("offsetX" in crop && "offsetY" in crop && !("panX" in crop)) {
    return cropFromPixelOffsets(container, image, crop.scale, crop.offsetX, crop.offsetY);
  }
  return clampCropPan(crop as PostImageCrop);
}

export function getCroppedImageLayout(
  container: Size,
  image: Size,
  crop: PostImageCrop,
): { width: number; height: number; left: number; top: number } {
  const { scale, offsetX, offsetY } = resolvePixelOffsets(container, image, crop);
  const displayed = getDisplayedImageSize(container, image, { scale, panX: 0, panY: 0 });

  return {
    width: displayed.width,
    height: displayed.height,
    left: (container.width - displayed.width) / 2 + offsetX,
    top: (container.height - displayed.height) / 2 + offsetY,
  };
}

/** Normalized focal point (0..1) on the source image for the current crop. */
export function getFocalPointNormalized(
  container: Size,
  image: Size,
  crop: PostImageCrop,
): { x: number; y: number } {
  const layout = getCroppedImageLayout(container, image, crop);
  const { scale } = resolvePixelOffsets(container, image, crop);
  const displayed = getDisplayedImageSize(container, image, { scale, panX: 0, panY: 0 });
  const viewCenterX = container.width / 2 - layout.left;
  const viewCenterY = container.height / 2 - layout.top;

  return {
    x: displayed.width > 0 ? viewCenterX / displayed.width : 0.5,
    y: displayed.height > 0 ? viewCenterY / displayed.height : 0.5,
  };
}

/** Builds a crop that keeps `focal` centered in the frame at the given zoom. */
export function cropFromFocalPoint(
  container: Size,
  image: Size,
  focal: { x: number; y: number },
  scale: number,
): PostImageCrop {
  const safeScale = Math.min(MAX_CROP_SCALE, Math.max(MIN_CROP_SCALE, scale));
  const displayed = getDisplayedImageSize(container, image, { scale: safeScale, panX: 0, panY: 0 });
  const offsetX = (focal.x - 0.5) * displayed.width;
  const offsetY = (focal.y - 0.5) * displayed.height;
  return cropFromPixelOffsets(container, image, safeScale, offsetX, offsetY);
}

export function containerForAspect(aspectRatio: number, width = 100): Size {
  return { width, height: width / aspectRatio };
}

/** Keeps the same image focal point when the preview aspect ratio changes. */
export function migrateCropForAspectRatio(
  oldAspect: number,
  newAspect: number,
  image: Size,
  crop: PostImageCrop,
): PostImageCrop {
  const oldContainer = containerForAspect(oldAspect);
  const newContainer = containerForAspect(newAspect);
  const focal = getFocalPointNormalized(oldContainer, image, crop);
  return cropFromFocalPoint(newContainer, image, focal, crop.scale);
}

export function canPanCrop(container: Size, image: Size, crop: PostImageCrop): boolean {
  const { scale } = resolvePixelOffsets(container, image, crop);
  const displayed = getDisplayedImageSize(container, image, { scale, panX: 0, panY: 0 });
  return displayed.width > container.width + 0.5 || displayed.height > container.height + 0.5;
}

export function canZoomCrop(crop: PostImageCrop): boolean {
  return normalizePostImageCrop(crop).scale < MAX_CROP_SCALE - 0.01;
}
