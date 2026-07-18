import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLayoutBase from "hooks/useLayoutBase";
import {
  MdArrowBack, MdCampaign, MdArticle, MdAssignment, MdEvent,
  MdGroups, MdCheckCircle, MdCancel, MdCalendarToday, MdInfoOutline,
} from "react-icons/md";
import Button from "components/ui/buttons/Button";
import PageHeader from "components/ui/PageHeader";
import FormHeader from "components/ui/form/FormHeader";
import InfoRow from "components/ui/InfoRow";
import AlertBanner from "components/ui/AlertBanner";
import Loading from "components/loading/Loading";
import { useGetNotification } from "components/features/newsletter/hooks";

const SOURCE_BADGE = {
  news:    "bg-blue-50 text-blue-600",
  project: "bg-green/10 text-green",
  event:   "bg-amber-50 text-amber-600",
};

const SOURCE_ICON = {
  news:    MdArticle,
  project: MdAssignment,
  event:   MdEvent,
};

const fmtDateTime = (d) => d ? new Date(d).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

export default function NotificationDetailView() {
  const { t } = useTranslation();
  const { id }   = useParams();
  const navigate = useNavigate();
  const base = useLayoutBase();

  const { notification, execute: fetchNotification, loading, error } = useGetNotification();

  useEffect(() => { fetchNotification(id); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading)        return <Loading text={t("newsletter.loading")} />;
  if (error)          return <AlertBanner message={error} />;
  if (!notification)  return null;

  const SourceIcon = SOURCE_ICON[notification.source] ?? MdCampaign;
  const sourceLabel = t(`newsletter.source_${notification.source}`, { defaultValue: notification.source });

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdCampaign className="h-5 w-5" />}
        title={notification.source_title}
        subtitle={t("newsletter.notification_detail_subtitle")}
        actions={
          <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text={t("newsletter.back")} onClick={() => navigate(`${base}/newsletter/notifications`)} />
        }
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-4">
          <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${SOURCE_BADGE[notification.source] ?? "bg-slate-100 text-slate-500"}`}>
            <SourceIcon className="h-3.5 w-3.5" /> {sourceLabel}
          </span>
        </div>
        <FormHeader icon={<MdInfoOutline className="h-5 w-5" />} title={t("newsletter.notification_info")} subtitle={t("newsletter.notification_info_sub")} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow icon={<MdGroups className="h-4 w-4" />}      label={t("newsletter.info_recipients")} value={notification.recipients_count ?? 0} />
          <InfoRow icon={<MdCheckCircle className="h-4 w-4" />} label={t("newsletter.info_sent")}       value={notification.sent_count ?? 0} />
          <InfoRow icon={<MdCancel className="h-4 w-4" />}      label={t("newsletter.info_failed")}     value={notification.failed_count ?? 0} />
          <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label={t("newsletter.info_sent_at")}  value={fmtDateTime(notification.sent_at)} />
          <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label={t("newsletter.info_created_at")} value={fmtDateTime(notification.created_at)} />
        </div>
      </div>
    </div>
  );
}
