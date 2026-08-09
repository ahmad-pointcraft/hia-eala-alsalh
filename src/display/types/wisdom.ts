import type { HadithData } from './hadith';
import type { QuranVerse } from './quran';

export type WisdomContent =
  | { kind: 'hadith'; data: HadithData }
  | { kind: 'quran'; data: QuranVerse };
