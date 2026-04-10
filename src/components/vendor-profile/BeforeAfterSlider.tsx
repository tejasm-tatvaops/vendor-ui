import { useCallback, useRef, useState } from "react";

type Props = {
  beforeSrc: string;
  afterSrc: string;
  alt: string;
  initialPosition?: number;
};

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

export function BeforeAfterSlider({ beforeSrc, afterSrc, alt, initialPosition = 50 }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [slider, setSlider] = useState(clamp(initialPosition, 5, 95));
  const [dragging, setDragging] = useState(false);

  const updateSlider = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    if (rect.width <= 0) return;
    const percent = ((clientX - rect.left) / rect.width) * 100;
    setSlider(clamp(percent, 5, 95));
  }, []);

  const startMouseDrag = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      setDragging(true);
      updateSlider(event.clientX);

      const onMove = (moveEvent: MouseEvent) => updateSlider(moveEvent.clientX);
      const onUp = () => {
        setDragging(false);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [updateSlider]
  );

  const startTouchDrag = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      const touch = event.touches[0];
      if (!touch) return;
      setDragging(true);
      updateSlider(touch.clientX);

      const onMove = (moveEvent: TouchEvent) => {
        const activeTouch = moveEvent.touches[0];
        if (!activeTouch) return;
        updateSlider(activeTouch.clientX);
      };
      const onEnd = () => {
        setDragging(false);
        window.removeEventListener("touchmove", onMove);
        window.removeEventListener("touchend", onEnd);
      };

      window.addEventListener("touchmove", onMove, { passive: true });
      window.addEventListener("touchend", onEnd);
    },
    [updateSlider]
  );

  return (
    <div
      ref={containerRef}
      className={`relative aspect-video w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100 ${
        dragging ? "cursor-ew-resize" : "cursor-default"
      }`}
      onMouseDown={startMouseDrag}
      onTouchStart={startTouchDrag}
      role="presentation"
    >
      {/* BEFORE base */}
      <img src={beforeSrc} alt={`${alt} before`} className="h-full w-full object-cover select-none" draggable={false} />

      {/* AFTER overlay clipped by width */}
      <div
        className={`absolute left-0 top-0 h-full overflow-hidden ${dragging ? "" : "transition-all duration-200 ease-out"}`}
        style={{ width: `${slider}%` }}
      >
        <img src={afterSrc} alt={`${alt} after`} className="h-full w-full object-cover select-none" draggable={false} />
      </div>

      {/* Fixed labels */}
      <span className="absolute left-2 top-2 rounded bg-slate-900/70 px-2 py-0.5 text-[10px] font-semibold text-white">BEFORE</span>
      <span className="absolute right-2 top-2 rounded bg-slate-900/70 px-2 py-0.5 text-[10px] font-semibold text-white">AFTER</span>

      {/* Divider + handle */}
      <div
        className="absolute top-0 h-full w-[2px] cursor-ew-resize bg-white shadow-lg"
        style={{ left: `${slider}%` }}
      />
      <div
        className="pointer-events-none absolute top-0 h-full w-6 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/60 to-transparent"
        style={{ left: `${slider}%` }}
      />
      <div
        className="absolute top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-white text-sm font-semibold text-slate-900 shadow-lg transition hover:scale-110 active:scale-95"
        style={{ left: `${slider}%` }}
      >
        ↔
      </div>
    </div>
  );
}
