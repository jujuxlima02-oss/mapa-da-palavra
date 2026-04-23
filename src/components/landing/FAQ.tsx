"use client"

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { analytics } from "@/lib/analytics";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  label: string;
  questions: FAQItem[];
  supportLinkText: string;
}

export function FAQ({ label, questions, supportLinkText }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    const isOpening = openIndex !== index;
    setOpenIndex(isOpening ? index : null);
    if (isOpening) {
      analytics.trackEvent("select_content", { content_type: "faq", content_id: `faq_${index}` });
    }
  };

  return (
    <section className="bg-[var(--color-surface)] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl divide-y divide-[var(--color-divider)]">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-[var(--color-text)] mb-8">{label}</h2>
          <dl className="mt-10 space-y-6 divide-y divide-[var(--color-divider)]">
            {questions.map((faq, index) => (
              <div key={index} className="pt-6">
                <dt>
                  <button
                    type="button"
                    className="flex w-full items-start justify-between text-left text-[var(--color-text)]"
                    onClick={() => toggle(index)}
                  >
                    <span className="text-base font-semibold leading-7">{faq.question}</span>
                    <span className="ml-6 flex h-7 items-center text-[var(--color-accent)]">
                      {openIndex === index ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </span>
                  </button>
                </dt>
                {openIndex === index && (
                  <dd className="mt-4 pr-12">
                    <p className="text-base leading-7 text-[var(--color-text-muted)]">{faq.answer}</p>
                  </dd>
                )}
              </div>
            ))}
          </dl>
          
          <div className="pt-10 mt-10">
             <Link href="https://wa.me/seunumerodeatendimento">
                <Button variant="ghost" className="text-[var(--color-primary)]">
                   {supportLinkText}
                </Button>
             </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
