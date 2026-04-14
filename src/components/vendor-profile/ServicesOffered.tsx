import { EmptyState, cardClassName } from "./ui";

type Props = {
  services: string[];
};

const PLACEHOLDER =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.";

export function ServicesOffered({ services }: Props) {
  return (
    <section className={cardClassName}>
      <div className="mb-6">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">Services</h2>
        <p className="mt-1 text-sm text-slate-500">Services are offered by the Vendor</p>
      </div>

      {services.length === 0 ? (
        <EmptyState title="No listed services" description="Service categories will appear when vendor setup is completed." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <article
              key={`${service}-${index}`}
              className="relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <span className="inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded-md bg-indigo-600 px-1.5 text-xs font-bold text-white shadow-sm">
                {index + 1}
              </span>
              <h3 className="mt-3 text-sm font-bold leading-snug text-slate-900">{service}</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">{PLACEHOLDER}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
