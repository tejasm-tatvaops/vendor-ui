type Props = {
  insight: string;
};

export function AIInsight({ insight }: Props) {
  return (
    <section className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5 shadow-sm transition duration-300 hover:shadow-md">
      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">TatvaOps AI Insight</p>
      <p className="mt-2 text-sm leading-6 text-indigo-900">{insight}</p>
    </section>
  );
}
