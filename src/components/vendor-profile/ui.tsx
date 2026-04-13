import axios, { isAxiosError } from "axios";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

export const cardClassName =
  "rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm transition-all duration-300 hover:shadow-md";

/** Default TatvaOps internal brand API; override with `NEXT_PUBLIC_TATVAOPS_VENDOR_BRAND_URL` (full URL). */
export function getDefaultVendorBrandApiUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_TATVAOPS_VENDOR_BRAND_URL;
  if (typeof fromEnv === "string" && fromEnv.trim().length > 0) {
    return fromEnv.trim();
  }
  const path = "/vendor/api/vendor/internal/brand/69ba63cec205a63d3ff11d5f";
  return `https://devapi.tatvaops.com${path}`;
}

export type TatvaVendorBrandApiPayload = {
  vendor?: unknown;
  services?: unknown;
  portfolios?: unknown;
};

type VendorBrandApiPanelProps = {
  /** Full GET URL; defaults to TatvaOps dev internal brand endpoint (or proxied path in dev). */
  apiUrl?: string;
  className?: string;
};

type LoadState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; payload: TatvaVendorBrandApiPayload }
  | { status: "error"; message: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function pickString(...candidates: unknown[]): string | undefined {
  for (const c of candidates) {
    if (typeof c === "string" && c.trim().length > 0) return c.trim();
  }
  return undefined;
}

/** API may return `{ url: string }` or a plain URL string. */
function extractUrlFromProfileImageField(value: unknown): string | undefined {
  if (typeof value === "string") {
    const t = value.trim();
    return t.length > 0 ? t : undefined;
  }
  if (!isRecord(value)) return undefined;
  const raw = value.url;
  if (typeof raw !== "string") return undefined;
  const t = raw.trim();
  return t.length > 0 ? t : undefined;
}

function pickProfileImage(vendor: Record<string, unknown>): string | undefined {
  const fromNested =
    extractUrlFromProfileImageField(vendor.profileImage) ??
    extractUrlFromProfileImageField(vendor.profile_image);
  if (fromNested) return fromNested;

  return pickString(
    vendor.profilePhoto,
    vendor.profile_photo,
    vendor.image,
    vendor.photo,
    vendor.avatar,
    vendor.logo,
    vendor.logoUrl,
    vendor.logo_url
  );
}

const BRAND_AVATAR_PLACEHOLDER_SRC = "/vendor_image.png";

function isValidHttpUrlCandidate(value: string): boolean {
  const t = value.trim();
  if (!t) return false;
  try {
    const u = new URL(t);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function normalizeVendorFromApi(vendor: unknown): {
  fullName: string;
  companyName: string;
  profileImageUrl?: string;
} {
  if (!isRecord(vendor)) {
    return { fullName: "—", companyName: "—", profileImageUrl: undefined };
  }
  const fullName =
    pickString(vendor.fullName, vendor.full_name, vendor.name, vendor.displayName, vendor.display_name) ?? "—";
  const companyName =
    pickString(
      vendor.companyName,
      vendor.company_name,
      vendor.legalName,
      vendor.legal_name,
      vendor.company,
      vendor.businessName,
      vendor.business_name
    ) ?? "—";
  return { fullName, companyName, profileImageUrl: pickProfileImage(vendor) };
}

function normalizeServiceLabel(entry: unknown): string {
  if (typeof entry === "string" && entry.trim()) return entry.trim();
  if (!isRecord(entry)) return "Service";
  return (
    pickString(
      entry.name,
      entry.title,
      entry.serviceName,
      entry.service_name,
      entry.label,
      entry.service,
      entry.description
    ) ?? "Service"
  );
}

function normalizePortfolioLabel(entry: unknown): string {
  if (typeof entry === "string" && entry.trim()) return entry.trim();
  if (!isRecord(entry)) return "Portfolio";
  return (
    pickString(entry.title, entry.name, entry.projectName, entry.project_name, entry.projectTitle, entry.project_title) ??
    "Portfolio"
  );
}

function toArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  return [];
}

type BrandPortfolioImageEntry = { url: string; label: string };

function extractHttpUrlString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const t = value.trim();
  if (!t || !isValidHttpUrlCandidate(t)) return undefined;
  return t;
}

/**
 * Image URLs from brand API shape: each portfolio may contain nested `portfolios[]` with `url`.
 * Also picks a parent-level `url` when present (deduped).
 */
function extractBrandPortfolioImages(portfoliosRoot: unknown): BrandPortfolioImageEntry[] {
  const items = toArray(portfoliosRoot);
  const seen = new Set<string>();
  const result: BrandPortfolioImageEntry[] = [];

  for (const raw of items) {
    if (!isRecord(raw)) continue;
    const label = normalizePortfolioLabel(raw);

    const nested = raw.portfolios;
    if (Array.isArray(nested)) {
      for (const entry of nested) {
        if (!isRecord(entry)) continue;
        const url = extractHttpUrlString(entry.url);
        if (!url || seen.has(url)) continue;
        seen.add(url);
        const innerLabel = pickString(entry.title, entry.name, entry.caption, entry.label);
        result.push({ url, label: innerLabel ?? label });
      }
    }

    const parentUrl = extractHttpUrlString(raw.url);
    if (parentUrl && !seen.has(parentUrl)) {
      seen.add(parentUrl);
      result.push({ url: parentUrl, label });
    }
  }

  return result;
}

function initialsFromDisplayName(fullName: string, companyName: string): string {
  const base = fullName !== "—" ? fullName : companyName !== "—" ? companyName : "";
  const parts = base.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const a = parts[0]?.[0];
    const b = parts[1]?.[0];
    if (a && b) return `${a}${b}`.toUpperCase();
  }
  if (parts.length === 1) {
    const w = parts[0];
    if (w.length >= 2) return w.slice(0, 2).toUpperCase();
    if (w.length === 1) return `${w[0]}`.toUpperCase();
  }
  return "?";
}

