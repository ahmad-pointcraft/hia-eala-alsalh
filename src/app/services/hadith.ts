import { cacheStore } from './cache';
import { BUKHARI_HADITH_COUNT } from '@/app/types/hadith';
import type { HadithData } from '@/app/types/hadith';
import { ServiceError } from './aladhan';

const CDN_BASE = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions';

async function fetchWithExtensionRetry(url: string): Promise<Response> {
  let response = await fetch(url);
  if (response.ok) return response;

  const retryUrl = url.endsWith('.min.json')
    ? url.replace('.min.json', '.json')
    : url.replace('.json', '.min.json');
  response = await fetch(retryUrl);
  if (response.ok) return response;

  throw new ServiceError('hadith', `HTTP ${response.status} for ${url}`);
}

export async function fetchDailyHadith(
  hijriDayOfYear: number,
  dateScope: Date,
): Promise<HadithData> {
  const cacheKey = cacheStore.buildKey('hadith', dateScope);
  const cached = cacheStore.get<HadithData>(cacheKey);
  if (cached && !cacheStore.isExpired(cacheKey)) {
    return cached;
  }

  const hadithIndex = (hijriDayOfYear % BUKHARI_HADITH_COUNT) + 1;

  try {
    const [arRes, enRes] = await Promise.all([
      fetchWithExtensionRetry(`${CDN_BASE}/ara-bukhari/${hadithIndex}.min.json`),
      fetchWithExtensionRetry(`${CDN_BASE}/eng-bukhari/${hadithIndex}.min.json`),
    ]);

    const arData = await arRes.json();
    const enData = await enRes.json();

    const result: HadithData = {
      text_ar: arData?.text ?? arData?.hadith_text ?? '',
      text_en: enData?.text ?? enData?.hadith_text ?? '',
      source: 'Sahih Bukhari',
      narrator: enData?.rafi ?? '',
      book: enData?.book ?? 'Sahih Bukhari',
      hadithNumber: hadithIndex,
    };

    cacheStore.set(cacheKey, result, 24 * 60 * 60 * 1000);
    return result;
  } catch (err) {
    if (cached) return cached;

    if (hadithIndex !== 1) {
      try {
        const fallbackResult = await fetchDailyHadithOverride(1, dateScope);
        return fallbackResult;
      } catch {
        // hadith #1 also failed
      }
    }

    if (err instanceof ServiceError) throw err;
    throw new ServiceError('hadith', 'All fetch attempts failed', err);
  }
}

async function fetchDailyHadithOverride(
  hadithNumber: number,
  _dateScope: Date,
): Promise<HadithData> {
  const [arRes, enRes] = await Promise.all([
    fetchWithExtensionRetry(`${CDN_BASE}/ara-bukhari/${hadithNumber}.min.json`),
    fetchWithExtensionRetry(`${CDN_BASE}/eng-bukhari/${hadithNumber}.min.json`),
  ]);

  const arData = await arRes.json();
  const enData = await enRes.json();

  return {
    text_ar: arData?.text ?? arData?.hadith_text ?? '',
    text_en: enData?.text ?? enData?.hadith_text ?? '',
    source: 'Sahih Bukhari',
    narrator: enData?.rafi ?? '',
    book: enData?.book ?? 'Sahih Bukhari',
    hadithNumber,
  };
}
