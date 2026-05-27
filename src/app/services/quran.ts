import { cacheStore } from './cache';
import type { QuranVerse } from '@/app/types/quran';
import { ServiceError } from './aladhan';

const TOTAL_AYAHS = 6236;

interface QuranApiResponse {
  data: Array<{
    text: string;
    numberInSurah: number;
    surah: {
      number: number;
      name: string;
      englishName: string;
      englishNameTranslation: string;
    };
  }>;
}

export async function fetchDailyVerse(
  hijriDayOfYear: number,
  dateScope: Date,
): Promise<QuranVerse> {
  const cacheKey = cacheStore.buildKey('quran', dateScope);
  const cached = cacheStore.get<QuranVerse>(cacheKey);
  if (cached && !cacheStore.isExpired(cacheKey)) {
    return cached;
  }

  const ayahNumber = (hijriDayOfYear % TOTAL_AYAHS) + 1;

  try {
    const url = `https://api.alquran.cloud/v1/ayah/${ayahNumber}/editions/quran-uthmani,en.asad`;
    const response = await fetch(url);

    if (!response.ok) {
      if (cached) return cached;
      throw new ServiceError('quran', `HTTP ${response.status}`);
    }

    const json: QuranApiResponse = await response.json();
    const arabic = json.data[0];
    const english = json.data[1];

    if (!arabic || !english) {
      if (cached) return cached;
      throw new ServiceError('quran', 'Missing edition data');
    }

    const result: QuranVerse = {
      text_ar: arabic.text,
      text_en: english.text,
      surahName_ar: arabic.surah.name,
      surahName_en: arabic.surah.englishName,
      surahMeaning_en: arabic.surah.englishNameTranslation,
      ayahNumber: arabic.numberInSurah,
      surahNumber: arabic.surah.number,
    };

    cacheStore.set(cacheKey, result, 24 * 60 * 60 * 1000);
    return result;
  } catch (err) {
    if (cached) return cached;
    if (err instanceof ServiceError) throw err;
    throw new ServiceError('quran', 'Fetch failed', err);
  }
}
