import React from "react";
import { useTranslation } from "react-i18next";
import useInView from "hooks/useInView";

const TeamMembers = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView();

  const TEAM = [
    { name: "Rusli Bin Abdul Rashid",   role: t("about.role_trustee"), bio: t("about.trustee1_bio"), initials: "RA", color: "from-green/20 to-green/10 text-green" },
    { name: "Mohamad Yusoff Bin Omar",  role: t("about.role_trustee"), bio: t("about.trustee2_bio"), initials: "MY", color: "from-blue-100 to-blue-50 text-blue-600" },
  ];

  return (
    <section id="team" ref={ref} className="scroll-mt-24 bg-white py-20">
      <div className="mx-auto max-w-3xl px-6">

        <div
          className="mb-12 text-center"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s ease-in-out" }}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-green">{t("about.team_label")}</span>
          <h2 className="mt-3 text-4xl font-extrabold text-slate-900">{t("about.team_title")}</h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {TEAM.map((member, i) => (
            <div
              key={member.name}
              className="group flex flex-col items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-md"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(28px)",
                transition: "all 0.7s ease-in-out",
                transitionDelay: `${i * 70}ms`,
              }}
            >
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br text-xl font-black transition-transform duration-200 group-hover:scale-105 ${member.color}`}>
                {member.initials}
              </div>
              <div>
                <p className="font-bold text-slate-900">{member.name}</p>
                <p className="mt-0.5 text-xs font-semibold text-green">{member.role}</p>
              </div>
              {member.bio && <p className="text-xs leading-relaxed text-slate-400">{member.bio}</p>}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TeamMembers;
