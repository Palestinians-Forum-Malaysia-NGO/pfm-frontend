import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdMailOutline, MdCheckCircle, MdErrorOutline } from "react-icons/md";
import Loading from "components/loading/Loading";
import { useUnsubscribeNewsletter } from "components/features/newsletter/hooks";

export default function NewsletterUnsubscribePage() {
  const { t } = useTranslation();
  const { token } = useParams();
  const { execute: unsubscribe, loading, error } = useUnsubscribeNewsletter();
  const [done, setDone] = useState(false);

  useEffect(() => {
    unsubscribe(token).then(() => setDone(true)).catch(() => {});
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <Loading text={t("newsletterPublic.unsubscribing")} />;

  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      {done && !error ? (
        <>
          <MdCheckCircle className="mx-auto mb-4 h-16 w-16 text-green" />
          <h2 className="mb-2 text-xl font-bold text-slate-700">{t("newsletterPublic.unsubscribed_title")}</h2>
          <p className="mb-6 text-sm text-slate-400">{t("newsletterPublic.unsubscribed_body")}</p>
        </>
      ) : (
        <>
          <MdErrorOutline className="mx-auto mb-4 h-16 w-16 text-slate-200" />
          <h2 className="mb-2 text-xl font-bold text-slate-700">{t("newsletterPublic.error_title")}</h2>
          <p className="mb-6 text-sm text-slate-400">{t("newsletterPublic.error_body")}</p>
        </>
      )}
      <Link to="/" className="inline-flex items-center gap-2 rounded-xl bg-green px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-green/90">
        <MdMailOutline className="h-4 w-4" /> {t("newsletterPublic.back_home")}
      </Link>
    </div>
  );
}
