import { SkeletonBlock, SkeletonCard } from "./ui";

export function VendorHeaderSkeleton() {
  return (
    <SkeletonCard>
      <div className="grid gap-8 lg:grid-cols-[minmax(272px,320px)_1fr] lg:gap-10">
        <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5">
          <SkeletonBlock className="aspect-[3/4] w-full rounded-xl" />
          <SkeletonBlock className="h-4 w-24" />
          <SkeletonBlock className="h-9 w-36" />
          <SkeletonBlock className="h-4 w-20" />
          <SkeletonBlock className="h-4 w-48" />
          <SkeletonBlock className="h-px w-full" />
          <SkeletonBlock className="h-3 w-20" />
          <SkeletonBlock className="h-5 w-3/4" />
          <SkeletonBlock className="h-11 w-full rounded-xl" />
          <SkeletonBlock className="h-11 w-full rounded-xl" />
        </div>
        <div className="min-w-0 space-y-6">
          <div className="flex gap-4">
            <SkeletonBlock className="h-16 w-16 shrink-0 rounded-xl" />
            <div className="flex-1 space-y-2">
              <SkeletonBlock className="h-7 w-2/3" />
              <SkeletonBlock className="h-4 w-1/2" />
              <SkeletonBlock className="h-4 w-2/3" />
            </div>
          </div>
          <div>
            <SkeletonBlock className="h-3 w-24" />
            <SkeletonBlock className="mt-3 h-24 w-full rounded-xl" />
          </div>
          <div>
            <SkeletonBlock className="h-3 w-16" />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <SkeletonBlock className="h-14 w-full rounded-lg" />
              <SkeletonBlock className="h-14 w-full rounded-lg" />
              <SkeletonBlock className="h-14 w-full rounded-lg" />
              <SkeletonBlock className="h-14 w-full rounded-lg" />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <SkeletonBlock className="h-24 w-full rounded-xl" />
            <SkeletonBlock className="h-24 w-full rounded-xl" />
            <SkeletonBlock className="h-24 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </SkeletonCard>
  );
}

export function PortfolioSkeleton() {
  return (
    <SkeletonCard>
      <SkeletonBlock className="h-6 w-44" />
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="space-y-2">
            <SkeletonBlock className="h-40 w-full" />
            <SkeletonBlock className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    </SkeletonCard>
  );
}

export function ReviewsSkeleton() {
  return (
    <SkeletonCard>
      <SkeletonBlock className="h-6 w-40" />
      <div className="mt-4 space-y-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="rounded-xl border border-slate-200 p-4">
            <SkeletonBlock className="h-4 w-1/3" />
            <SkeletonBlock className="mt-2 h-4 w-2/3" />
            <SkeletonBlock className="mt-3 h-4 w-full" />
            <SkeletonBlock className="mt-2 h-4 w-5/6" />
          </div>
        ))}
      </div>
    </SkeletonCard>
  );
}
