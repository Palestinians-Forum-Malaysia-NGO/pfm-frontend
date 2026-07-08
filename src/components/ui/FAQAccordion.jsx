import React, { useState } from "react";
import { MdExpandMore } from "react-icons/md";

/**
 * Reusable single-open accordion for FAQ-style question/answer lists.
 *
 * Props:
 *   items             – [{ q, a }] (required)
 *   defaultOpenIndex  – index open on mount, -1 for none (default: 0)
 *   className         – wrapper className override (default: "flex flex-col gap-3")
 */
const FAQAccordion = ({ items, defaultOpenIndex = 0, className = "flex flex-col gap-3" }) => {
  const [openIndex, setOpenIndex] = useState(defaultOpenIndex);

  const toggle = (i) => setOpenIndex((prev) => (prev === i ? -1 : i));

  return (
    <div className={className}>
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div
            key={item.q}
            className={`overflow-hidden rounded-2xl border transition-colors duration-150 ${
              open ? "border-green/30 bg-green/[0.03]" : "border-slate-200 bg-white"
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(i)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="text-sm font-semibold text-slate-900">{item.q}</span>
              <MdExpandMore className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${open ? "rotate-180 text-green" : ""}`} />
            </button>
            <div className="grid transition-all duration-200 ease-in-out" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
              <div className="overflow-hidden">
                <p className="px-5 pb-4 text-sm leading-relaxed text-slate-500">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FAQAccordion;
