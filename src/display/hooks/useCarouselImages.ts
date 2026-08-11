import { useCachedData } from '@/display/hooks/useCachedData';
import { api } from '@/shared/api';
import type { StoredImage } from '@/shared/api';
import { useMosqueConfigStore } from '@/display/store/mosqueConfigStore';

export interface UseCarouselImagesResult {
  carouselImages: string[];
  isLoading: boolean;
}

// CAROUSEL IMAGES — polls api.listImages('carousel'); display falls back to
// static imports when empty (Article VII). Consistent with the other content
// hooks (announcements/events/donations) — re-fetches via TTL.
export function useCarouselImages(currentTime: Date): UseCarouselImagesResult {
  const masjidId = useMosqueConfigStore((s) => s.masjidId);

  const { data, isLoading } = useCachedData<StoredImage[]>(
    `images-carousel-${masjidId ?? 'none'}`,
    () => api.listImages(masjidId ?? '', 'carousel'),
    5 * 60 * 1000,
    { currentTime, fallback: undefined },
  );

  const carouselImages = (data ?? [])
    .filter((i) => i.kind === 'carousel')
    .sort((a, b) => a.order - b.order)
    .map((i) => i.url);

  return { carouselImages, isLoading };
}
