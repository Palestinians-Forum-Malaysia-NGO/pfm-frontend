import React, { useState, useEffect, useCallback } from "react";
import {
  MdClose, MdChevronLeft, MdChevronRight, MdZoomIn, MdPhoto,
} from "react-icons/md";

/**
 * Reusable photo gallery with lightbox.
 *
 * Props:
 *   photos      – Array<string | { url: string, caption?: string }>
 *   title       – optional section heading
 *   subtitle    – optional section subheading
 *   columns     – 2 | 3 | 4  (default 3)
 *   maxVisible  – collapse to N photos with a "View all" toggle (default: show all)
 *   className   – extra wrapper classes
 */
const normalise = (item) =>
  typeof item === "string" ? { url: item, caption: "" } : item;

const COLS = {
  2: "grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
};

export default function PhotoGallery({
  photos = [],
  title,
  subtitle,
  columns = 3,
  maxVisible,
  className = "",
}) {
  const items = photos.map(normalise);

  const [showAll,     setShowAll]     = useState(!maxVisible);
  const [lightboxIdx, setLightboxIdx] = useState(null); // null = closed

  const visible   = showAll ? items : items.slice(0, maxVisible);
  const remaining = items.length - (maxVisible ?? items.length);

  const isOpen  = lightboxIdx !== null;
  const current = isOpen ? items[lightboxIdx] : null;

  /* ── Lightbox navigation ── */
  const prev = useCallback(() => {
    setLightboxIdx((i) => (i - 1 + items.length) % items.length);
  }, [items.length]);

  const next = useCallback(() => {
    setLightboxIdx((i) => (i + 1) % items.length);
  }, [items.length]);

  const close = useCallback(() => setLightboxIdx(null), []);

  /* Keyboard navigation */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape")      close();
      if (e.key === "ArrowLeft")   prev();
      if (e.key === "ArrowRight")  next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, prev, next, close]);

  /* Lock body scroll when lightbox open */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (items.length === 0) return null;

  const colClass = COLS[columns] ?? COLS[3];

  return (
    <div className={className}>
      {/* Section header */}
      {(title || subtitle) && (
        <div className="mb-4">
          {title    && <h3 className="text-base font-bold text-slate-900">{title}</h3>}
          {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
        </div>
      )}

      {/* Grid */}
      <div className={`grid gap-2 ${colClass}`}>
        {visible.map((photo, idx) => {
          const isLastVisible = !showAll && idx === (maxVisible ?? 0) - 1 && remaining > 0;
          return (
            <button
              key={idx}
              onClick={() => {
                if (isLastVisible) { setShowAll(true); return; }
                setLightboxIdx(idx);
              }}
              className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2"
            >
              <img
                src={photo.url}
                alt={photo.caption || `Photo ${idx + 1}`}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              {/* Hover overlay */}
              {!isLastVisible && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-200 group-hover:bg-black/30">
                  <MdZoomIn className="h-7 w-7 scale-75 text-white opacity-0 drop-shadow-lg transition-all duration-200 group-hover:scale-100 group-hover:opacity-100" />
                </div>
              )}
              {/* "View all" overlay on last visible tile */}
              {isLastVisible && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/50 backdrop-blur-sm">
                  <MdPhoto className="h-6 w-6 text-white" />
                  <p className="text-sm font-bold text-white">+{remaining} more</p>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Collapse back */}
      {showAll && maxVisible && items.length > maxVisible && (
        <button
          onClick={() => setShowAll(false)}
          className="mt-3 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors"
        >
          Show less
        </button>
      )}

      {/* ── Lightbox ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={close}
        >
          {/* Close */}
          <button
            onClick={close}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-150 hover:bg-white/20"
            aria-label="Close"
          >
            <MdClose className="h-5 w-5" />
          </button>

          {/* Counter */}
          <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {lightboxIdx + 1} / {items.length}
          </div>

          {/* Prev */}
          {items.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-150 hover:bg-white/20 sm:left-5"
              aria-label="Previous"
            >
              <MdChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Image */}
          <div
            className="relative flex max-h-[85vh] max-w-[90vw] flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={current.url}
              alt={current.caption || ""}
              className="max-h-[78vh] max-w-full rounded-xl object-contain shadow-2xl"
            />
            {current.caption && (
              <p className="mt-3 max-w-lg text-center text-sm text-white/70">{current.caption}</p>
            )}
          </div>

          {/* Next */}
          {items.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-150 hover:bg-white/20 sm:right-5"
              aria-label="Next"
            >
              <MdChevronRight className="h-6 w-6" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
