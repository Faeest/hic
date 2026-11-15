/** Bucket limit for one object. Mirrors the `media` bucket configuration. */
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Human message for a file the bucket will refuse. */
export function tooLargeMessage(file: File): string {
  return `"${file.name}" ${formatBytes(file.size)} — maksimal ${formatBytes(
    MAX_UPLOAD_BYTES
  )} per gambar.`;
}
