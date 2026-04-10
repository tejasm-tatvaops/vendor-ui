import { useEffect, useMemo, useState } from "react";
import type { PortfolioItem, ReviewItem } from "../../data/vendorMockData";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { EmptyState, SectionTitle, cardClassName } from "./ui";

type Props = {
  items: PortfolioItem[];
  testimonials: ReviewItem[];
};

export function PortfolioGallery({ items, testimonials }: Props) {
  const [pairIndexes, setPairIndexes] = useState<Record<string, number>>({});
  const [pausedProjects, setPausedProjects] = useState<Record<string, boolean>>({});
  const [mediaMode, setMediaMode] = useState<Record<string, "gallery" | "youtube">>({});

  const normalized = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        brief: `${item.title}. Delivered in ${item.date} with quality-focused execution and transparent updates.`,
        beforeSlides: [item.beforeImage, item.image].filter((src): src is string => Boolean(src)),
        afterSlides: [item.afterImage, item.image].filter((src): src is string => Boolean(src))
      })),
    [items]
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      setPairIndexes((prev) => {
        const next = { ...prev };
        normalized.forEach((project) => {
          const pairLength = Math.max(project.beforeSlides.length, project.afterSlides.length);
          if (pairLength > 1) {
            if (pausedProjects[project.id]) return;
            const current = next[project.id] ?? 0;
            next[project.id] = (current + 1) % pairLength;
          }
        });
        return next;
      });
    }, 2000);

    return () => window.clearInterval(interval);
  }, [normalized, pausedProjects]);

  const movePair = (projectId: string, direction: "prev" | "next", length: number) => {
    if (length <= 1) return;
    const current = pairIndexes[projectId] ?? 0;
    const next = direction === "next" ? (current + 1) % length : (current - 1 + length) % length;
    setPairIndexes((prev) => ({ ...prev, [projectId]: next }));
  };

  return (
    <section className={cardClassName}>
      <SectionTitle icon="🖼️" title="Portfolio" subtitle="Recent project outcomes and execution quality" />

      {normalized.length === 0 ? (
        <EmptyState title="No portfolio projects yet" description="This vendor has not uploaded projects in this category yet." />
      ) : (
        <div className="mt-4 space-y-5">
          {normalized.map((project) => {
            const pairLength = Math.max(project.beforeSlides.length, project.afterSlides.length, 1);
            const pairIndex = pairIndexes[project.id] ?? 0;
            const beforeSrc = project.beforeSlides[pairIndex % Math.max(project.beforeSlides.length, 1)] ?? project.image;
            const afterSrc = project.afterSlides[pairIndex % Math.max(project.afterSlides.length, 1)] ?? project.image;

            return (
              <article
                key={project.id}
                className="grid gap-4 rounded-xl border border-slate-200 p-4 md:grid-cols-[1fr_1.4fr_1fr]"
              >
                <div>
                  <p className="text-base font-semibold text-slate-900">{project.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{project.date}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-700">{project.brief}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Media</p>
                    <div className="flex rounded-full bg-slate-100 p-1">
                      <button
                        type="button"
                        onClick={() => setMediaMode((prev) => ({ ...prev, [project.id]: "gallery" }))}
                        className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                          (mediaMode[project.id] ?? "gallery") === "gallery"
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500"
                        }`}
                      >
                        Gallery
                      </button>
                      <button
                        type="button"
                        onClick={() => setMediaMode((prev) => ({ ...prev, [project.id]: "youtube" }))}
                        className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                          (mediaMode[project.id] ?? "gallery") === "youtube"
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500"
                        }`}
                      >
                        YouTube Video
                      </button>
                    </div>
                  </div>

                  {(mediaMode[project.id] ?? "gallery") === "gallery" ? (
                    <div className="space-y-2">
                      <div
                        onMouseEnter={() => setPausedProjects((prev) => ({ ...prev, [project.id]: true }))}
                        onMouseLeave={() => setPausedProjects((prev) => ({ ...prev, [project.id]: false }))}
                      >
                        <BeforeAfterSlider beforeSrc={beforeSrc} afterSrc={afterSrc} alt={project.title} />
                      </div>

                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-600"
                          onClick={() => movePair(project.id, "prev", pairLength)}
                        >
                          Prev Pair
                        </button>
                        <span className="text-xs text-slate-500">
                          {Math.min(pairIndex + 1, pairLength)}/{pairLength}
                        </span>
                        <button
                          type="button"
                          className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-600"
                          onClick={() => movePair(project.id, "next", pairLength)}
                        >
                          Next Pair
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-lg border border-slate-200">
                      {project.youtubeUrl ? (
                        <iframe
                          title={`${project.title} YouTube video`}
                          src={project.youtubeUrl.includes("embed") ? project.youtubeUrl : project.youtubeUrl.replace("watch?v=", "embed/")}
                          className="h-56 w-full"
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <div className="grid h-56 place-items-center bg-slate-50 text-sm text-slate-500">
                          No YouTube video added
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Client Testimonial</p>
                  {testimonials.length > 0 ? (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <p className="text-sm leading-6 text-slate-700">
                        "
                        {testimonials[Math.abs(
                          project.title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
                        ) % testimonials.length].comment}
                        "
                      </p>
                      <p className="mt-2 text-xs font-semibold text-slate-900">
                        —{" "}
                        {
                          testimonials[
                            Math.abs(project.title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) %
                              testimonials.length
                          ].reviewerName
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-500">
                      Testimonials will appear once reviews are available.
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
