export function parseProductImages(images: unknown): string[] {
  if (!images) return [];

  if (Array.isArray(images)) {
    return images.filter((value): value is string => typeof value === "string" && value.trim().length > 0);
  }

  if (typeof images !== "string") return [];

  const trimmed = images.trim();
  if (!trimmed) return [];

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed.filter((value): value is string => typeof value === "string" && value.trim().length > 0);
    }
  } catch {
    // fall through to plain string handling below
  }

  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    return [];
  }

  return trimmed.split(/[\r\n,]+/).map((value) => value.trim()).filter(Boolean);
}

export function getPrimaryProductImage(images: unknown): string | null {
  const parsed = parseProductImages(images);
  return parsed[0] ?? null;
}
