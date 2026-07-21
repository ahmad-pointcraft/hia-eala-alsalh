import { ServiceError } from './ServiceError';
import type { HijriDateInfo } from '@/display/types/mosqueConfig';

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

export async function fetchHijriDate(params: {
  latitude: number;
  longitude: number;
  method: number;
  date: Date;
}): Promise<{ hijri: HijriDateInfo; holidays: string[]; clockOffsetMs: number }> {
  try {
    const timestamp = Math.floor(params.date.getTime() / 1000);
    const url = new URL('https://api.aladhan.com/v1/timings/' + timestamp);
    url.searchParams.set('latitude', String(params.latitude));
    url.searchParams.set('longitude', String(params.longitude));
    url.searchParams.set('method', String(params.method));

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new ServiceError('aladhan', `HTTP ${response.status}`);
    }

    let clockOffsetMs = 0;
    const dateHeader = response.headers.get('Date');
    if (dateHeader) {
      const parsed = Date.parse(dateHeader);
      if (!Number.isNaN(parsed)) {
        clockOffsetMs = parsed - Date.now();
      }
    }

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

    return { hijri, holidays: h.holidays ?? [], clockOffsetMs };
  } catch (err) {
    if (err instanceof ServiceError) throw err;
    throw new ServiceError('aladhan', 'Fetch failed', err);
  }
}
