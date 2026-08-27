import { useState, useEffect, useRef } from 'react';
import type { PrayerTime } from '@/shared/types';
import {
  FUNDRAISING_PRAYER_GAP_SECONDS,
  getRandomFundraisingDelay,
} from '@/display/constants';
import { getTimeToNextPrayer } from '@/display/utils';
import { useMosqueConfigStore } from '@/display/store';

interface FundraisingSchedulerResult {
  showFundraising: boolean;
  onShowFundraising: () => void;
  onCloseFundraising: () => void;
}

export function useFundraisingScheduler(
  prayers: PrayerTime[],
  currentTime: Date,
): FundraisingSchedulerResult {
  const timeZone = useMosqueConfigStore((s) => s.config.timeZone);
  const [showFundraising, setShowFundraising] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onShowRef = useRef<() => void>(() => setShowFundraising(true));
  const onCloseRef = useRef<() => void>(() => setShowFundraising(false));

  // LIVE REFS — the schedule loop must not restart whenever `prayers` gets a new
  // array identity each clock tick; otherwise the pending timeout is cleared
  // every second and the overlay never fires.
  const prayersRef = useRef(prayers);
  prayersRef.current = prayers;
  const timeRef = useRef(currentTime);
  timeRef.current = currentTime;

  useEffect(() => {
    const schedule = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        if (
          getTimeToNextPrayer(prayersRef.current, timeRef.current, timeZone) >
          FUNDRAISING_PRAYER_GAP_SECONDS
        ) {
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
  }, [timeZone]);

  return {
    showFundraising,
    onShowFundraising: onShowRef.current,
    onCloseFundraising: onCloseRef.current,
  };
}
