import { useState, useEffect } from 'react';

interface ClockState {
  currentTime: Date;
}

export function useClock(): ClockState {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return { currentTime };
}
