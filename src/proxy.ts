import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (pathname === "/dia-das-maes") {
    const endDateStr = process.env.SEASONAL_CAMPAIGN_END_DATE;

    if (endDateStr) {
      const endDate = new Date(endDateStr);
      const now = new Date();

      if (now > endDate) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  if (pathname === "/checkout" && !searchParams.has("offer")) {
    const clonedUrl = request.nextUrl.clone();
    clonedUrl.searchParams.set("offer", "evergreen");
    return NextResponse.redirect(clonedUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dia-das-maes", "/checkout"],
};
