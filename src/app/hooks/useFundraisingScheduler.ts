import { useState, useEffect, useRef } from 'react';
import type { PrayerTime } from '@/app/types/prayer';
import {
  FUNDRAISING_PRAYER_GAP_SECONDS,
  getRandomFundraisingDelay,
} from '@/app/constants/timings';
import { getTimeToNextPrayer } from '@/app/utils/prayerTimes';

interface FundraisingSchedulerResult {
  showFundraising: boolean;
  onShowFundraising: () => void;
  onCloseFundraising: () => void;
}

export function useFundraisingScheduler(
  prayers: PrayerTime[],
  _currentTime: Date,
): FundraisingSchedulerResult {
  const [showFundraising, setShowFundraising] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onShowRef = useRef<() => void>(() => setShowFundraising(true));
  const onCloseRef = useRef<() => void>(() => setShowFundraising(false));

  useEffect(() => {
    const schedule = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        if (getTimeToNextPrayer(prayers, new Date()) > FUNDRAISING_PRAYER_GAP_SECONDS) {
          onShowRef.current();
        }
        schedule();
      }, getRandomFundraisingDelay());
    };

    schedule();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [prayers]);

  return {
    showFundraising,
    onShowFundraising: onShowRef.current,
    onCloseFundraising: onCloseRef.current,
  };
}
