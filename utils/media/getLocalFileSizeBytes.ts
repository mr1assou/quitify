/** Best-effort local file size in bytes (via fetch + blob). */
export async function getLocalFileSizeBytes(uri: string): Promise<number | null> {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    if (typeof blob.size === "number" && Number.isFinite(blob.size) && blob.size > 0) {
      return blob.size;
    }
  } catch {
    // ignore
  }
  return null;
}