function BrandAvatar({
  fullName,
  companyName,
  imageUrl
}: {
  fullName: string;
  companyName: string;
  imageUrl?: string;
}) {
  const initials = useMemo(() => initialsFromDisplayName(fullName, companyName), [fullName, companyName]);

  const debugOverride = useMemo(() => {
    const raw = import.meta.env.VITE_DEBUG_BRAND_IMAGE_URL;
    return typeof raw === "string" && raw.trim().length > 0 ? raw.trim() : undefined;
  }, []);

  const apiUrl = useMemo(() => {
    const raw = (debugOverride ?? imageUrl)?.trim();
    if (!raw) return undefined;
    return isValidHttpUrlCandidate(raw) ? raw : undefined;
  }, [debugOverride, imageUrl]);

  const [apiLoadFailed, setApiLoadFailed] = useState(false);
  const [placeholderLoadFailed, setPlaceholderLoadFailed] = useState(false);

  useEffect(() => {
    setApiLoadFailed(false);
    setPlaceholderLoadFailed(false);
  }, [imageUrl, debugOverride]);

  const renderSrc = useMemo(() => {
    if (placeholderLoadFailed) return null;
    if (apiUrl && !apiLoadFailed) return apiUrl;
    return BRAND_AVATAR_PLACEHOLDER_SRC;
  }, [apiLoadFailed, apiUrl, placeholderLoadFailed]);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    console.log("[BrandAvatar] profile image URL", {
      extractedFromApi: imageUrl?.trim() ?? null,
      debugOverride: debugOverride ?? null,
      resolvedApiUrl: apiUrl ?? null,
      renderSrc: renderSrc ?? "(initials fallback)",
      apiLoadFailed,
      placeholderLoadFailed
    });
  }, [apiLoadFailed, apiUrl, debugOverride, imageUrl, placeholderLoadFailed, renderSrc]);

  const showImage = renderSrc !== null;

  return (
    <div
      className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-100 to-slate-200 shadow-inner ring-1 ring-white/80"
      aria-label={
        showImage
          ? `${fullName} profile photo`
          : `${fullName} avatar, image unavailable`
      }
    >
      {showImage ? (
        <img
          src={renderSrc}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => {
            if (apiUrl && !apiLoadFailed) {
              setApiLoadFailed(true);
              return;
            }
            setPlaceholderLoadFailed(true);
          }}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-indigo-600 to-violet-700 px-1 text-center">
          <span className="text-lg font-bold tracking-tight text-white drop-shadow-sm">{initials}</span>
          <span className="mt-0.5 max-w-full truncate px-1 text-[9px] font-medium uppercase leading-tight text-white/80">
            No photo
          </span>
        </div>
      )}
    </div>
  );
}

function VendorBrandApiPanelSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading brand profile">
      <div className="flex gap-5">
        <SkeletonBlock className="h-24 w-24 shrink-0 rounded-2xl" />
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-3">
          <SkeletonBlock className="h-3 w-28 rounded-md" />
          <SkeletonBlock className="h-7 w-4/5 max-w-md rounded-md" />
          <SkeletonBlock className="h-4 w-3/5 max-w-sm rounded-md" />
        </div>
      </div>
      <div>
        <SkeletonBlock className="mb-4 h-4 w-32 rounded-md" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <SkeletonBlock className="h-24 rounded-xl" />
          <SkeletonBlock className="h-24 rounded-xl" />
          <SkeletonBlock className="h-24 rounded-xl sm:max-lg:col-span-2 lg:col-span-1" />
        </div>
      </div>
      <div>
        <SkeletonBlock className="mb-3 h-4 w-40 rounded-md" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <SkeletonBlock key={i} className="aspect-square rounded-xl shadow-sm ring-1 ring-slate-100/80" />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Fetches TatvaOps vendor brand data and renders vendor identity, services, and portfolio summary.
 * Independent of Supabase; use alongside existing profile sections.
 */
