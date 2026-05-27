import type { HadithData } from '@/app/types/hadith';
import type { QuranVerse } from '@/app/types/quran';

export type WisdomContent =
  | { kind: 'hadith'; data: HadithData }
  | { kind: 'quran'; data: QuranVerse };
