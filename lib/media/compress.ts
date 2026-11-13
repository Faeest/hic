/**
 * Browser-side image downscaling + WebP re-encoding, shared by the media
 * library and the `ImageField` uploader.
 *
 * SVG and GIF are passed through untouched (vector / animation), and anything
 * already small is left alone — re-encoding usually costs more than it saves.
 */

/** Longest edge kept after compression. */
const MAX_EDGE = 2000;
/** WebP quality — visually lossless for photos at this size. */
const QUALITY = 0.82;
/** Below this, re-encoding usually costs more than it saves. */
const SKIP_BELOW = 400 * 1024;

export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  if (file.type === "image/svg+xml" || file.type === "image/gif") return file;
  if (file.size < SKIP_BELOW) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", QUALITY)
    );
    if (!blob || blob.size >= file.size) return file;

    const name = `${file.name.replace(/\.[^.]+$/, "") || "gambar"}.webp`;
    return new File([blob], name, { type: "image/webp" });
  } catch {
    // Unsupported source (e.g. HEIC) — let the server decide.
    return file;
  }
}

/** Lowercase extension without the dot, or "" when there is none. */
export const extOf = (name: string): string => {
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot + 1).toLowerCase() : "";
};

/**
 * Compress, but keep the original when compression would change the file type.
 * A replacement must keep the storage key's extension, otherwise the object's
 * `Content-Type` and its name disagree.
 */
export async function compressKeepingType(file: File, key: string): Promise<File> {
  const compressed = await compressImage(file);
  return extOf(compressed.name) === extOf(key) ? compressed : file;
}
