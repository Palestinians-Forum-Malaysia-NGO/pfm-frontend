import React from "react";
import { useTranslation } from "react-i18next";
import useInView from "hooks/useInView";
import StarRating from "components/ui/StarRating";
import { useGetFeedbacks } from "components/features/feedback/hooks";

const CARD_COLORS = ["bg-green/10 text-green", "bg-blue-50 text-blue-600", "bg-amber-50 text-amber-600"];

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "?";

const Testimonials = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView();
  const { feedbacks, loading, error } = useGetFeedbacks({ status: "approved" });

  const items = feedbacks.slice(0, 3).map((f, i) => ({
    name: f.full_name,
    role: f.project?.title ?? t("home.feedback_role_fallback"),
    initials: getInitials(f.full_name),
    color: CARD_COLORS[i % CARD_COLORS.length],
    quote: f.message,
    rating: f.rating,
  }));

  // No fallback content — hide the section rather than show fake testimonials
  // once real approved feedback has been fetched (or failed to fetch) and
  // there's nothing genuine to show.
  if (!loading && (error || items.length === 0)) return null;

  return (
    <section ref={ref} className="bg-slate-50 py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div
          className="mb-12 text-center"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s ease-in-out" }}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-green">{t("home.community_voices")}</span>
          <h2 className="mt-3 text-4xl font-extrabold text-slate-900">{t("home.what_members_say")}</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {(loading ? Array.from({ length: 3 }) : items).map((item, i) => (
            <div
              key={item?.name ? item.name + i : i}
              className="flex flex-col gap-5 rounded-3xl bg-white p-7 shadow-sm transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-md"
              style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(28px)", transition: "all 0.7s ease-in-out", transitionDelay: `${i * 100}ms` }}
            >
              {item ? (
                <>
                  {/* Quote mark */}
                  <span className="text-5xl font-black leading-none text-green/15">"</span>
                  <p className="text-sm leading-relaxed text-slate-600 -mt-6">{item.quote}</p>
                  <div className="mt-auto flex items-center gap-3 border-t border-slate-100 pt-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${item.color}`}>
                      {item.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-900">{item.name}</p>
                      <p className="truncate text-[11px] text-slate-400">{item.role}</p>
                    </div>
                    {item.rating && <StarRating value={item.rating} size="h-3.5 w-3.5" />}
                  </div>
                </>
              ) : (
                <div className="flex flex-1 animate-pulse flex-col gap-5">
                  <div className="h-5 w-10 rounded bg-slate-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-full rounded bg-slate-100" />
                    <div className="h-3 w-5/6 rounded bg-slate-100" />
                    <div className="h-3 w-2/3 rounded bg-slate-100" />
                  </div>
                  <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-slate-100" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-24 rounded bg-slate-100" />
                      <div className="h-2.5 w-32 rounded bg-slate-100" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
