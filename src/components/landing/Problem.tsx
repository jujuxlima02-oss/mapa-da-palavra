"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { CampaignCheckoutLink } from "@/components/landing/CampaignCheckoutLink";
import { analytics } from "@/lib/analytics";
import type { OfferSource } from "@/lib/constants";

interface ProblemImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface ProblemProps {
  label: string;
  texts: string[];
  ctaText: string;
  offerSource: OfferSource;
  image?: ProblemImage;
}

export function Problem({ label, texts, ctaText, offerSource, image }: ProblemProps) {
  return (
    <section className="py-20 bg-[var(--color-dark-section)] text-[var(--color-dark-text)] relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-[var(--color-accent)] rounded-full opacity-20 blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-3xl">
          {image && (
            <div className="mb-8 bg-[var(--color-dark-section)]">
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                loading="lazy"
                className="object-contain sm:object-cover w-full h-auto sm:h-full"
                quality={72}
              />
            </div>
          )}
          <h2 className="text-sm font-semibold tracking-wide uppercase text-[var(--color-accent)] mb-6 font-mono">
            {label}
          </h2>
          <div className="space-y-6 text-lg sm:text-xl text-[var(--color-dark-text)]/80 font-medium">
            {texts.map((paragraph, index) => (
              <p key={index} className={index === texts.length - 1 ? "text-white" : ""}>
                {paragraph}
              </p>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <CampaignCheckoutLink offerSource={offerSource}>
              <Button 
                variant="default" 
                size="lg"
                className="w-full px-6 sm:w-auto sm:px-6"
                onClick={() => analytics.ctaClick(offerSource, "problem_section")}
              >
                {ctaText}
              </Button>
            </CampaignCheckoutLink>
          </div>
        </div>
      </div>
    </section>
  );
}
