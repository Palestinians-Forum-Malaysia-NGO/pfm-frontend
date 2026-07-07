import React from "react";
import { useTranslation } from "react-i18next";
import { MdLinkedIn, MdEmail } from "react-icons/md";
import useInView from "hooks/useInView";

const TeamMembers = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView();

  const TEAM = [
    { name: "Dr. Ahmad Al-Faris",   role: t("about.role_president"),         initials: "AA", color: "from-green/20 to-green/10 text-green" },
    { name: "Nurul Huda Ismail",    role: t("about.role_vice_president"),    initials: "NI", color: "from-blue-100 to-blue-50 text-blue-600" },
    { name: "Yusuf Al-Khalidi",     role: t("about.role_secretary_general"), initials: "YK", color: "from-purple-100 to-purple-50 text-purple-600" },
    { name: "Siti Fatimah Yusof",   role: t("about.role_treasurer"),         initials: "SF", color: "from-amber-100 to-amber-50 text-amber-600" },
    { name: "Hassan Mahmoud",       role: t("about.role_head_advocacy"),     initials: "HM", color: "from-green/20 to-green/10 text-green" },
    { name: "Rohani binti Hamid",   role: t("about.role_head_community"),    initials: "RH", color: "from-blue-100 to-blue-50 text-blue-600" },
  ];

  return (
    <section ref={ref} className="bg-white py-20">
      <div className="mx-auto max-w-5xl px-6">

        <div
          className="mb-12 text-center"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s ease-in-out" }}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-green">{t("about.team_label")}</span>
          <h2 className="mt-3 text-4xl font-extrabold text-slate-900">{t("about.team_title")}</h2>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
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
              {/* Avatar */}
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br text-xl font-black transition-transform duration-200 group-hover:scale-105 ${member.color}`}>
                {member.initials}
              </div>
              <div>
                <p className="font-bold text-slate-900">{member.name}</p>
                <p className="mt-0.5 text-xs text-slate-400">{member.role}</p>
              </div>
              {/* Social links */}
              <div className="flex items-center gap-2">
                <a href="#" className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-all duration-200 hover:-translate-y-0.5 hover:border-green/30 hover:text-green">
                  <MdLinkedIn className="h-3.5 w-3.5" />
                </a>
                <a href="#" className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-all duration-200 hover:-translate-y-0.5 hover:border-green/30 hover:text-green">
                  <MdEmail className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TeamMembers;
