import { BUKHARI_HADITH_COUNT } from '@/app/types/hadith';
import type { HadithData } from '@/app/types/hadith';
import { ServiceError } from './ServiceError';

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

function cleanArabicHadith(text: string): string {
  if (!text) return '';

  const prophetSpeechRegex = /(?:صَلَّى\s+اللَّهُ\s+عَلَيْهِ\s+وَسَلَّمَ|صلى\s+الله\s+عليه\s+وسلم)\s*(?:قَالَ|يَقُولُ|قَالَتْ|قال|يقول|قالت)\s*[:：\s]*[""«]?/;

  const match = text.match(prophetSpeechRegex);
  if (match && match.index !== undefined) {
    let clean = text.substring(match.index + match[0].length).trim();
    if (clean.startsWith('"') || clean.startsWith('\u201C') || clean.startsWith('\u00AB')) {
      clean = clean.substring(1).trim();
    }
    if (clean.endsWith('"') || clean.endsWith('\u201D') || clean.endsWith('\u00BB')) {
      clean = clean.substring(0, clean.length - 1).trim();
    }
    return clean;
  }

  const quoteIndex = text.indexOf('"');
  if (quoteIndex !== -1) {
    let clean = text.substring(quoteIndex + 1).trim();
    const endQuoteIndex = clean.lastIndexOf('"');
    if (endQuoteIndex !== -1) {
      clean = clean.substring(0, endQuoteIndex).trim();
    }
    if (clean.length > 10) return clean;
  }

  return text;
}

function cleanEnglishHadith(text: string): string {
  if (!text) return '';

  const prophetPatterns = [
    /The Prophet\s*(?:\([^)]+\))?\s*said\s*[:：\s]*[""«]?/i,
    /Allah's Messenger\s*(?:\([^)]+\))?\s*said\s*[:：\s]*[""«]?/i,
    /Messenger of Allah\s*(?:\([^)]+\))?\s*said\s*[:：\s]*[""«]?/i,
    /he heard the Prophet\s*(?:\([^)]+\))?\s*saying\s*[:：\s]*[""«]?/i
  ];

  for (const pattern of prophetPatterns) {
    const match = text.match(pattern);
    if (match && match.index !== undefined) {
      let clean = text.substring(match.index + match[0].length).trim();
      if (clean.startsWith('"') || clean.startsWith('\u201C') || clean.startsWith('\u00AB')) {
        clean = clean.substring(1).trim();
      }
      if (clean.endsWith('"') || clean.endsWith('\u201D') || clean.endsWith('\u00BB')) {
        clean = clean.substring(0, clean.length - 1).trim();
      }
      return clean;
    }
  }

  const narratedMatch = text.match(/^Narrated [^:]+:\s*(.*)$/i);
  if (narratedMatch && narratedMatch[1]) {
    let clean = narratedMatch[1].trim();
    if (clean.startsWith('"') || clean.startsWith('\u201C')) {
      clean = clean.substring(1).trim();
    }
    if (clean.endsWith('"') || clean.endsWith('\u201D')) {
      clean = clean.substring(0, clean.length - 1).trim();
    }
    return clean;
  }

  return text;
}

async function fetchSingleHadith(hadithNumber: number): Promise<HadithData> {
  const [arRes, enRes] = await Promise.all([
    fetchWithExtensionRetry(`${CDN_BASE}/ara-bukhari/${hadithNumber}.min.json`),
    fetchWithExtensionRetry(`${CDN_BASE}/eng-bukhari/${hadithNumber}.min.json`),
  ]);

  const arData = await arRes.json();
  const enData = await enRes.json();

  const arHadith = arData?.hadiths?.[0];
  const enHadith = enData?.hadiths?.[0];

  const rawTextAr = arHadith?.text ?? arData?.text ?? arData?.hadith_text ?? '';
  const rawTextEn = enHadith?.text ?? enData?.text ?? enData?.hadith_text ?? '';

  return {
    text_ar: cleanArabicHadith(rawTextAr),
    text_en: cleanEnglishHadith(rawTextEn),
    source: 'Sahih Bukhari',
    narrator: enHadith?.narrator ?? enData?.rafi ?? '',
    book: enHadith?.book ?? enData?.book ?? 'Sahih Bukhari',
    hadithNumber,
  };
}

export async function fetchDailyHadith(
  hijriDayOfYear: number,
): Promise<HadithData> {
  let attempt = 0;
  let hadithIndex = (hijriDayOfYear % BUKHARI_HADITH_COUNT) + 1;

  while (attempt < 10) {
    try {
      const [arRes, enRes] = await Promise.all([
        fetchWithExtensionRetry(`${CDN_BASE}/ara-bukhari/${hadithIndex}.min.json`),
        fetchWithExtensionRetry(`${CDN_BASE}/eng-bukhari/${hadithIndex}.min.json`),
      ]);

      const arData = await arRes.json();
      const enData = await enRes.json();

      const arHadith = arData?.hadiths?.[0];
      const enHadith = enData?.hadiths?.[0];

      const rawTextAr = arHadith?.text ?? arData?.text ?? arData?.hadith_text ?? '';
      const rawTextEn = enHadith?.text ?? enData?.text ?? enData?.hadith_text ?? '';

      const cleanTextAr = cleanArabicHadith(rawTextAr);
      const cleanTextEn = cleanEnglishHadith(rawTextEn);

      if (cleanTextAr && cleanTextAr.length <= 250 && cleanTextEn && cleanTextEn.length <= 350) {
        return {
          text_ar: cleanTextAr,
          text_en: cleanTextEn,
          source: 'Sahih Bukhari',
          narrator: enHadith?.narrator ?? enData?.rafi ?? '',
          book: enHadith?.book ?? enData?.book ?? 'Sahih Bukhari',
          hadithNumber: hadithIndex,
        };
      }
    } catch {
      // try next index
    }

    hadithIndex = (hadithIndex % BUKHARI_HADITH_COUNT) + 1;
    attempt++;
  }

  try {
    return await fetchSingleHadith(1);
  } catch (err) {
    if (err instanceof ServiceError) throw err;
    throw new ServiceError('hadith', 'All Hadith fetch attempts failed', err);
  }
}
