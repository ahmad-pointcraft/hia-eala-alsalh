import { useMemo } from 'react';
import { useCachedData } from '@/display/hooks/useCachedData';
import { api } from '@/shared/api';
import type { DonationCampaign } from '@/shared/api';
import { useMosqueConfigStore } from '@/display/store/mosqueConfigStore';
import { useLanguageStore } from '@/display/store/languageStore';
import { getTranslations } from '@/display/store/languageStore';
import qrDonateImage from '@/assets/qr-donate.svg';

export interface FundraisingData {
  title: string;
  description: string;
  collected: number;
  goal: number;
  donors: number;
  donateUrl: string;
  qrImageUrl: string;
}

export interface UseFundraisingResult {
  fundraising: FundraisingData;
  isLoading: boolean;
}

const FALLBACK_DONORS = 0;

function fallbackFundraising(
  title: string,
  description: string,
  collected: number,
  goal: number,
): FundraisingData {
  return {
    title,
    description,
    collected,
    goal,
    donors: FALLBACK_DONORS,
    donateUrl: '',
    qrImageUrl: qrDonateImage as string,
  };
}

export function useFundraising(currentTime: Date): UseFundraisingResult {
  const masjidId = useMosqueConfigStore((s) => s.masjidId);
  const language = useLanguageStore((s) => s.language);
  const translations = getTranslations(language);

  const { data, isLoading } = useCachedData<DonationCampaign[]>(
    `donations-${masjidId ?? 'none'}`,
    () => api.listDonations(masjidId ?? ''),
    5 * 60 * 1000,
    { currentTime, fallback: undefined },
  );

  const fundraising = useMemo((): FundraisingData => {
    if (!data) {
      return fallbackFundraising(
        translations.fundraising.title,
        translations.fundraising.description,
        0,
        0,
      );
    }

    const active = data.filter((f) => f.active);
    if (active.length === 0) {
      return fallbackFundraising(
        translations.fundraising.title,
        translations.fundraising.description,
        0,
        0,
      );
    }

    const campaign = active[0]!;
    return {
      title: language === 'ar' ? campaign.title_ar : campaign.title_en,
      description: '',
      collected: campaign.collected,
      goal: campaign.goal,
      donors: FALLBACK_DONORS,
      donateUrl: '',
      qrImageUrl: qrDonateImage as string,
    };
  }, [data, language, translations.fundraising]);

  return { fundraising, isLoading };
}
