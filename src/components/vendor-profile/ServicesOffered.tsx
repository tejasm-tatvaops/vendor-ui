import { EmptyState, SectionTitle, cardClassName } from "./ui";

type Props = {
  services: string[];
};

export function ServicesOffered({ services }: Props) {
  return (
    <section className={cardClassName}>
      <SectionTitle icon="✅" title="Services Offered" />
      {services.length === 0 ? (
        <EmptyState title="No listed services" description="Service categories will appear when vendor setup is completed." />
      ) : (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {services.map((service) => (
            <p key={service} className="text-sm text-slate-700">
              <span className="mr-2 text-emerald-600">✓</span>
              {service}
            </p>
          ))}
        </div>
      )}
    </section>
  );
}
