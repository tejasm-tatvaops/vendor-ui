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

export function VendorHeader({ vendor, experience, lastUpdatedLabel, onBookVisit, onContactTatvaops }: Props) {
  const profileImage = "/vendor_image.png";
  const onTimeDelivery = Math.min(98, 78 + vendor.projectsCompleted);
  const responseTime = vendor.projectsOngoing > 2 ? "< 4 hrs" : "< 2 hrs";
  const repeatClients = Math.min(60, 20 + vendor.projectsCompleted);
  const coverage = [vendor.location, "Ernakulam", "Thrissur"];
  const specializations = ["Turnkey Residential", "Villa Renovation", "Interiors", "Electrical Retrofits"];

  return (
    <section className={cardClassName}>
      <div className="grid gap-5 lg:grid-cols-[300px_1.5fr]">
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Vendor Profile</p>
            <div className="mt-2 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
              <img
                src={profileImage}
                alt={`${vendor.companyName} profile`}
                className="h-48 w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-sm text-slate-500">Starting at</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{formatIndianCurrency(vendor.basePricePerSqft)}</p>
            <p className="mt-1 text-sm text-slate-500">per sqft</p>
            <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
              <span className="text-amber-500">★</span>
              <span>{vendor.ratingsAverage.toFixed(1)}</span>
              <span>({vendor.projectsCompleted} completed projects)</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">TatvaOps</p>
            <h3 className="mt-1 text-base font-semibold text-slate-900">{vendor.companyName}</h3>
            <div className="mt-3 space-y-2">
              <button
                onClick={onBookVisit}
                className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-700"
              >
                📅 Book Site Visit
              </button>
              <button
                onClick={onContactTatvaops}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                📞 Contact TatvaOps
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white">
              <img src="/tatvaops-logo.png" alt="TatvaOps logo" className="h-full w-full object-contain p-1" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold text-slate-900">{vendor.companyName}</h1>
                {vendor.verified ? (
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    Verified
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-sm text-slate-500">{vendor.legalName}</p>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <span>📍 {vendor.location}</span>
                <span>🛠️ {vendor.category}</span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Description</p>
            <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm leading-6 text-slate-700">{vendor.description}</p>
              {lastUpdatedLabel ? <p className="mt-2 text-xs text-slate-500">Last updated: {lastUpdatedLabel}</p> : null}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">About</p>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs text-slate-500">Name</p>
                <p className="text-sm font-medium text-slate-900">{vendor.ownerName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Email</p>
                <p className="text-sm font-medium text-slate-900">{vendor.email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Phone</p>
                <p className="text-sm font-medium text-slate-900">{vendor.phone}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Experience</p>
                <p className="text-sm font-medium text-slate-900">{experience ?? "Not available"}</p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Project Highlights</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-xs text-slate-500">On-time delivery</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{onTimeDelivery}%</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-xs text-slate-500">Avg response time</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{responseTime}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-xs text-slate-500">Repeat clients</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{repeatClients}%</p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Work Coverage</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {coverage.map((city) => (
                  <span key={city} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                    {city}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Compliance Snapshot</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">GST Verified</span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">PAN Verified</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">{vendor.companyType}</span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Specializations</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {specializations.map((item) => (
                <span key={item} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
