function parseInsightBullets(insight: string): { positives: string[]; negatives: string[] } {
  const trimmed = insight.trim();
  if (!trimmed) return { positives: [], negatives: [] };

  const lower = trimmed.toLowerCase();
  const negIdx = lower.indexOf("less suited");
  if (negIdx >= 0) {
    const before = trimmed.slice(0, negIdx).replace(/[.;]\s*$/, "").trim();
    const after = trimmed.slice(negIdx).replace(/^[,;\s]+/, "").trim();
    const positives = before
      .split(/[.;]/)
      .map((s) => s.trim())
      .filter(Boolean);
    const negatives = after
      .split(/[.;]/)
      .map((s) => s.trim())
      .filter(Boolean);
    return {
      positives: positives.length ? positives : [before],
      negatives: negatives.length ? negatives : [after]
    };
  }

  const sentences = trimmed.split(/[.;]/).map((s) => s.trim()).filter(Boolean);
  if (sentences.length <= 1) {
    return { positives: [trimmed], negatives: [] };
  }
  const mid = Math.ceil(sentences.length / 2);
  return {
    positives: sentences.slice(0, mid),
    negatives: sentences.slice(mid)
  };
}

type Props = {
  insight: string;
};

export function AIInsight({ insight }: Props) {
  const { positives, negatives } = parseInsightBullets(insight);

  return (
    <section className="rounded-2xl bg-violet-100/80 p-5 shadow-sm ring-1 ring-violet-200/60 transition duration-300 hover:shadow-md">
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-indigo-900">TatvaOps AI Insights</p>

      <div className="mt-4 space-y-5">
        <div>
          <p className="text-xs font-semibold text-blue-700">Positives</p>
          <ul className="mt-2 space-y-2">
            {positives.map((line, i) => (
              <li key={`p-${i}`} className="flex gap-2 text-sm leading-relaxed text-indigo-950">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" aria-hidden />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        {negatives.length > 0 ? (
          <div>
            <p className="text-xs font-semibold text-rose-900">Negatives</p>
            <ul className="mt-2 space-y-2">
              {negatives.map((line, i) => (
                <li key={`n-${i}`} className="flex gap-2 text-sm leading-relaxed text-indigo-950">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-rose-500" aria-hidden />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
