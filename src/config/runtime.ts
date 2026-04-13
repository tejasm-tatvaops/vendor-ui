const getEnv = (key: string): string | undefined => {
  const value = process.env[key];
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
};

export const runtimeConfig = {
  defaultVendorId: getEnv("NEXT_PUBLIC_VENDOR_ID"),
  bookSiteVisitUrl: getEnv("NEXT_PUBLIC_BOOK_SITE_VISIT_URL"),
  contactTatvaopsUrl: getEnv("NEXT_PUBLIC_CONTACT_TATVAOPS_URL")
};

export const resolveVendorId = (): string | undefined => {
  if (typeof window === "undefined") {
    return runtimeConfig.defaultVendorId;
  }
  const params = new URLSearchParams(window.location.search);
  const queryVendorId = params.get("vendorId")?.trim();
  return queryVendorId || runtimeConfig.defaultVendorId;
};
