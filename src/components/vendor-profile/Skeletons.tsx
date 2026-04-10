import { SkeletonBlock, SkeletonCard } from "./ui";

export function VendorHeaderSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
      <SkeletonCard>
        <div className="flex items-start gap-4">
          <SkeletonBlock className="h-16 w-16 rounded-full" />
          <div className="flex-1 space-y-3">
            <SkeletonBlock className="h-6 w-2/3" />
            <SkeletonBlock className="h-4 w-1/2" />
            <SkeletonBlock className="h-4 w-1/3" />
          </div>
        </div>
      </SkeletonCard>
      <SkeletonCard>
        <SkeletonBlock className="h-4 w-20" />
        <SkeletonBlock className="mt-3 h-9 w-32" />
        <SkeletonBlock className="mt-2 h-4 w-20" />
      </SkeletonCard>
    </div>
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
