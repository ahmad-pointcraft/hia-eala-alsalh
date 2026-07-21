import { useMemo } from 'react';
import { useCachedData } from '@/display/hooks/useCachedData';
import { fetchFundraising } from '@/display/services/googleSheets';
import { useMosqueConfigStore } from '@/display/store/mosqueConfigStore';
import { useLanguageStore } from '@/display/store/languageStore';
import { getTranslations } from '@/display/store/languageStore';
import type { SheetFundraising } from '@/display/types/googleSheets';
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

const FALLBACK_COLLECTED = 87500;
const FALLBACK_GOAL = 120000;
const FALLBACK_DONORS = 243;

export function useFundraising(currentTime: Date): UseFundraisingResult {
  const config = useMosqueConfigStore((s) => s.config);
  const language = useLanguageStore((s) => s.language);
  const translations = getTranslations(language);

  const { data, isLoading } = useCachedData<SheetFundraising[]>(
    'fundraising',
    () => fetchFundraising(config.googleSheetId, config.fundraisingGid),
    5 * 60 * 1000,
    { currentTime, fallback: undefined },
  );

  const fundraising = useMemo((): FundraisingData => {
    if (!data) {
      return {
        title: translations.fundraising.title,
        description: translations.fundraising.description,
        collected: FALLBACK_COLLECTED,
        goal: FALLBACK_GOAL,
        donors: FALLBACK_DONORS,
        donateUrl: '',
        qrImageUrl: qrDonateImage as string,
      };
    }

    const active = data.filter((f) => f.active);
    if (active.length === 0) {
      return {
        title: translations.fundraising.title,
        description: translations.fundraising.description,
        collected: FALLBACK_COLLECTED,
        goal: FALLBACK_GOAL,
        donors: FALLBACK_DONORS,
        donateUrl: '',
        qrImageUrl: qrDonateImage as string,
      };
    }

    const campaign = active[0]!;
    return {
      title: language === 'ar' ? campaign.title_ar : campaign.title_en,
      description: language === 'ar' ? campaign.description_ar : campaign.description_en,
      collected: campaign.collected,
      goal: campaign.goal,
      donors: campaign.donors,
      donateUrl: campaign.donate_url,
      qrImageUrl: campaign.qr_image_url,
    };
  }, [data, language, translations.fundraising]);

  return { fundraising, isLoading };
}
