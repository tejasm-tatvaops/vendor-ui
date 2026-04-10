import { SectionTitle, cardClassName } from "./ui";

type Props = {
  rows: Array<{ label: string; value?: string | null }>;
};

export function AboutCard({ rows }: Props) {
  return (
    <section className={cardClassName}>
      <SectionTitle icon="ℹ️" title="About" />
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {rows.map((row) =>
          row.value ? (
            <div key={row.label}>
              <p className="text-xs text-slate-500">{row.label}</p>
              <p className="text-sm font-medium text-slate-900">{row.value}</p>
            </div>
          ) : null
        )}
      </div>
    </section>
  );
}
