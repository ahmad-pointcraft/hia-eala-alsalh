/** Maximum upload size — 2 MB (FR-011). */
const MAX_BYTES = 2 * 1024 * 1024;

/** Result of validating an uploaded image file. */
type ImageGuardResult = { ok: true } | { ok: false; message: string };

/** Validates that a file is an image within the 2 MB upload limit. */
export function validateImageFile(file: File): ImageGuardResult {
  if (!file.type.startsWith('image/')) {
    return { ok: false, message: 'File must be an image' };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, message: 'Image must be \u2264 2MB' };
  }
  return { ok: true };
}
