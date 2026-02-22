import {useState, useEffect, useRef} from 'react';
import {getCountdown} from '../utils/prayerTimes';

export function useCountdown(targetTime: Date | null): string {
  const [countdown, setCountdown] = useState('--:--:--');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!targetTime) {
      setCountdown('--:--:--');
      return;
    }

    const update = () => {
      setCountdown(getCountdown(targetTime, new Date()));
    };

    update();
    intervalRef.current = setInterval(update, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [targetTime]);

  return countdown;
}
