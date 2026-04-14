import { Play } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { PortfolioItem, ReviewItem } from "../../data/vendorMockData";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { EmptyState, cardClassName } from "./ui";

function uniqueImageUrls(urls: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const u of urls) {
    if (u && !seen.has(u)) {
      seen.add(u);
      out.push(u);
    }
  }
  return out;
}

function youtubeVideoId(url: string): string | null {
  const trimmed = url.trim();
  const short = trimmed.match(/youtu\.be\/([^?&/]+)/);
  if (short?.[1]) return short[1];
  const embed = trimmed.match(/youtube\.com\/embed\/([^?&/]+)/);
  if (embed?.[1]) return embed[1];
  const watch = trimmed.match(/[?&]v=([^?&]+)/);
  if (watch?.[1]) return watch[1];
  return null;
}

function youtubeThumb(url: string): string | null {
  const id = youtubeVideoId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

function youtubeEmbedUrl(url: string): string {
  const id = youtubeVideoId(url);
  return id ? `https://www.youtube.com/embed/${id}` : url;
}

type Props = {
  items: PortfolioItem[];
  testimonials: ReviewItem[];
};

export function PortfolioGallery({ items, testimonials }: Props) {
  const [pairIndexes, setPairIndexes] = useState<Record<string, number>>({});
  const pausedProjectsRef = useRef<Record<string, boolean>>({});
  const [mediaMode, setMediaMode] = useState<Record<string, "gallery" | "youtube">>({});

  const normalized = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        brief: `${item.title}. Delivered in ${item.date} with quality-focused execution and transparent updates.`,
        beforeSlides: uniqueImageUrls([item.beforeImage, item.image].filter((src): src is string => Boolean(src))),
        afterSlides: uniqueImageUrls([item.afterImage, item.image].filter((src): src is string => Boolean(src)))
      })),
    [items]
  );

  const movePair = (projectId: string, direction: "prev" | "next", length: number) => {
    if (length <= 1) return;
    const current = pairIndexes[projectId] ?? 0;
    const next = direction === "next" ? (current + 1) % length : (current - 1 + length) % length;
    setPairIndexes((prev) => ({ ...prev, [projectId]: next }));
  };

  const testimonialFor = (projectId: string, index: number): ReviewItem | null => {
    if (testimonials.length === 0) return null;
    const hash =
      projectId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) + index * 17;
    return testimonials[Math.abs(hash) % testimonials.length];
  };

  return (
    <section className={cardClassName}>
      <div className="mb-6 flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <span className="text-lg" aria-hidden>
            🖼️
          </span>
        </span>
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">Portfolio</h2>
          <p className="mt-1 text-sm text-slate-500">Recent project outcomes and execution quality</p>
        </div>
      </div>

      {normalized.length === 0 ? (
        <EmptyState title="No portfolio projects yet" description="This vendor has not uploaded projects in this category yet." />
      ) : (
        <div className="space-y-8">
          {normalized.map((project, projectIndex) => {
            const pairLength = Math.max(project.beforeSlides.length, project.afterSlides.length, 1);
            const pairIndex = pairIndexes[project.id] ?? 0;
            const beforeSrc = project.beforeSlides[pairIndex % Math.max(project.beforeSlides.length, 1)] ?? project.image;
            const afterSrc = project.afterSlides[pairIndex % Math.max(project.afterSlides.length, 1)] ?? project.image;
            const showSlideshowControls = pairLength > 1;
            const singleSameImage = pairLength === 1 && beforeSrc === afterSrc;
            const mode = mediaMode[project.id] ?? "gallery";
            const t = testimonialFor(project.id, projectIndex);
            const thumb = project.youtubeUrl ? youtubeThumb(project.youtubeUrl) : null;

            return (
              <article key={project.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
                  <div className="min-w-0 lg:w-[min(100%,380px)] lg:shrink-0 lg:max-w-[42%]">
                    <h3 className="text-lg font-bold leading-snug text-slate-900">{project.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{project.date}</p>
                    <p className="mt-3 text-sm leading-relaxed text-slate-700">{project.brief}</p>

                    <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                      Client testimonial
                    </p>

                    {project.youtubeUrl && thumb ? (
                      <a
                        href={project.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative mt-3 block aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-900/5"
                      >
                        <img src={thumb} alt="" className="h-full w-full object-cover" loading="lazy" />
                        <span className="absolute inset-0 grid place-items-center bg-slate-900/25 transition hover:bg-slate-900/35">
                          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-emerald-600 shadow-lg ring-2 ring-white/80">
                            <Play className="ml-0.5 h-7 w-7 fill-current" aria-hidden />
                          </span>
                        </span>
                      </a>
                    ) : null}

                    {t ? (
                      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                        <p className="text-sm leading-relaxed text-slate-700">&quot;{t.comment}&quot;</p>
                        <p className="mt-3 text-sm font-semibold text-slate-900">— {t.reviewerName}</p>
                      </div>
                    ) : (
                      <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">
                        Testimonials will appear once reviews are available.
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">Media</p>
                      <div className="flex w-full rounded-lg border border-slate-200 bg-slate-100 p-1 sm:w-auto">
                        <button
                          type="button"
                          onClick={() => setMediaMode((prev) => ({ ...prev, [project.id]: "gallery" }))}
                          className={`flex-1 rounded-md px-4 py-2 text-xs font-semibold transition sm:flex-none ${
                            mode === "gallery" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          Gallery
                        </button>
                        <button
                          type="button"
                          onClick={() => setMediaMode((prev) => ({ ...prev, [project.id]: "youtube" }))}
                          className={`flex-1 rounded-md px-4 py-2 text-xs font-semibold transition sm:flex-none ${
                            mode === "youtube" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          YouTube Video
                        </button>
                      </div>
                    </div>

                    <div className="mt-4">
                      {mode === "gallery" ? (
                        <div>
                          <div
                            className="relative"
                            onMouseEnter={() => {
                              if (!showSlideshowControls) return;
                              pausedProjectsRef.current[project.id] = true;
                            }}
                            onMouseLeave={() => {
                              if (!showSlideshowControls) return;
                              pausedProjectsRef.current[project.id] = false;
                            }}
                          >
                            {singleSameImage ? (
                              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                                <img
                                  src={beforeSrc}
                                  alt={project.title}
                                  className="h-full w-full object-cover"
                                  loading="lazy"
                                />
                              </div>
                            ) : (
                              <BeforeAfterSlider beforeSrc={beforeSrc} afterSrc={afterSrc} alt={project.title} />
                            )}
                            {showSlideshowControls ? (
                              <div className="pointer-events-none absolute bottom-3 right-3 rounded-md bg-white/95 px-2 py-0.5 text-xs font-medium text-slate-600 shadow-sm ring-1 ring-slate-200/80">
                                {pairIndex + 1}/{pairLength}
                              </div>
                            ) : null}
                          </div>
                          {showSlideshowControls ? (
                            <div className="mt-3 flex items-center justify-between text-xs">
                              <button
                                type="button"
                                className="rounded-md border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-50"
                                onClick={() => movePair(project.id, "prev", pairLength)}
                              >
                                Prev pair
                              </button>
                              <button
                                type="button"
                                className="rounded-md border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-50"
                                onClick={() => movePair(project.id, "next", pairLength)}
                              >
                                Next pair
                              </button>
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                          {project.youtubeUrl ? (
                            <iframe
                              title={`${project.title} YouTube video`}
                              src={youtubeEmbedUrl(project.youtubeUrl)}
                              className="h-full w-full"
                              loading="lazy"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : (
                            <div className="grid h-full w-full place-items-center text-sm text-slate-500">
                              No YouTube video added
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
