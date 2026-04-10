const getEnv = (key: string): string | undefined => {
  const value = import.meta.env[key];
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
};

export const runtimeConfig = {
  defaultVendorId: getEnv("VITE_VENDOR_ID"),
  bookSiteVisitUrl: getEnv("VITE_BOOK_SITE_VISIT_URL"),
  contactTatvaopsUrl: getEnv("VITE_CONTACT_TATVAOPS_URL")
};

export const resolveVendorId = (): string | undefined => {
  const params = new URLSearchParams(window.location.search);
  const queryVendorId = params.get("vendorId")?.trim();
  return queryVendorId || runtimeConfig.defaultVendorId;
};
