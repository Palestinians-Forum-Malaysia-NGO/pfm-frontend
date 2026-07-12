import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { MdHandshake, MdChevronLeft, MdChevronRight } from "react-icons/md";
import useInView from "hooks/useInView";
import { useGetPartnerships } from "components/features/partnerships/hooks";
import PrevButton from "components/ui/buttons/PrevButton";
import NextButton from "components/ui/buttons/NextButton";

const PAGE_SIZE = 4;

const PartnersGallery = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView();
  const { partnerships, loading } = useGetPartnerships({ ordering: "order" });
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(partnerships.length / PAGE_SIZE));
  const visible = useMemo(
    () => partnerships.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [partnerships, page]
  );

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
          {visible.map((p, i) => {
            const CardTag = p.website_url ? "a" : "div";
            const linkProps = p.website_url ? { href: p.website_url, target: "_blank", rel: "noreferrer" } : {};
            return (
              <CardTag
                key={p.id}
                {...linkProps}
                title={p.name}
                className="group flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 text-center transition-all duration-200 ease-in-out hover:-translate-y-1 hover:border-green/30 hover:shadow-md"
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(24px)",
                  transition: "all 0.7s ease-in-out",
                  transitionDelay: `${i * 60}ms`,
                }}
              >
                <div className="flex h-16 w-full items-center justify-center">
                  {p.logo?.public_url
                    ? <img src={p.logo.public_url} alt={p.name} className="max-h-16 max-w-full object-contain transition-transform duration-200 ease-in-out group-hover:scale-105" />
                    : <MdHandshake className="h-8 w-8 text-slate-300" />
                  }
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{p.name}</p>
                  <span className="mt-1.5 inline-flex items-center rounded-full bg-green/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-green">
                    {t(`partnerships.type_${p.partnership_type}`, { defaultValue: p.partnership_type })}
                  </span>
                </div>
              </CardTag>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-1">
            <PrevButton
              text={t("table.prev")}
              icon={<span className="inline-flex rtl:rotate-180"><MdChevronLeft className="h-3.5 w-3.5" /></span>}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            />
            <div className="flex items-center gap-1.5 px-2">
              {[0, 1, 2].map((i) => {
                const pos = page === 1 ? 0 : page === totalPages ? 2 : 1;
                return (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-200 ease-in-out ${
                      i === pos ? "w-4 bg-green" : "w-1.5 bg-slate-300"
                    }`}
                  />
                );
              })}
            </div>
            <NextButton
              text={t("table.next")}
              icon={<span className="inline-flex rtl:rotate-180"><MdChevronRight className="h-3.5 w-3.5" /></span>}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            />
          </div>
        )}

      </div>
    </section>
  );
};

export default PartnersGallery;
