import React from "react";
import { MdStar, MdStarBorder } from "react-icons/md";

/**
 * 1–5 star rating control.
 *
 * Props:
 *   value    – current rating (1–5)
 *   onChange – (value: number) => void — omit to render read-only
 *   size     – Tailwind size class for each star icon (default "h-5 w-5")
 */
const StarRating = ({ value = 0, onChange, size = "h-5 w-5" }) => {
  const readOnly = !onChange;

  return (
    <div className={`inline-flex items-center gap-0.5 ${readOnly ? "" : "cursor-pointer"}`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= value;
        const Icon = filled ? MdStar : MdStarBorder;
        return (
          <button
            key={n}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(n)}
            className={`${size} flex items-center justify-center text-amber-400 disabled:cursor-default ${
              readOnly ? "" : "transition-transform duration-150 ease-in-out hover:scale-110"
            }`}
          >
            <Icon className="h-full w-full" />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