export function VendorBrandApiPanel({ apiUrl, className = "" }: VendorBrandApiPanelProps) {
  const url = apiUrl ?? getDefaultVendorBrandApiUrl();
  const [state, setState] = useState<LoadState>({ status: "idle" });

  const fetchBrand = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const response = await axios.get<unknown>(url, {
        headers: { Accept: "application/json" },
        validateStatus: () => true
      });

      if (response.status < 200 || response.status >= 300) {
        const body = response.data;
        const msg =
          isRecord(body) && typeof body.message === "string" ? body.message : `Request failed (${response.status})`;
        setState({ status: "error", message: msg });
        return;
      }

      const body = response.data;
      const envelope = isRecord(body) ? body : null;
      const payload = envelope && "data" in envelope ? envelope.data : undefined;
      if (!payload || typeof payload !== "object") {
        setState({ status: "error", message: "Invalid response: missing data" });
        return;
      }

      setState({ status: "success", payload: payload as TatvaVendorBrandApiPayload });
    } catch (err) {
      const message = isAxiosError(err)
        ? pickString(
            isRecord(err.response?.data) ? err.response.data.message : undefined,
            isRecord(err.response?.data) ? err.response.data.error : undefined,
            typeof err.response?.data === "string" ? err.response.data : undefined,
            err.message
          ) ?? err.message
        : err instanceof Error
          ? err.message
          : "Something went wrong";
      setState({ status: "error", message: String(message) });
    }
  }, [url]);

  useEffect(() => {
    void fetchBrand();
  }, [fetchBrand]);

  const vendorBlock = () => {
    if (state.status !== "success") return null;
    const { fullName, companyName, profileImageUrl } = normalizeVendorFromApi(state.payload.vendor);
    return (
      <div className="flex flex-col gap-5 border-b border-slate-100 pb-6 sm:flex-row sm:items-center">
        <BrandAvatar fullName={fullName} companyName={companyName} imageUrl={profileImageUrl} />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">Brand profile</p>
          <h2 className="mt-1 truncate text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">{fullName}</h2>
          <p className="mt-0.5 truncate text-sm text-slate-600">{companyName}</p>
        </div>
      </div>
    );
  };

  const servicesBlock = () => {
    if (state.status !== "success") return null;
    const services = toArray(state.payload.services).map(normalizeServiceLabel);
    if (services.length === 0) {
      return (
        <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/90 px-4 py-6 text-center text-sm text-slate-500">
          No services returned for this brand.
        </p>
      );
    }
    return (
      <div>
        <div className="mb-4 flex items-end justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Services</h3>
            <p className="text-xs text-slate-500">{services.length} offered</p>
          </div>
        </div>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((label, i) => (
            <li
              key={`${label}-${i}`}
              className="group flex min-h-[5.5rem] flex-col justify-between rounded-xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/90 p-4 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-700 ring-1 ring-indigo-100 transition group-hover:bg-indigo-100">
                {i + 1}
              </span>
              <p className="mt-3 text-sm font-medium leading-snug text-slate-800">{label}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const portfoliosBlock = () => {
    if (state.status !== "success") return null;
    const images = extractBrandPortfolioImages(state.payload.portfolios);
    if (images.length === 0) {
      return (
        <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/90 px-4 py-6 text-center text-sm text-slate-500">
          No portfolio images in this response.
        </p>
      );
    }
    return (
      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-900">
          Portfolios <span className="font-normal text-slate-500">({images.length} images)</span>
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((item, i) => (
            <figure
              key={`${item.url}-${i}`}
              className="group overflow-hidden rounded-xl border border-slate-200/90 bg-slate-100 shadow-sm ring-1 ring-slate-100/80 transition duration-300 hover:border-indigo-200/70 hover:shadow-md"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={item.url}
                  alt={item.label}
                  className="h-full w-full object-cover transition duration-500 ease-out will-change-transform group-hover:scale-110"
                  loading="lazy"
                />
              </div>
            </figure>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className={`${cardClassName} ${className}`.trim()}>
      {state.status === "loading" || state.status === "idle" ? (
        <div className="animate-pulse">
          <VendorBrandApiPanelSkeleton />
        </div>
      ) : null}

      {state.status === "error" ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center">
          <p className="text-sm font-semibold text-amber-900">Brand API unavailable</p>
          <p className="mt-1 text-xs text-amber-800">{state.message}</p>
          <button
            type="button"
            onClick={() => void fetchBrand()}
            className="mt-3 rounded-lg bg-amber-700 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-800"
          >
            Retry
          </button>
        </div>
      ) : null}

      {state.status === "success" ? (
        <div className="space-y-5">
          {vendorBlock()}
          {servicesBlock()}
          {portfoliosBlock()}
        </div>
      ) : null}
    </section>
  );
}

export function SectionTitle({ icon, title, subtitle }: { icon?: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
        {icon ? <span className="mr-2">{icon}</span> : null}
        {title}
      </h3>
      {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="grid place-items-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <p className="text-base font-semibold text-slate-800">{title}</p>
      <p className="mt-1 max-w-md text-sm text-slate-500">{description}</p>
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center shadow-sm">
      <p className="text-lg font-semibold text-rose-900">Could not load vendor profile</p>
      <p className="mt-1 text-sm text-rose-700">
        We hit a temporary issue while fetching vendor data. Please try again.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
      >
        Retry
      </button>
    </div>
  );
}

export function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />;
}

export function SkeletonCard({ children }: { children: ReactNode }) {
  return <section className={cardClassName}>{children}</section>;
}
