// src/hooks/useCountdown.ts
import { useState, useEffect } from 'react';

interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isTimeUp: boolean;
}

export const useCountdown = (targetDate: string): CountdownState => {
  const countDownDate = new Date(targetDate).getTime();

  const [countDown, setCountDown] = useState<number>(
    countDownDate - new Date().getTime()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [countDownDate]);

  const isTimeUp = countDown < 0;

  if (isTimeUp) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isTimeUp: true };
  }

  return {
    days: Math.floor(countDown / (1000 * 60 * 60 * 24)),
    hours: Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((countDown % (1000 * 60)) / 1000),
    isTimeUp: false,
  };
};