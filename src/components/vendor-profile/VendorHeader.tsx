import { Briefcase, Calendar, CheckCircle2, MapPin, Phone, Star } from "lucide-react";
import type { VendorData } from "../../data/vendorMockData";
import { formatIndianCurrency } from "./utils";
import { cardClassName } from "./ui";

type Props = {
  vendor: VendorData;
  experience: string | null;
  lastUpdatedLabel?: string | null;
  onBookVisit?: () => void;
  onContactTatvaops?: () => void;
};

const sectionLabel = "text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400";

export function VendorHeader({ vendor, experience, lastUpdatedLabel, onBookVisit, onContactTatvaops }: Props) {
  const profileImage = "/vendor_image.png";
  const onTimeDelivery = Math.min(98, 78 + vendor.projectsCompleted);
  const responseTime = vendor.projectsOngoing > 2 ? "< 4 hrs" : "< 2 hrs";
  const repeatClients = Math.min(60, 20 + vendor.projectsCompleted);
  const coverage = [vendor.location, "Ernakulam", "Thrissur"];

  return (
    <section className={cardClassName}>
      <div className="grid gap-8 lg:grid-cols-[minmax(272px,320px)_1fr] lg:items-start lg:gap-10">
        {/* Left column — profile, pricing, social proof, CTAs */}
        <aside className="flex flex-col rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 lg:sticky lg:top-6 lg:self-start">
          <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm">
            <img
              src={profileImage}
              alt={`${vendor.companyName} profile`}
              className="aspect-[3/4] w-full object-cover object-top"
              loading="lazy"
            />
          </div>

          <div className="mt-5">
            <p className="text-sm text-slate-500">Starting at</p>
            <p className="mt-0.5 text-3xl font-bold tracking-tight text-slate-900">
              {formatIndianCurrency(vendor.basePricePerSqft)}
            </p>
            <p className="mt-0.5 text-sm text-slate-500">per sqft</p>
          </div>

          <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
            <span className="inline-flex items-center gap-1 font-semibold text-slate-900">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
              {vendor.ratingsAverage.toFixed(1)}
            </span>
            <span className="text-slate-500">({vendor.projectsCompleted} completed projects)</span>
          </div>

          <div className="mt-6 flex flex-col gap-2.5 border-t border-slate-200/90 pt-6">
            <button
              type="button"
              onClick={onBookVisit}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            >
              <Calendar className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
              Make an Inquiry
            </button>
            <button
              type="button"
              onClick={onContactTatvaops}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-emerald-600 bg-white px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              <Phone className="h-4 w-4 shrink-0 text-emerald-700" strokeWidth={2} aria-hidden />
              Contact Tatva
            </button>
          </div>
        </aside>

        {/* Right column — identity, description, about, highlights, coverage, compliance */}
        <div className="min-w-0 space-y-8">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm sm:h-16 sm:w-16">
              <img src="/tatvaops-logo.png" alt="Tatva Ops logo" className="h-full w-full object-contain p-1.5" loading="lazy" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.75rem]">{vendor.companyName}</h1>
                {vendor.verified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                    <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
                    Verified
                  </span>
                ) : null}
              </div>
              <p className="mt-1.5 text-sm text-slate-500">{vendor.legalName}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={2} aria-hidden />
                  {vendor.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={2} aria-hidden />
                  {vendor.category}
                </span>
              </div>
            </div>
          </header>

          <div>
            <p className={sectionLabel}>Description</p>
            <div className="mt-3 rounded-xl border border-slate-200/90 bg-sky-50/50 px-4 py-4 sm:px-5">
              <p className="text-sm leading-relaxed text-slate-700">{vendor.description}</p>
              {lastUpdatedLabel ? (
                <p className="mt-4 text-xs text-slate-500">Last updated: {lastUpdatedLabel}</p>
              ) : null}
            </div>
          </div>

          <div>
            <p className={sectionLabel}>About</p>
            <div className="mt-3 grid gap-5 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-4">
              <div>
                <p className="text-xs text-slate-500">Name</p>
                <p className="mt-0.5 text-sm font-medium text-slate-900">{vendor.ownerName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Email</p>
                <p className="mt-0.5 break-all text-sm font-medium text-slate-900">{vendor.email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Phone</p>
                <p className="mt-0.5 text-sm font-medium text-slate-900">{vendor.phone}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Experience</p>
                <p className="mt-0.5 text-sm font-medium text-slate-900">{experience ?? "Not available"}</p>
              </div>
            </div>
          </div>

          <div>
            <p className={sectionLabel}>Project highlights</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                <p className="text-xs text-slate-500">On-time delivery</p>
                <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight text-slate-900">{onTimeDelivery}%</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                <p className="text-xs text-slate-500">Average response time</p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{responseTime}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                <p className="text-xs text-slate-500">Repeat clients</p>
                <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight text-slate-900">{repeatClients}%</p>
              </div>
            </div>
          </div>

          <div>
            <p className={sectionLabel}>Work coverage</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {coverage.map((city) => (
                <span
                  key={city}
                  className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700"
                >
                  {city}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className={sectionLabel}>Compliance snapshot</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800 ring-1 ring-emerald-100">
                GST Verified
              </span>
              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800 ring-1 ring-emerald-100">
                PAN Verified
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
                {vendor.companyType}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
