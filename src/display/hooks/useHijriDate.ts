import { useMemo, useEffect } from 'react';
import { useCachedData } from '@/display/hooks/useCachedData';
import { fetchHijriDate } from '@/display/services/aladhan';
import { computeHijriDate } from '@/display/utils/hijri';
import { useMosqueConfigStore } from '@/display/store/mosqueConfigStore';
import { adhanMethodToAladhanId } from '@/display/utils/adhanMethodFactory';
import type { HijriDateInfo } from '@/shared/types/mosqueConfig';

export interface UseHijriDateResult {
  hijriDate: HijriDateInfo;
  holidays: string[];
  isLoading: boolean;
}

function applyHijriOffset(
  base: { day: number; month: number; year: number },
  offset: number,
): { day: number; month: number; year: number } {
  if (offset === 0) return base;

  let { day, month, year } = base;
  day += offset;

  const monthLength = (m: number) => (m % 2 === 1 ? 30 : 29);

  while (day > monthLength(month)) {
    day -= monthLength(month);
    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
  }

  while (day < 1) {
    month--;
    if (month < 1) {
      month = 12;
      year--;
    }
    day += monthLength(month);
  }

  return { day, month, year };
}

function formatHijri(info: {
  day: number;
  month: number;
  monthName_en: string;
  monthName_ar: string;
  year: number;
}): { formatted_en: string; formatted_ar: string } {
  return {
    formatted_en: `${info.day} ${info.monthName_en} ${info.year}`,
    formatted_ar: `${info.day} ${info.monthName_ar} ${info.year}`,
  };
}

const HIJRI_MONTHS_EN = [
  'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani",
  'Jumada al-Ula', 'Jumada al-Thania', 'Rajab', "Sha'ban",
  'Ramadan', 'Shawwal', "Dhul Qi'dah", 'Dhul Hijjah',
];

const HIJRI_MONTHS_AR = [
  '\u0645\u062D\u0631\u0645', '\u0635\u0641\u0631', '\u0631\u0628\u064A\u0639 \u0627\u0644\u0623\u0648\u0644', '\u0631\u0628\u064A\u0639 \u0627\u0644\u062B\u0627\u0646\u064A',
  '\u062C\u0645\u0627\u062F\u0649 \u0627\u0644\u0623\u0648\u0644\u0649', '\u062C\u0645\u0627\u062F\u0649 \u0627\u0644\u062B\u0627\u0646\u064A\u0629', '\u0631\u062C\u0628', '\u0634\u0639\u0628\u0627\u0646',
  '\u0631\u0645\u0636\u0627\u0646', '\u0634\u0648\u0627\u0644', '\u0630\u0648 \u0627\u0644\u0642\u0639\u062F\u0629', '\u0630\u0648 \u0627\u0644\u062D\u062C\u0629',
];

export function useHijriDate(currentTime: Date): UseHijriDateResult {
  const config = useMosqueConfigStore((s) => s.config);
  const setConfig = useMosqueConfigStore((s) => s.setConfig);

  const aladhanMethod = useMemo(
    () => adhanMethodToAladhanId(config.calculationMethod),
    [config.calculationMethod],
  );

  const { data, isLoading } = useCachedData(
    'aladhan',
    () =>
      fetchHijriDate({
        latitude: config.latitude,
        longitude: config.longitude,
        method: aladhanMethod,
        date: currentTime,
      }),
    24 * 60 * 60 * 1000,
    { dateScoped: true, currentTime },
  );

  const result = useMemo(() => {
    if (data) {
      const offsetApplied = applyHijriOffset(
        { day: data.hijri.day, month: data.hijri.month, year: data.hijri.year },
        config.hijriOffset,
      );

      const monthChanged = offsetApplied.month !== data.hijri.month;
      const monthName_en = monthChanged
        ? (HIJRI_MONTHS_EN[offsetApplied.month - 1] ?? data.hijri.monthName_en)
        : data.hijri.monthName_en;
      const monthName_ar = monthChanged
        ? (HIJRI_MONTHS_AR[offsetApplied.month - 1] ?? data.hijri.monthName_ar)
        : data.hijri.monthName_ar;

      const hijri: HijriDateInfo = {
        ...offsetApplied,
        monthName_en,
        monthName_ar,
        weekday_en: data.hijri.weekday_en,
        weekday_ar: data.hijri.weekday_ar,
        formatted_en: `${offsetApplied.day} ${monthName_en} ${offsetApplied.year}`,
        formatted_ar: `${offsetApplied.day} ${monthName_ar} ${offsetApplied.year}`,
      };

      return { hijriDate: hijri, holidays: data.holidays };
    }

    const fallback = computeHijriDate(currentTime);
    const offsetApplied = applyHijriOffset(fallback, config.hijriOffset);

    const hijri: HijriDateInfo = {
      ...offsetApplied,
      monthName_en: HIJRI_MONTHS_EN[offsetApplied.month - 1] ?? '',
      monthName_ar: HIJRI_MONTHS_AR[offsetApplied.month - 1] ?? '',
      weekday_en: '',
      weekday_ar: '',
      ...formatHijri({
        ...offsetApplied,
        monthName_en: HIJRI_MONTHS_EN[offsetApplied.month - 1] ?? '',
        monthName_ar: HIJRI_MONTHS_AR[offsetApplied.month - 1] ?? '',
      }),
    };

    return { hijriDate: hijri, holidays: [] };
  }, [data, config.hijriOffset, currentTime]);

  const clockOffsetMs = data?.clockOffsetMs;
  useEffect(() => {
    if (clockOffsetMs !== undefined && clockOffsetMs !== 0 && clockOffsetMs !== config.clockOffsetMs) {
      setConfig({ clockOffsetMs });
    }
  }, [clockOffsetMs, config.clockOffsetMs, setConfig]);

  return { ...result, isLoading };
}
