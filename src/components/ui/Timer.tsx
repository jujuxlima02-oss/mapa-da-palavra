"use client";

import { useState, useEffect } from "react";

interface TimerProps {
  expiresAt: string | Date;
  onExpired: () => void;
}

export function Timer({ expiresAt, onExpired }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const targetDate = new Date(expiresAt).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        setTimeLeft("00:00");
        onExpired();
        return false;
      }

      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      const formattedMinutes = minutes.toString().padStart(2, "0");
      const formattedSeconds = seconds.toString().padStart(2, "0");

      setTimeLeft(`${formattedMinutes}:${formattedSeconds}`);
      return true;
    };

    // Calculate immediately so it doesn't blink or delay 1s to render
    const isActive = updateTimer();

    if (!isActive) return;

    const intervalId = setInterval(() => {
      if (!updateTimer()) {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [expiresAt, onExpired]);

  return (
    <span className="font-mono font-bold tracking-widest bg-red-100 text-red-700 px-3 py-1 rounded-md">
      {timeLeft}
    </span>
  );
}
