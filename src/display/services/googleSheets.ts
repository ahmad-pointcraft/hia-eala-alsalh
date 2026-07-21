import { getDirectDriveImageUrl } from '@/display/utils/googleDrive';
import { parseCSV } from '@/display/utils/csv';
import type { SheetAnnouncement, SheetEvent, SheetFundraising } from '@/display/types/googleSheets';
import { ServiceError } from './ServiceError';
import { cacheStore } from './cache';

function buildSheetUrl(sheetId: string, gid: string): string {
  const existing = cacheStore.get<{ fetchedAt: number }>(`sheet-url-${gid}`);
  const t = existing?.fetchedAt ?? Date.now();
  return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}&t=${t}`;
}

async function fetchAndParse(sheetId: string, gid: string): Promise<string[][]> {
  const url = buildSheetUrl(sheetId, gid);
  const response = await fetch(url);

  if (!response.ok) {
    throw new ServiceError('googleSheets', `HTTP ${response.status} for gid=${gid}`);
  }

  const text = await response.text();
  return parseCSV(text);
}

function mapAnnouncements(rows: string[][]): SheetAnnouncement[] {
  if (rows.length < 2) return [];
  const header = (rows[0] as string[]).map((h) => h.toLowerCase().trim());
  const announcements: SheetAnnouncement[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row) continue;
    const get = (name: string): string => {
      const idx = header.indexOf(name);
      const val = idx >= 0 ? row[idx] : undefined;
      return val !== undefined ? val : '';
    };

    announcements.push({
      id: get('id'),
      text_en: get('text_en'),
      text_ar: get('text_ar'),
      active: get('active').toLowerCase() === 'true',
    });
  }

  return announcements;
}

function mapEvents(rows: string[][]): SheetEvent[] {
  if (rows.length < 2) return [];
  const header = (rows[0] as string[]).map((h) => h.toLowerCase().trim());
  const events: SheetEvent[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row) continue;
    const get = (name: string): string => {
      const idx = header.indexOf(name);
      const val = idx >= 0 ? row[idx] : undefined;
      return val !== undefined ? val : '';
    };

    events.push({
      id: get('id'),
      badge_en: get('badge_en'),
      badge_ar: get('badge_ar'),
      title_en: get('title_en'),
      title_ar: get('title_ar'),
      speaker_en: get('speaker_en'),
      speaker_ar: get('speaker_ar'),
      date_en: get('date_en'),
      date_ar: get('date_ar'),
      time_en: get('time_en'),
      time_ar: get('time_ar'),
      date: get('date'),
      time: get('time'),
      location_en: get('location_en'),
      location_ar: get('location_ar'),
      cta_en: get('cta_en'),
      cta_ar: get('cta_ar'),
      image_url: getDirectDriveImageUrl(get('image_url')),
      active: get('active').toLowerCase() === 'true',
    });
  }

  return events;
}

export async function fetchAnnouncements(
  sheetId: string,
  gid: string,
): Promise<SheetAnnouncement[]> {
  try {
    const rows = await fetchAndParse(sheetId, gid);
    return mapAnnouncements(rows);
  } catch (err) {
    if (err instanceof ServiceError) throw err;
    throw new ServiceError('googleSheets', 'Announcements fetch failed', err);
  }
}

export async function fetchEvents(
  sheetId: string,
  gid: string,
): Promise<SheetEvent[]> {
  try {
    const rows = await fetchAndParse(sheetId, gid);
    return mapEvents(rows);
  } catch (err) {
    if (err instanceof ServiceError) throw err;
    throw new ServiceError('googleSheets', 'Events fetch failed', err);
  }
}

function mapFundraising(rows: string[][]): SheetFundraising[] {
  if (rows.length < 2) return [];
  const header = (rows[0] as string[]).map((h) => h.toLowerCase().trim());
  const items: SheetFundraising[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row) continue;
    const get = (name: string): string => {
      const idx = header.indexOf(name);
      const val = idx >= 0 ? row[idx] : undefined;
      return val !== undefined ? val : '';
    };

    items.push({
      id: get('id'),
      title_en: get('title_en'),
      title_ar: get('title_ar'),
      description_en: get('description_en'),
      description_ar: get('description_ar'),
      collected: parseFloat(get('collected')) || 0,
      goal: parseFloat(get('goal')) || 0,
      donors: parseFloat(get('donors')) || 0,
      donate_url: get('donate_url'),
      qr_image_url: getDirectDriveImageUrl(get('qr_image_url')),
      active: get('active').toLowerCase() === 'true',
    });
  }

  return items;
}

export async function fetchFundraising(
  sheetId: string,
  gid: string,
): Promise<SheetFundraising[]> {
  try {
    const rows = await fetchAndParse(sheetId, gid);
    return mapFundraising(rows);
  } catch (err) {
    if (err instanceof ServiceError) throw err;
    throw new ServiceError('googleSheets', 'Fundraising fetch failed', err);
  }
}
