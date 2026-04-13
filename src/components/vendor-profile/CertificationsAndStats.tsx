import { useState } from "react";
import type { CertificationDocument } from "../../data/vendorMockData";
import { SectionTitle, cardClassName } from "./ui";

type Props = {
  gst: string;
  pan: string;
  companyType: string;
  projectsCompleted: number;
  projectsOngoing: number;
  projectsAssigned: number;
  totalProjects: number;
  certificationDocuments: CertificationDocument[];
  kycStatus?: "pending" | "verified" | "rejected";
  profileCompletionPercent?: number;
  bankName?: string;
  bankAccountNumber?: string;
  ifscCode?: string;
  minimumProjectBudget?: number;
  alternateContactNumber?: string;
  designation?: string;
  additionalGstNumbers?: string[];
};

export function CertificationsAndStats({
  gst,
  pan,
  companyType,
  projectsCompleted,
  projectsOngoing,
  projectsAssigned,
  totalProjects,
  certificationDocuments,
  kycStatus,
  profileCompletionPercent,
  bankName,
  bankAccountNumber,
  ifscCode,
  minimumProjectBudget,
  alternateContactNumber,
  designation,
  additionalGstNumbers
}: Props) {
  const kycBadge =
    kycStatus === "verified"
      ? { label: "KYC Verified", tone: "bg-emerald-50 text-emerald-700" }
      : kycStatus === "rejected"
        ? { label: "KYC Rejected", tone: "bg-rose-50 text-rose-700" }
        : { label: "KYC Pending", tone: "bg-amber-50 text-amber-700" };
  const maskedAccount = bankAccountNumber ? `••••${bankAccountNumber.slice(-4)}` : "Not shared";
  const formatInr = (value?: number) =>
    typeof value === "number" ? `Rs ${new Intl.NumberFormat("en-IN").format(value)}` : "Not shared";

  const certCards = [
    {
      label: "GSTIN",
      value: gst,
      status: "Verified",
      statusTone: "bg-emerald-50 text-emerald-700",
      meta: "Verified by TatvaOps KYC"
    },
    {
      label: "PAN",
      value: pan,
      status: "Verified",
      statusTone: "bg-emerald-50 text-emerald-700",
      meta: "Matched with legal entity"
    },
    {
      label: "Company Type",
      value: companyType,
      status: "Active",
      statusTone: "bg-slate-100 text-slate-700",
      meta: "Incorporation details validated"
    },
    {
      label: "KYC Status",
      value: kycBadge.label,
      status: `${profileCompletionPercent ?? 0}%`,
      statusTone: "bg-blue-50 text-blue-700",
      meta: "Profile completion"
    }
  ];
  const stats = [
    { label: "Completed Projects", value: projectsCompleted },
    { label: "Ongoing Projects", value: projectsOngoing },
    { label: "Total Projects", value: totalProjects },
    { label: "Projects Assigned", value: projectsAssigned }
  ];
  const [selectedDoc, setSelectedDoc] = useState<{ title: string; image: string } | null>(null);

  return (
    <section className={cardClassName}>
      <SectionTitle icon="🛡️" title="Certifications & Trust Signals" subtitle="Compliance status and delivery capacity at a glance" />

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        {certCards.map((card) => (
          <article key={card.label} className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{card.label}</p>
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${card.statusTone}`}>{card.status}</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-900">{card.value}</p>
            <p className="mt-1 text-xs text-slate-500">{card.meta}</p>
          </article>
        ))}
      </div>

      <div className={`mt-4 rounded-lg border px-3 py-2 text-xs ${kycBadge.tone} border-current/20`}>
        {kycBadge.label} • GST Active • PAN Matched • Compliance Score: {profileCompletionPercent ?? 0}/100
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Banking Details</p>
          <p className="mt-2 text-sm text-slate-700">Bank: <span className="font-semibold text-slate-900">{bankName ?? "Not shared"}</span></p>
          <p className="mt-1 text-sm text-slate-700">Account: <span className="font-semibold text-slate-900">{maskedAccount}</span></p>
          <p className="mt-1 text-sm text-slate-700">IFSC: <span className="font-semibold text-slate-900">{ifscCode ?? "Not shared"}</span></p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Onboarding Details</p>
          <p className="mt-2 text-sm text-slate-700">
            Minimum Budget: <span className="font-semibold text-slate-900">{formatInr(minimumProjectBudget)}</span>
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Alternate Contact: <span className="font-semibold text-slate-900">{alternateContactNumber ?? "Not shared"}</span>
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Designation: <span className="font-semibold text-slate-900">{designation ?? "Not shared"}</span>
          </p>
        </article>
      </div>

      {additionalGstNumbers?.length ? (
        <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
          Additional GST Numbers: {additionalGstNumbers.join(", ")}
        </div>
      ) : null}

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Certification Gallery</p>
        {certificationDocuments.length > 0 ? (
          <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
          <div className="mt-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3 text-sm text-slate-500">
            No certification documents uploaded yet.
          </div>
        )}
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-md bg-slate-50 p-3">
            <p className="text-3xl font-semibold leading-none text-slate-900">{stat.value}</p>
            <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
          </div>
        ))}
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
