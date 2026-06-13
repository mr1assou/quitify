import { Image } from "react-native";
import * as ImageManipulator from "expo-image-manipulator";

import type { PostImageCrop, PostMediaFrame } from "@/types/community";
import type { AllowedImageContentType } from "@/types/postsApi";
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

/** JPEG quality after crop/resize — balances size vs clarity. */
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

function computeSourceCropRect(
  imageSize: { width: number; height: number },
  frame: PostMediaFrame,
  crop: PostImageCrop,
): { originX: number; originY: number; width: number; height: number } {
  const aspectRatio = resolvePostMediaAspectRatio({ kind: "image", frame });
  const container = containerForAspect(aspectRatio, 100);
  const normalizedCrop = normalizePostImageCrop(crop);
  const layout = getCroppedImageLayout(container, imageSize, normalizedCrop);
  const { scale } = resolvePixelOffsets(container, imageSize, normalizedCrop);
  const coverScale = getCoverScale(container, imageSize);
  const factor = coverScale * scale;

  const originX = Math.max(0, Math.round(-layout.left / factor));
  const originY = Math.max(0, Math.round(-layout.top / factor));
  const width = Math.min(imageSize.width - originX, Math.max(1, Math.round(container.width / factor)));
  const height = Math.min(imageSize.height - originY, Math.max(1, Math.round(container.height / factor)));

  return { originX, originY, width, height };
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
 * Applies the user's frame + crop, then downscales and compresses for upload.
 * Output is always JPEG to keep large gallery photos under control.
 */
export async function optimizePostImageForUpload(
  uri: string,
  frame: PostMediaFrame,
  crop: PostImageCrop,
  maxLongEdge: number = POST_UPLOAD_MAX_LONG_EDGE,
  jpegQuality: number = POST_UPLOAD_JPEG_QUALITY,
): Promise<OptimizedPostImage> {
  const imageSize = await getImageSize(uri);
  const sourceCrop = computeSourceCropRect(imageSize, frame, crop);

  const actions: ImageManipulator.Action[] = [{ crop: sourceCrop }];
  const resize = resizeDimensions(sourceCrop.width, sourceCrop.height, maxLongEdge);
  if (resize) {
    actions.push({ resize });
  }

  const result = await ImageManipulator.manipulateAsync(uri, actions, {
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
