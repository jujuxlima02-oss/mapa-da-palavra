"use client";

import React from "react";

interface UrgencyBarProps {
  text: string;
}

export function UrgencyBar({ text }: UrgencyBarProps) {
  return (
    <div className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-center text-center">
          <p className="text-[var(--color-text-inverse)] font-medium text-sm sm:text-base">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}
