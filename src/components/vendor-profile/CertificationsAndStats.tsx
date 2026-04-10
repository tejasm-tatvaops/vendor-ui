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
};

export function CertificationsAndStats({
  gst,
  pan,
  companyType,
  projectsCompleted,
  projectsOngoing,
  projectsAssigned,
  totalProjects,
  certificationDocuments
}: Props) {
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

      <div className="mt-4 grid gap-3 md:grid-cols-3">
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

      <div className="mt-4 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
        KYC Complete • GST Active • PAN Matched • Compliance Score: 92/100
      </div>

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
