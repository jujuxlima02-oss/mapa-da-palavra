"use client";

import type { ComponentProps } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { buildCheckoutHref } from "@/lib/campaignParams";

type CampaignCheckoutLinkProps = Omit<
  ComponentProps<typeof Link>,
  "href"
> & {
  offerSource: string;
};

export function CampaignCheckoutLink({
  offerSource,
  onClick,
  ...props
}: CampaignCheckoutLinkProps) {
  const [href, setHref] = useState(() => buildCheckoutHref(offerSource));

  useEffect(() => {
    setHref(buildCheckoutHref(offerSource, window.location.search));
  }, [offerSource]);

  return (
    <Link
      {...props}
      href={href}
      onClick={(event) => {
        const nextHref = buildCheckoutHref(offerSource, window.location.search);
        event.currentTarget.href = nextHref;
        setHref(nextHref);
        onClick?.(event);
      }}
    />
  );
}
