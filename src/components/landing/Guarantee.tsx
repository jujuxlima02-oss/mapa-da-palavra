"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

interface GuaranteeProps {
  label: string;
  text: string;
  linkText: string;
}

export function Guarantee({ label, text, linkText }: GuaranteeProps) {
  return (
    <section className="bg-[var(--color-bg)] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center bg-[var(--color-surface)] rounded-2xl p-8 sm:p-12 border border-[var(--color-border)]">
          <ShieldCheck className="mx-auto h-12 w-12 text-[var(--color-accent)] mb-4" />
          <h2 className="text-xl font-bold tracking-tight text-[var(--color-text)] mb-4">
            {label}
          </h2>
          <p className="text-base leading-7 text-[var(--color-text-muted)] mb-6">
            {text}
          </p>
          <Link href="/politica-de-garantia" className="inline-flex min-h-11 items-center justify-center text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">
            {linkText} &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
