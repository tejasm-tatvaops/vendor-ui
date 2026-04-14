import { BarChart3, Star } from "lucide-react";
import type { VendorData } from "../../data/vendorMockData";
import { cardClassName } from "./ui";

type Props = {
  vendor: VendorData;
};

export function RatingSection({ vendor }: Props) {
  const ordered = [...vendor.ratingBreakdown].sort((a, b) => b.stars - a.stars);

  return (
    <section className={cardClassName}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-slate-500" aria-hidden />
            <h2 className="text-base font-semibold text-slate-900">Ratings &amp; Reviews</h2>
          </div>
          <p className="mt-1 text-sm text-slate-500">Real feedback from project owners</p>
        </div>
        <div className="text-right">
          <p className="flex items-baseline justify-end gap-1.5">
            <span className="text-4xl font-bold leading-none text-slate-900">{vendor.ratingsAverage.toFixed(1)}</span>
            <Star className="h-7 w-7 fill-amber-400 text-amber-400" aria-hidden />
          </p>
          <p className="mt-1 text-sm text-slate-500">{vendor.ratingsCount} reviews</p>
        </div>
      </div>

      <div className="mt-6 space-y-2.5">
        {ordered.map((item) => {
          const pct = vendor.ratingsCount > 0 ? (item.count / vendor.ratingsCount) * 100 : 0;
          return (
            <div key={item.stars} className="grid grid-cols-[52px_1fr_36px] items-center gap-3 text-sm">
              <span className="text-slate-600 tabular-nums">{item.stars} ★</span>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-right tabular-nums text-slate-500">{item.count}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
