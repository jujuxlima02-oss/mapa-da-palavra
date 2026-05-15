"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { META_PIXEL_ID, flushMetaPixelQueue, trackMetaEvent } from "@/lib/analytics";
import { PRODUCT } from "@/lib/constants";

export function MetaPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!META_PIXEL_ID || !isReady) return;

    flushMetaPixelQueue();
    trackMetaEvent("PageView");

    if (pathname === "/") {
      trackMetaEvent("ViewContent", {
        content_name: "evergreen",
        value: PRODUCT.priceCents / 100,
        currency: "BRL",
      });
    }
  }, [isReady, pathname, search]);

  if (!META_PIXEL_ID) return null;

  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        onReady={() => setIsReady(true)}
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
          `,
        }}
      />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
