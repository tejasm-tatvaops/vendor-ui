import type { VendorData } from "../../data/vendorMockData";
import { SectionTitle, cardClassName } from "./ui";

type Props = {
  vendor: VendorData;
};

export function RatingSection({ vendor }: Props) {
  return (
    <section className={cardClassName}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <SectionTitle icon="📊" title="Ratings & Reviews" subtitle="Real feedback from project owners" />
        <div className="text-right">
          <p className="text-3xl font-bold text-slate-900">{vendor.ratingsAverage.toFixed(1)} / 5</p>
          <p className="text-sm text-slate-500">{vendor.ratingsCount} reviews</p>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        {vendor.ratingBreakdown.map((item) => {
          const pct = vendor.ratingsCount > 0 ? (item.count / vendor.ratingsCount) * 100 : 0;
          return (
            <div key={item.stars} className="grid grid-cols-[46px_1fr_42px] items-center gap-3 text-sm">
              <span className="text-slate-600">{item.stars}★</span>
              <div className="h-2 rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-right text-slate-500">{item.count}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
