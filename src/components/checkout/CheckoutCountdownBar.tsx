"use client";

import { useEffect, useState } from "react";

function getTodayDayMonth() {
  return new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}

interface CheckoutCountdownBarProps {
  useDynamicDate?: boolean;
}

export function CheckoutCountdownBar({ useDynamicDate = false }: CheckoutCountdownBarProps) {
  const [offerDate, setOfferDate] = useState(getTodayDayMonth);
  const dateText = useDynamicDate ? offerDate : "27/04";

  useEffect(() => {
    if (!useDynamicDate) return;

    const interval = window.setInterval(() => {
      setOfferDate(getTodayDayMonth());
    }, 60000);

    return () => window.clearInterval(interval);
  }, [useDynamicDate]);

  return (
    <div className="sticky top-0 z-40 w-full bg-[var(--color-dark-section)] px-4 py-2 text-center text-sm font-semibold text-white shadow-sm">
      Oferta válida até às 23:59 do dia <span suppressHydrationWarning>{dateText}</span>.
    </div>
  );
}
