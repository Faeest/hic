import type { CSSProperties } from "react";
import type { FotoCrop } from "@/lib/types";

/**
 * Focal point of a portrait inside its frame.
 *
 * The same photo is rendered in several aspect ratios (4:3 BPH card, square
 * compact card, 56px coordinator row), so the crop is stored as data and applied
 * at render time instead of being baked into the file. `object-position` moves
 * the cover crop and `zoom` scales it about the same point, which keeps the
 * chosen spot fixed.
 */

/** Centred, unzoomed — what `object-cover` alone does. */
export const DEFAULT_CROP: FotoCrop = { x: 50, y: 50, zoom: 1 };

/** Upper bound of the zoom slider. Past ~3x a portrait turns to mush. */
export const MAX_ZOOM = 3;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const number = (value: unknown, min: number, max: number, fallback: number) => {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? clamp(n, min, max) : fallback;
};

/**
 * Tolerant read of the `foto_crop` column: accepts the parsed JSONB object, a
 * JSON string, or junk. Anything unusable falls back to the centred crop, so a
 * bad row can never break the section.
 */
export function parseCrop(value: unknown): FotoCrop {
  let raw = value;
  if (typeof raw === "string") {
    try {
      raw = JSON.parse(raw);
    } catch {
      return { ...DEFAULT_CROP };
    }
  }
  if (!raw || typeof raw !== "object") return { ...DEFAULT_CROP };

  const crop = raw as Record<string, unknown>;
  return {
    x: number(crop.x, 0, 100, DEFAULT_CROP.x),
    y: number(crop.y, 0, 100, DEFAULT_CROP.y),
    zoom: number(crop.zoom, 1, MAX_ZOOM, DEFAULT_CROP.zoom),
  };
}

/**
 * Inline style for an `object-cover` image. Returns nothing for a centred crop
 * so the default stays byte-identical to the pre-crop markup.
 */
export function cropStyle(crop?: FotoCrop | null): CSSProperties | undefined {
  if (!crop) return undefined;

  const { x, y, zoom } = parseCrop(crop);
  if (x === DEFAULT_CROP.x && y === DEFAULT_CROP.y && zoom === DEFAULT_CROP.zoom) {
    return undefined;
  }

  return {
    objectPosition: `${x}% ${y}%`,
    ...(zoom > 1
      ? { transform: `scale(${zoom})`, transformOrigin: `${x}% ${y}%` }
      : {}),
  };
}
