import axios, { isAxiosError } from "axios";
import { useCallback, useEffect, useState, type ReactNode } from "react";

export const cardClassName =
  "rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm transition-all duration-300 hover:shadow-md";

/** Default TatvaOps internal brand API; override with `VITE_TATVAOPS_VENDOR_BRAND_URL` (full URL). In dev, Vite proxies `/tatvaops-vendor-api` → `devapi.tatvaops.com` (see `vite.config.ts`). */
export function getDefaultVendorBrandApiUrl(): string {
  const fromEnv = import.meta.env.VITE_TATVAOPS_VENDOR_BRAND_URL;
  if (typeof fromEnv === "string" && fromEnv.trim().length > 0) {
    return fromEnv.trim();
  }
  const path = "/vendor/api/vendor/internal/brand/69ba63cec205a63d3ff11d5f";
  if (import.meta.env.DEV) {
    return `/tatvaops-vendor-api${path}`;
  }
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

function pickProfileImage(vendor: Record<string, unknown>): string | undefined {
  return pickString(
    vendor.profileImage,
    vendor.profile_image,
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
          {profileImageUrl ? (
            <img src={profileImageUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="grid h-full w-full place-items-center text-xs font-medium text-slate-400">No image</div>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Brand API</p>
          <h2 className="truncate text-xl font-semibold text-slate-900">{fullName}</h2>
          <p className="truncate text-sm text-slate-600">{companyName}</p>
        </div>
      </div>
    );
  };

  const servicesBlock = () => {
    if (state.status !== "success") return null;
    const services = toArray(state.payload.services).map(normalizeServiceLabel);
    if (services.length === 0) {
      return <p className="text-sm text-slate-500">No services returned for this brand.</p>;
    }
    return (
      <div>
        <p className="mb-2 text-sm font-semibold text-slate-800">Services</p>
        <ul className="flex flex-wrap gap-2">
          {services.map((label, i) => (
            <li
              key={`${label}-${i}`}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
            >
              {label}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const portfoliosBlock = () => {
    if (state.status !== "success") return null;
    const items = toArray(state.payload.portfolios).map(normalizePortfolioLabel);
    if (items.length === 0) {
      return <p className="text-sm text-slate-500">No portfolios in this response.</p>;
    }
    return (
      <div>
        <p className="mb-2 text-sm font-semibold text-slate-800">Portfolios ({items.length})</p>
        <ul className="max-h-40 space-y-1 overflow-y-auto text-sm text-slate-600">
          {items.map((title, i) => (
            <li key={`${title}-${i}`} className="truncate border-b border-slate-100 py-1 last:border-0">
              {title}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <section className={`${cardClassName} ${className}`.trim()}>
      {state.status === "loading" || state.status === "idle" ? (
        <div className="space-y-4 animate-pulse">
          <div className="flex gap-4">
            <SkeletonBlock className="h-20 w-20 shrink-0 rounded-2xl" />
            <div className="flex-1 space-y-2 pt-1">
              <SkeletonBlock className="h-3 w-24" />
              <SkeletonBlock className="h-5 w-3/4 max-w-xs" />
              <SkeletonBlock className="h-4 w-1/2 max-w-sm" />
            </div>
          </div>
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-5/6" />
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
