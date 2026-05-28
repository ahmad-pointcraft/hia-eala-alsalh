/**
 * Converts a Google Drive URL or File ID into a direct image URL.
 * If the input is not a Google Drive URL/ID, returns it as-is.
 */
export function getDirectDriveImageUrl(input: string): string {
  
  if (!input) return '';
  const trimmed = input.trim();

  // If it's already an external HTTP link but NOT a Google Drive link, return it as-is
  if (
    trimmed.startsWith('http') &&
    !trimmed.includes('drive.google.com') &&
    !trimmed.includes('docs.google.com')
  ) {
    return trimmed;
  }

  // 1. Match File ID from Google Drive view URL: /file/d/{FILE_ID}/view
  const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${fileDMatch[1]}`;
  }

  // 2. Match File ID from Google Drive query param: id={FILE_ID} or open?id={FILE_ID}
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
  }

  // 3. Match File ID from docs.google.com/file/d/{FILE_ID}/edit or similar
  const docsDMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (docsDMatch && docsDMatch[1] && (trimmed.includes('docs.google.com') || trimmed.includes('drive.google.com'))) {
    return `https://lh3.googleusercontent.com/d/${docsDMatch[1]}`;
  }

  // 4. If it looks like a raw Google Drive File ID (alphanumeric, no slashes or dots, length >= 15)
  if (!trimmed.includes('/') && !trimmed.includes('.') && trimmed.length >= 15) {
    return `https://lh3.googleusercontent.com/d/${trimmed}`;
  }

  return trimmed;
}
