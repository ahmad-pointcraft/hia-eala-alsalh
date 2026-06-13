import { useState, useEffect } from 'react';
import { useMosqueConfigStore } from '@/app/store/mosqueConfigStore';

interface ClockState {
  currentTime: Date;
}

export function useClock(): ClockState {
  const clockOffsetMs = useMosqueConfigStore((s) => s.config.clockOffsetMs);
  const mockClockOffsetMs = useMosqueConfigStore((s) => s.mockClockOffsetMs || 0);

  const [currentTime, setCurrentTime] = useState(
    () => new Date(Date.now() + clockOffsetMs + mockClockOffsetMs),
  );

  // UPDATE CURRENT TIME INSTANTLY WHEN OFFSETS CHANGE
  useEffect(() => {
    setCurrentTime(new Date(Date.now() + clockOffsetMs + mockClockOffsetMs));
  }, [clockOffsetMs, mockClockOffsetMs]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date(Date.now() + clockOffsetMs + mockClockOffsetMs));
    }, 1000);
    return () => clearInterval(timer);
  }, [clockOffsetMs, mockClockOffsetMs]);

  return { currentTime };
}
