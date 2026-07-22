import { useMemo } from 'react';
import { useCachedData } from '@/display/hooks/useCachedData';
import { api } from '@/shared/api';
import type { Announcement } from '@/shared/api';
import { useMosqueConfigStore } from '@/display/store/mosqueConfigStore';
import { useLanguageStore } from '@/display/store/languageStore';
import { getTranslations } from '@/display/store/languageStore';

export interface UseAnnouncementsResult {
  announcements: string[];
  isLoading: boolean;
}

export function useAnnouncements(currentTime: Date): UseAnnouncementsResult {
  const masjidId = useMosqueConfigStore((s) => s.masjidId);
  const language = useLanguageStore((s) => s.language);
  const translations = getTranslations(language);

  const { data, isLoading } = useCachedData<Announcement[]>(
    `announcements-${masjidId ?? 'none'}`,
    () => api.listAnnouncements(masjidId ?? ''),
    5 * 60 * 1000,
    { currentTime, fallback: undefined },
  );

  const announcements = useMemo(() => {
    if (!data) return translations.announcementsList;
    const active = data.filter((a) => a.active);
    if (active.length === 0) return translations.announcementsList;
    return active.map((a) => (language === 'ar' ? a.text_ar : a.text_en));
  }, [data, language, translations.announcementsList]);

  return { announcements, isLoading };
}
