import { cacheStore } from './cache';
import { parseCSV } from '@/app/utils/csv';
import type { SheetAnnouncement, SheetEvent } from '@/app/types/googleSheets';
import { ServiceError } from './aladhan';

const ANNOUNCEMENTS_TTL = 5 * 60 * 1000;
const EVENTS_TTL = 5 * 60 * 1000;

function buildSheetUrl(sheetId: string, gid: string): string {
  return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
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
      date: get('date'),
      time: get('time'),
      location_en: get('location_en'),
      location_ar: get('location_ar'),
      cta_en: get('cta_en'),
      cta_ar: get('cta_ar'),
      active: get('active').toLowerCase() === 'true',
    });
  }

  return events;
}

export async function fetchAnnouncements(
  sheetId: string,
  gid: string,
): Promise<SheetAnnouncement[]> {
  const cacheKey = cacheStore.buildKey('announcements');
  const cached = cacheStore.get<SheetAnnouncement[]>(cacheKey);
  if (cached && !cacheStore.isExpired(cacheKey)) {
    return cached;
  }

  try {
    const rows = await fetchAndParse(sheetId, gid);
    const result = mapAnnouncements(rows);
    cacheStore.set(cacheKey, result, ANNOUNCEMENTS_TTL);
    return result;
  } catch (err) {
    if (cached) return cached;
    if (err instanceof ServiceError) throw err;
    throw new ServiceError('googleSheets', 'Announcements fetch failed', err);
  }
}

export async function fetchEvents(
  sheetId: string,
  gid: string,
): Promise<SheetEvent[]> {
  const cacheKey = cacheStore.buildKey('events');
  const cached = cacheStore.get<SheetEvent[]>(cacheKey);
  if (cached && !cacheStore.isExpired(cacheKey)) {
    return cached;
  }

  try {
    const rows = await fetchAndParse(sheetId, gid);
    const result = mapEvents(rows);
    cacheStore.set(cacheKey, result, EVENTS_TTL);
    return result;
  } catch (err) {
    if (cached) return cached;
    if (err instanceof ServiceError) throw err;
    throw new ServiceError('googleSheets', 'Events fetch failed', err);
  }
}
