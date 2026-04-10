import type { PricingTier } from "../../data/vendorMockData";
import { formatIndianCurrency } from "./utils";
import { SectionTitle, cardClassName } from "./ui";

type Props = {
  basePricePerSqft: number;
  pricingTiers: PricingTier[];
};

export function PricingSection({ basePricePerSqft, pricingTiers }: Props) {
  return (
    <section className={cardClassName}>
      <SectionTitle icon="💰" title="Pricing Breakdown" />
      <p className="-mt-2 text-sm text-slate-500">
        Starting at <span className="font-semibold text-slate-900">{formatIndianCurrency(basePricePerSqft)}</span> per sqft
      </p>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {pricingTiers.map((tier) => (
          <article key={tier.name} className="rounded-xl border border-slate-200 p-4 transition duration-300 hover:-translate-y-1 hover:shadow-md">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{tier.name}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{formatIndianCurrency(tier.pricePerSqft)}</p>
            <p className="text-xs text-slate-500">per sqft</p>
            <p className="mt-3 text-sm font-medium text-slate-800">Materials Included</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              {tier.materials.map((material) => (
                <li key={material}>• {material}</li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-slate-700">
              <span className="font-medium">Finishing:</span> {tier.finishingLevel}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
