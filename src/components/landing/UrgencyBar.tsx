"use client";

import React from "react";
import { CampaignCheckoutLink } from "@/components/landing/CampaignCheckoutLink";
import { analytics } from "@/lib/analytics";
import type { OfferSource } from "@/lib/constants";

interface UrgencyBarProps {
  text: string;
  ctaText: string;
  offerSource: OfferSource;
}

export function UrgencyBar({ text, ctaText, offerSource }: UrgencyBarProps) {
  return (
    <div className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-center">
          <p className="text-[var(--color-text-inverse)] font-medium text-sm sm:text-base">
            {text}
          </p>
          <CampaignCheckoutLink offerSource={offerSource}>
             <button 
                onClick={() => {
                analytics.trackEvent("select_promotion");
                analytics.ctaClick(offerSource, "urgency_bar");
                }}
                className="whitespace-nowrap text-xs uppercase tracking-wider font-bold bg-[var(--color-surface-2)] text-[var(--color-primary)] px-3 py-1.5 rounded-full hover:bg-[var(--color-surface)] transition-colors"
                style={{ fontSize: "0.70rem" }}
             >
                {ctaText}
             </button>
          </CampaignCheckoutLink>
        </div>
      </div>
    </div>
  );
}
