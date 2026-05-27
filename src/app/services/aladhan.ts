import { cacheStore } from './cache';
import type { HijriDateInfo } from '@/app/types/mosqueConfig';

interface AladhanResponse {
  data: {
    date: {
      hijri: {
        day: string;
        month: { number: number; en: string; ar: string };
        year: string;
        weekday: { en: string; ar: string };
        holidays: string[];
      };
    };
  };
}

class ServiceError extends Error {
  constructor(
    public readonly feature: string,
    message: string,
    public readonly cause?: unknown,
  ) {
    super(`[${feature}] ${message}`);
    this.name = 'ServiceError';
  }
}

export { ServiceError };

export async function fetchHijriDate(params: {
  latitude: number;
  longitude: number;
  method: number;
  date: Date;
}): Promise<{ hijri: HijriDateInfo; holidays: string[]; clockOffsetMs: number }> {
  const cacheKey = cacheStore.buildKey('aladhan', params.date);
  const cached = cacheStore.get<{ hijri: HijriDateInfo; holidays: string[]; clockOffsetMs: number }>(cacheKey);
  if (cached && !cacheStore.isExpired(cacheKey)) {
    return cached;
  }

  try {
    const timestamp = Math.floor(params.date.getTime() / 1000);
    const url = new URL('https://api.aladhan.com/v1/timings/' + timestamp);
    url.searchParams.set('latitude', String(params.latitude));
    url.searchParams.set('longitude', String(params.longitude));
    url.searchParams.set('method', String(params.method));

    const response = await fetch(url.toString());

    if (!response.ok) {
      if (cached) return cached;
      throw new ServiceError('aladhan', `HTTP ${response.status}`);
    }

    const dateHeader = response.headers.get('Date');
    const clockOffsetMs = dateHeader
      ? Date.parse(dateHeader) - Date.now()
      : 0;

    const json: AladhanResponse = await response.json();
    const h = json.data.date.hijri;

    const day = parseInt(h.day, 10);
    const month = h.month.number;
    const year = parseInt(h.year, 10);

    const hijri: HijriDateInfo = {
      day,
      month,
      monthName_en: h.month.en,
      monthName_ar: h.month.ar,
      year,
      weekday_en: h.weekday.en,
      weekday_ar: h.weekday.ar,
      formatted_en: `${day} ${h.month.en} ${year}`,
      formatted_ar: `${day} ${h.month.ar} ${year}`,
    };

    const result = { hijri, holidays: h.holidays ?? [], clockOffsetMs };
    cacheStore.set(cacheKey, result, 24 * 60 * 60 * 1000);
    return result;
  } catch (err) {
    if (cached) return cached;
    if (err instanceof ServiceError) throw err;
    throw new ServiceError('aladhan', 'Fetch failed', err);
  }
}
