// hooks/Balance/useCountdown.ts
import { useState, useEffect } from 'react';

export const useCountdown = (targetDate: Date | null) => {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  useEffect(() => {
    if (!targetDate) {
      setTimeLeft(null);
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft(null);
        return false;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
          .toString()
          .padStart(2, '0')}`,
      );
      return true;
    };

    if (calculateTimeLeft()) {
      const interval = setInterval(calculateTimeLeft, 1000);
      return () => clearInterval(interval);
    }
  }, [targetDate]);

  return timeLeft;
};
