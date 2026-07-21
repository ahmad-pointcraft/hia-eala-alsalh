import type { HadithData } from '@/display/types/hadith';
import type { QuranVerse } from '@/display/types/quran';

export type WisdomContent =
  | { kind: 'hadith'; data: HadithData }
  | { kind: 'quran'; data: QuranVerse };
