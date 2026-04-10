type Props = {
  companyName: string;
  onBookVisit?: () => void;
  onContactTatvaops?: () => void;
};

export function CTASection({ companyName, onBookVisit, onContactTatvaops }: Props) {
  return (
    <aside className="sticky top-5 space-y-4">
      <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">TatvaOps</p>
        <h3 className="mt-1 text-lg font-semibold text-slate-900">{companyName}</h3>
        <div className="mt-4 space-y-2.5">
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
      </section>
    </aside>
  );
}
