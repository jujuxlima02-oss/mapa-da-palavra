export function buildCheckoutHref(
  offerSource: string,
  currentParams?: URLSearchParams | string | null
): string {
  const checkoutParams = new URLSearchParams();
  checkoutParams.set("offer", offerSource);

  const sourceParams =
    typeof currentParams === "string"
      ? new URLSearchParams(currentParams)
      : currentParams;

  sourceParams?.forEach((value, key) => {
    if (key.toLowerCase().startsWith("utm_")) {
      checkoutParams.set(key, value);
    }
  });

  return `/checkout?${checkoutParams.toString()}`;
}
