import React from "react";
import { useTranslation } from "react-i18next";
import useInView from "hooks/useInView";
import StarRating from "components/ui/StarRating";
import { useGetFeedbacks } from "components/features/feedback/hooks";

const TESTIMONIALS = [
  {
    name: "Ahmad Faris",
    role: "Lifetime Member, Kuala Lumpur",
    initials: "AF",
    color: "bg-green/10 text-green",
    quote: "PFM gave me a community where I truly belong. The work they do for Palestine is genuine, transparent, and deeply impactful.",
  },
  {
    name: "Nurul Huda",
    role: "Volunteer, Selangor",
    initials: "NH",
    color: "bg-blue-50 text-blue-600",
    quote: "Being part of PFM changed my perspective. I went from passive supporter to active volunteer — and every event leaves me proud of what we've built.",
  },
  {
    name: "Yusuf Al-Khalidi",
    role: "Palestinian Community Member",
    initials: "YK",
    color: "bg-amber-50 text-amber-600",
    quote: "As a Palestinian living in Malaysia, PFM made me feel seen and heard. They don't just raise funds — they fight for dignity.",
  },
];

const CARD_COLORS = ["bg-green/10 text-green", "bg-blue-50 text-blue-600", "bg-amber-50 text-amber-600"];

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "?";

const Testimonials = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView();
  const { feedbacks, loading, error } = useGetFeedbacks({ status: "approved" });

  // Real approved feedback when available — falls back to the static
  // testimonials above until the backend exposes this endpoint publicly
  // (GET /feedback/ currently requires auth, so anonymous visitors get a 401).
  const items = (!loading && !error && feedbacks.length > 0)
    ? feedbacks.slice(0, 3).map((f, i) => ({
        name: f.full_name,
        role: f.project?.title ?? t("home.feedback_role_fallback"),
        initials: getInitials(f.full_name),
        color: CARD_COLORS[i % CARD_COLORS.length],
        quote: f.message,
        rating: f.rating,
      }))
    : TESTIMONIALS;

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
          {items.map((item, i) => (
            <div
              key={item.name + i}
              className="flex flex-col gap-5 rounded-3xl bg-white p-7 shadow-sm transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-md"
              style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(28px)", transition: "all 0.7s ease-in-out", transitionDelay: `${i * 100}ms` }}
            >
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
