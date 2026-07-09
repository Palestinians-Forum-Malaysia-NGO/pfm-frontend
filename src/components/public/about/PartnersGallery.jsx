import React from "react";
import { useTranslation } from "react-i18next";
import useInView from "hooks/useInView";
import { useGetPartnerships } from "components/features/partnerships/hooks";

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

const PartnersGallery = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView();
  const { partnerships, loading } = useGetPartnerships({ ordering: "order" });

  if (!loading && partnerships.length === 0) return null;

  return (
    <section ref={ref} className="bg-slate-50 py-20">
      <div className="mx-auto max-w-5xl px-6">

        <div
          className="mb-12 text-center"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s ease-in-out" }}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-green">{t("about.partners_label")}</span>
          <h2 className="mt-3 text-4xl font-extrabold text-slate-900">{t("about.partners_title")}</h2>
          <p className="mx-auto mt-3 max-w-md text-base text-slate-400">
            {t("about.partners_desc")}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {partnerships.map((p, i) => (
            <a
              key={p.id}
              href={p.website_url || undefined}
              target={p.website_url ? "_blank" : undefined}
              rel={p.website_url ? "noreferrer" : undefined}
              title={p.name}
              className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-center transition-all duration-200 ease-in-out hover:-translate-y-1 hover:border-green/20 hover:shadow-md"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(24px)",
                transition: "all 0.7s ease-in-out",
                transitionDelay: `${i * 60}ms`,
              }}
            >
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-green/10 text-sm font-black text-green shadow-sm">
                {p.logo?.public_url
                  ? <img src={p.logo.public_url} alt={p.name} className="h-full w-full object-cover" />
                  : getInitials(p.name)
                }
              </div>
              <p className="text-[11px] font-medium leading-tight text-slate-500">{p.name}</p>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PartnersGallery;
