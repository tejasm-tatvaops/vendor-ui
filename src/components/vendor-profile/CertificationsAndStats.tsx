import { useState } from "react";
import { Shield } from "lucide-react";
import type { CertificationDocument } from "../../data/vendorMockData";
import { cardClassName } from "./ui";

type Props = {
  gst: string;
  pan: string;
  companyType: string;
  certificationDocuments: CertificationDocument[];
  profileCompletionPercent?: number;
  kycStatus?: "pending" | "verified" | "rejected";
};

export function CertificationsAndStats({
  gst,
  pan,
  companyType,
  certificationDocuments,
  profileCompletionPercent,
  kycStatus
}: Props) {
  const [selectedDoc, setSelectedDoc] = useState<{ title: string; image: string } | null>(null);

  const kycLabel =
    kycStatus === "verified" ? "KYC Complete" : kycStatus === "rejected" ? "KYC Review" : "KYC Pending";
  const complianceScore =
    typeof profileCompletionPercent === "number" ? profileCompletionPercent * 10 + 4 : 924;

  return (
    <section className={cardClassName}>
      <div className="mb-6 flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 ring-1 ring-rose-100">
          <Shield className="h-5 w-5" strokeWidth={2} aria-hidden />
        </span>
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">Certifications & Trust Signals</h2>
          <p className="mt-1 text-sm text-slate-500">Compliance status and delivery capacity at a glance</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <article className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">GSTIN</p>
            <span className="text-xs font-bold text-emerald-600">Verified</span>
          </div>
          <p className="mt-3 break-all text-lg font-bold leading-tight text-slate-900">{gst}</p>
          <p className="mt-3 text-xs text-slate-500">Verified by TatvaOps KYC</p>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">PAN</p>
            <span className="text-xs font-bold text-emerald-600">Verified</span>
          </div>
          <p className="mt-3 text-lg font-bold leading-tight text-slate-900">PAN Verified</p>
          <p className="mt-2 break-all text-sm font-medium text-slate-700">{pan}</p>
          <p className="mt-3 text-xs text-slate-500">Matched with legal entity</p>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Company type</p>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
              Active
            </span>
          </div>
          <p className="mt-3 text-lg font-bold leading-snug text-slate-900">{companyType}</p>
          <p className="mt-3 text-xs text-slate-500">Incorporation details validated</p>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">KYC Status</p>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                kycStatus === "verified"
                  ? "bg-emerald-50 text-emerald-700"
                  : kycStatus === "rejected"
                    ? "bg-rose-50 text-rose-700"
                    : "bg-amber-50 text-amber-700"
              }`}
            >
              {kycStatus === "verified" ? "Verified" : kycStatus === "rejected" ? "Review" : "Pending"}
            </span>
          </div>
          <p className="mt-3 text-lg font-bold leading-snug text-slate-900">{kycLabel}</p>
          <p className="mt-3 text-xs text-slate-500">Profile completion: {profileCompletionPercent ?? 0}%</p>
        </article>
      </div>

      <div className="mt-5 rounded-xl bg-emerald-50/90 px-4 py-3 text-center text-sm font-medium text-emerald-800 ring-1 ring-emerald-100/80">
        {kycLabel} • GST Active • PAN Matched • Compliance Score: {complianceScore}
      </div>

      <div className="mt-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">Certification gallery</p>
        {certificationDocuments.length > 0 ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {certificationDocuments.map((doc) => (
              <button
                key={doc.id}
                type="button"
                onClick={() => setSelectedDoc({ title: doc.title, image: doc.image })}
                className="overflow-hidden rounded-lg border border-slate-200 bg-white text-left transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <img src={doc.image} alt={doc.title} className="h-28 w-full object-cover" loading="lazy" />
                <div className="p-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-slate-800">{doc.title}</p>
                    {doc.status ? (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                        {doc.status}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-[11px] text-blue-600">View document</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-8 text-center text-sm text-slate-500">
            No certification documents uploaded yet.
          </div>
        )}
      </div>

      {selectedDoc ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-900/70 p-4"
          onClick={() => setSelectedDoc(null)}
          role="presentation"
        >
          <div
            className="w-full max-w-3xl overflow-hidden rounded-xl bg-white"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Certification preview"
          >
            <img src={selectedDoc.image} alt={selectedDoc.title} className="h-[65vh] w-full object-cover" />
            <div className="flex items-center justify-between p-3">
              <p className="font-semibold text-slate-900">{selectedDoc.title}</p>
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="rounded-md border border-slate-200 px-3 py-1 text-sm text-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
