import { Bookmark, MoreHorizontal, ThumbsUp } from "lucide-react";
import { useMemo, useState } from "react";
import type { ReviewItem } from "../../data/vendorMockData";
import { EmptyState, SectionTitle, cardClassName } from "./ui";

type Props = {
  reviews: ReviewItem[];
};

type ReviewFilter = "latest" | "highest" | "verified" | "google";

const chipBase =
  "rounded-full px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900";

function ReviewCard({ review }: { review: ReviewItem }) {
  const ratingLabel =
    Number.isInteger(review.rating) && review.rating <= 5
      ? String(review.rating)
      : review.rating.toFixed(1);

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch sm:justify-between sm:gap-6">
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-900">{review.reviewerName}</p>
          <p className="mt-0.5 text-sm text-slate-500">
            {review.location} • {review.projectType}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {review.verifiedProject ? (
              <span className="inline-flex rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                Verified Project
              </span>
            ) : null}
            {review.source === "google" ? (
              <span className="inline-flex rounded-md bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700">
                Google Review
              </span>
            ) : null}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-700">{review.comment}</p>
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
        </div>

        <div className="flex shrink-0 flex-row items-end justify-between gap-4 sm:w-[104px] sm:flex-col sm:items-end sm:justify-between">
          <div className="text-left sm:text-right">
            <p className="text-base font-bold text-amber-500">
              {ratingLabel} <span aria-hidden>★</span>
            </p>
            <p className="text-xs text-slate-500">{review.date}</p>
          </div>
          <div className="flex items-center gap-1 text-slate-400 sm:mt-auto">
            <button
              type="button"
              className="rounded-md p-1.5 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Helpful"
            >
              <ThumbsUp className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              className="rounded-md p-1.5 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Save review"
            >
              <Bookmark className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              className="rounded-md p-1.5 hover:bg-slate-100 hover:text-slate-600"
              aria-label="More options"
            >
              <MoreHorizontal className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export function ReviewsList({ reviews }: Props) {
  const [filter, setFilter] = useState<ReviewFilter>("latest");

  const filteredReviews = useMemo(() => {
    if (filter === "highest") {
      return [...reviews].sort((a, b) => b.rating - a.rating);
    }
    if (filter === "verified") {
      return reviews.filter((review) => review.verifiedProject);
    }
    if (filter === "google") {
      return reviews.filter((review) => review.source === "google");
    }
    return reviews;
  }, [reviews, filter]);

  const emptyCopy =
    filter === "google"
      ? {
          title: "No Google reviews yet",
          description: "Google Business reviews will show here once they are synced to this profile."
        }
      : filter === "verified"
        ? {
            title: "No verified reviews",
            description: "There are no verified-project reviews for this filter yet."
          }
        : {
            title: "No reviews yet",
            description: "Reviews will appear once homeowners complete and verify projects."
          };

  return (
    <section className={cardClassName}>
      <SectionTitle icon="⭐" title="Latest Reviews" subtitle="Verified homeowner experiences and project outcomes" />
      <div className="mb-5 flex flex-wrap gap-2">
        {(
          [
            ["latest", "Latest"],
            ["highest", "Highest Rated"],
            ["verified", "Verified Only"],
            ["google", "Google Reviews"]
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`${chipBase} ${
              filter === key ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {filteredReviews.length === 0 ? (
        <EmptyState title={emptyCopy.title} description={emptyCopy.description} />
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </section>
  );
}
