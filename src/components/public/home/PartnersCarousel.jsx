import React from "react";
import { useTranslation } from "react-i18next";
import { MdHandshake } from "react-icons/md";
import useInView from "hooks/useInView";
import { useGetPartnerships } from "components/features/partnerships/hooks";
import StorageImage from "components/ui/StorageImage";

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

const Card = ({ p }) => (
  <div title={p.name} className="shrink-0 px-2" style={{ width: "180px" }}>
    <div className="flex h-full flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-5 text-center transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:border-green/20 hover:shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white text-sm font-black text-green shadow-sm">
        <StorageImage
          fileKey={p.logo}
          alt={p.name}
          className="h-full w-full object-contain p-1"
          fallback={getInitials(p.name)}
        />
      </div>
      <p className="text-[10px] font-medium leading-tight text-slate-400">{p.name}</p>
    </div>
  </div>
);

const PartnersCarousel = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView();
  const { partnerships, loading } = useGetPartnerships({ ordering: "order" });

  if (!loading && partnerships.length === 0) return null;

  // Duplicate the strip so the 0% -> -50% loop is seamless.
  const track = [...partnerships, ...partnerships];
  const duration = Math.max(partnerships.length * 3, 15);

  return (
    <section ref={ref} className="bg-white py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div
          className="mb-10 text-center"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s ease-in-out" }}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-green">{t("about.partners_label")}</span>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900">{t("about.partners_carousel_title")}</h2>
        </div>

        <div
          className="group overflow-hidden"
          style={{ opacity: inView ? 1 : 0, transition: "opacity 0.7s ease-in-out", transitionDelay: "150ms" }}
        >
          {!loading && (
            <div
              className="flex w-max group-hover:[animation-play-state:paused] rtl:[animation-direction:reverse]"
              style={{ animation: `marquee ${duration}s linear infinite` }}
            >
              {track.map((p, i) => <Card key={`${p.id}-${i}`} p={p} />)}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PartnersCarousel;
