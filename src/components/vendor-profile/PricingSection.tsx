import type { PricingTier } from "../../data/vendorMockData";
import { formatIndianCurrency } from "./utils";
import { cardClassName } from "./ui";

type Props = {
  basePricePerSqft: number;
  pricingTiers: PricingTier[];
};

export function PricingSection({ basePricePerSqft, pricingTiers }: Props) {
  return (
    <section className={cardClassName}>
      <div className="mb-6">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
          <span className="mr-2" aria-hidden>
            💰
          </span>
          Pricing Breakdown
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Starting at{" "}
          <span className="font-semibold text-slate-800">{formatIndianCurrency(basePricePerSqft)}</span> per sqft
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {pricingTiers.map((tier) => (
          <article
            key={tier.name}
            className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{tier.name}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{formatIndianCurrency(tier.pricePerSqft)}</p>
            <p className="text-xs text-slate-500">per sqft</p>
            <p className="mt-5 text-sm font-semibold text-slate-800">Materials Included</p>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
              {tier.materials.map((material) => (
                <li key={material} className="flex gap-2">
                  <span className="text-slate-400">•</span>
                  <span>{material}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-snug text-slate-600">
              <span className="font-medium text-slate-800">Finishing:</span> {tier.finishingLevel}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
