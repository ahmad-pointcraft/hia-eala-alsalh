import { useState, useEffect } from 'react';
import { useMosqueConfigStore } from '@/app/store/mosqueConfigStore';

interface ClockState {
  currentTime: Date;
}

export function useClock(): ClockState {
  const clockOffsetMs = useMosqueConfigStore((s) => s.config.clockOffsetMs);
  const [currentTime, setCurrentTime] = useState(
    () => new Date(Date.now() + clockOffsetMs),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date(Date.now() + clockOffsetMs));
    }, 1000);
    return () => clearInterval(timer);
  }, [clockOffsetMs]);

  return { currentTime };
}
