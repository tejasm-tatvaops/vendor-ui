import { useMemo, useState } from "react";
import type { ReviewItem } from "../../data/vendorMockData";
import { EmptyState, SectionTitle, cardClassName } from "./ui";

type Props = {
  reviews: ReviewItem[];
};

export function ReviewsList({ reviews }: Props) {
  const [filter, setFilter] = useState<"latest" | "highest" | "verified">("latest");

  const filteredReviews = useMemo(() => {
    if (filter === "highest") {
      return [...reviews].sort((a, b) => b.rating - a.rating);
    }
    if (filter === "verified") {
      return reviews.filter((review) => review.verifiedProject);
    }
    return reviews;
  }, [reviews, filter]);

  return (
    <section className={cardClassName}>
      <SectionTitle icon="⭐" title="Latest Reviews" subtitle="Verified homeowner experiences and project outcomes" />
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter("latest")}
          className={`rounded-full px-3 py-1 text-xs font-medium ${filter === "latest" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"}`}
        >
          Latest
        </button>
        <button
          type="button"
          onClick={() => setFilter("highest")}
          className={`rounded-full px-3 py-1 text-xs font-medium ${filter === "highest" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"}`}
        >
          Highest Rated
        </button>
        <button
          type="button"
          onClick={() => setFilter("verified")}
          className={`rounded-full px-3 py-1 text-xs font-medium ${filter === "verified" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"}`}
        >
          Verified Only
        </button>
      </div>
      {filteredReviews.length === 0 ? (
        <EmptyState title="No reviews yet" description="Reviews will appear once homeowners complete and verify projects." />
      ) : (
        <div className="mt-4 space-y-4">
          {filteredReviews.map((review) => (
            <article
              key={review.id}
              className="rounded-xl border border-slate-200 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
            >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-slate-900">{review.reviewerName}</p>
                <p className="text-sm text-slate-500">
                  {review.location} • {review.projectType}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-amber-500">{review.rating.toFixed(1)} ★</p>
                <p className="text-xs text-slate-500">{review.date}</p>
              </div>
            </div>
            {review.verifiedProject ? (
              <span className="mt-2 inline-flex rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                Verified Project
              </span>
            ) : null}
            <p className="mt-3 text-sm leading-6 text-slate-700">{review.comment}</p>
            {review.images?.length ? (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {review.images.map((image) => (
                  <img
                    key={image}
                    src={image}
                    alt="Review attachment"
                    className="h-20 w-full rounded-lg object-cover"
                    loading="lazy"
                  />
                ))}
              </div>
            ) : null}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
