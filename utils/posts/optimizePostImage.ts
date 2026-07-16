import { Image } from "react-native";
import * as ImageManipulator from "expo-image-manipulator";

import type { PostImageCrop, PostMediaFrame } from "@/types/community/community";
import type { AllowedImageContentType } from "@/types/community/postsApi";
import {
  containerForAspect,
  getCoverScale,
  getCroppedImageLayout,
  normalizePostImageCrop,
  resolvePixelOffsets,
} from "@/utils/community/postImageCrop";
import { resolvePostMediaAspectRatio } from "@/utils/community/postMediaFrame";

/** Max long edge for uploaded post images (keeps files small and fast in feed). */
export const POST_UPLOAD_MAX_LONG_EDGE = 1920;

/** JPEG quality after resize — balances size vs clarity. */
export const POST_UPLOAD_JPEG_QUALITY = 0.82;

export type OptimizedPostImage = {
  uri: string;
  contentType: AllowedImageContentType;
  width: number;
  height: number;
};

function getImageSize(uri: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    Image.getSize(
      uri,
      (width, height) => resolve({ width, height }),
      (error) => reject(error),
    );
  });
}

/**
 * Flattens EXIF orientation into real pixels so crop math matches what the
 * editor shows (phone photos are the common failure case).
 */
export async function normalizeImageOrientation(uri: string): Promise<{
  uri: string;
  width: number;
  height: number;
}> {
  const result = await ImageManipulator.manipulateAsync(uri, [], {
    compress: 1,
    format: ImageManipulator.SaveFormat.JPEG,
  });

  return {
    uri: result.uri,
    width: result.width,
    height: result.height,
  };
}

function computeSourceCropRect(
  imageSize: { width: number; height: number },
  frame: PostMediaFrame,
  crop: PostImageCrop,
): { originX: number; originY: number; width: number; height: number } {
  const aspectRatio = resolvePostMediaAspectRatio({ kind: "image", frame });
  const container = containerForAspect(aspectRatio, 1000);
  const normalizedCrop = normalizePostImageCrop(crop);
  const layout = getCroppedImageLayout(container, imageSize, normalizedCrop);
  const { scale } = resolvePixelOffsets(container, imageSize, normalizedCrop);
  const coverScale = getCoverScale(container, imageSize);
  const factor = coverScale * scale;

  if (factor <= 0) {
    return { originX: 0, originY: 0, width: imageSize.width, height: imageSize.height };
  }

  let originX = Math.max(0, Math.floor(-layout.left / factor));
  let originY = Math.max(0, Math.floor(-layout.top / factor));
  let width = Math.max(1, Math.round(container.width / factor));
  let height = Math.max(1, Math.round(container.height / factor));

  // Keep exact frame aspect so avatar/post cover doesn't re-crop after upload.
  if (Math.abs(aspectRatio - 1) < 0.001) {
    const side = Math.max(
      1,
      Math.min(width, height, imageSize.width - originX, imageSize.height - originY),
    );
    width = side;
    height = side;
  } else {
    const targetHeight = Math.max(1, Math.round(width / aspectRatio));
    if (originY + targetHeight <= imageSize.height) {
      height = targetHeight;
    } else {
      height = Math.max(1, imageSize.height - originY);
      width = Math.max(1, Math.round(height * aspectRatio));
    }
  }

  if (originX + width > imageSize.width) {
    originX = Math.max(0, imageSize.width - width);
  }
  if (originY + height > imageSize.height) {
    originY = Math.max(0, imageSize.height - height);
  }

  width = Math.min(width, imageSize.width - originX);
  height = Math.min(height, imageSize.height - originY);

  return {
    originX,
    originY,
    width: Math.max(1, width),
    height: Math.max(1, height),
  };
}

function resizeDimensions(
  width: number,
  height: number,
  maxLongEdge: number,
): { width?: number; height?: number } | null {
  const longEdge = Math.max(width, height);
  if (longEdge <= maxLongEdge) return null;

  if (width >= height) {
    return { width: maxLongEdge };
  }
  return { height: maxLongEdge };
}

/**
 * Downscales and compresses for upload. Framing (ratio + pan/zoom) is stored as
 * metadata and applied in the feed via the same crop math as the composer.
 */
export async function optimizePostImageForUpload(
  uri: string,
  maxLongEdge: number = POST_UPLOAD_MAX_LONG_EDGE,
  jpegQuality: number = POST_UPLOAD_JPEG_QUALITY,
): Promise<OptimizedPostImage> {
  const imageSize = await getImageSize(uri);
  const resize = resizeDimensions(imageSize.width, imageSize.height, maxLongEdge);

  const actions: ImageManipulator.Action[] = [];
  if (resize) {
    actions.push({ resize });
  }

  const result =
    actions.length > 0
      ? await ImageManipulator.manipulateAsync(uri, actions, {
          compress: jpegQuality,
          format: ImageManipulator.SaveFormat.JPEG,
        })
      : await ImageManipulator.manipulateAsync(uri, [], {
          compress: jpegQuality,
          format: ImageManipulator.SaveFormat.JPEG,
        });

  return {
    uri: result.uri,
    contentType: "image/jpeg",
    width: result.width,
    height: result.height,
  };
}

/** Bakes frame + crop into the file (used for profile photos). */
export async function optimizePostImageWithCropForUpload(
  uri: string,
  frame: PostMediaFrame,
  crop: PostImageCrop,
  maxLongEdge: number = POST_UPLOAD_MAX_LONG_EDGE,
  jpegQuality: number = POST_UPLOAD_JPEG_QUALITY,
): Promise<OptimizedPostImage> {
  // Normalize first so crop coordinates match the oriented pixels the editor used.
  const normalized = await normalizeImageOrientation(uri);
  const imageSize = { width: normalized.width, height: normalized.height };
  const sourceCrop = computeSourceCropRect(imageSize, frame, crop);

  const actions: ImageManipulator.Action[] = [{ crop: sourceCrop }];
  const resize = resizeDimensions(sourceCrop.width, sourceCrop.height, maxLongEdge);
  if (resize) {
    actions.push({ resize });
  }

  const result = await ImageManipulator.manipulateAsync(normalized.uri, actions, {
    compress: jpegQuality,
    format: ImageManipulator.SaveFormat.JPEG,
  });

  return {
    uri: result.uri,
    contentType: "image/jpeg",
    width: result.width,
    height: result.height,
  };
}
