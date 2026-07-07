import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLayoutBase from "hooks/useLayoutBase";
import {
  MdPeople, MdCheckCircle, MdCancel,
  MdEdit, MdDeleteOutline, MdOpenInNew, MdClose,
  MdGroups, MdHourglassEmpty, MdFlag, MdLink, MdCheck,
  MdPerson, MdBlock,
} from "react-icons/md";
import { useBeneficiaryList } from "components/features/beneficiaries/hooks";
import BeneficiaryDeleteModal from "./BeneficiaryDeleteModal";
import { ACCOUNT_STATUS_BADGE } from "components/features/beneficiaries/constants/beneficiary";
import { COUNTRY_NAME_BY_CODE } from "components/features/beneficiaries/constants/countries";
import Button from "components/ui/buttons/Button";
import PageHeader from "components/ui/PageHeader";
import FilterSelect from "components/ui/FilterSelect";
import RowIconButton from "components/ui/buttons/RowIconButton";
import SearchInput from "components/form/SearchInput";
import DataTable from "components/ui/DataTable";
import StorageImage from "components/ui/StorageImage";

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

const APPLY_URL = `${window.location.origin}/apply`;

export default function BeneficiaryList() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const base = useLayoutBase();
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(APPLY_URL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const {
    beneficiaries, loading, error,
    apiStats, statsLoading,
    search,        setSearch,
    statusFilter,  setStatusFilter,
    accountFilter, setAccountFilter,
    toDelete,      setToDelete,
    deleteLoading,
    handleDeleteConfirm,
  } = useBeneficiaryList();

  const ACCOUNT_STATUS_OPTIONS = [
    { value: "all",       label: t("beneficiaries.account_status_all") },
    { value: "active",    label: t("beneficiaries.account_status_active") },
    { value: "pending",   label: t("beneficiaries.account_status_pending") },
    { value: "suspended", label: t("beneficiaries.account_status_suspended") },
    { value: "rejected",  label: t("beneficiaries.account_status_rejected") },
  ];

  const STATUS_OPTIONS = [
    { value: "all",      label: t("beneficiaries.status_all") },
    { value: "active",   label: t("beneficiaries.status_active") },
    { value: "inactive", label: t("beneficiaries.status_inactive") },
  ];

  const bs = apiStats?.by_status ?? {};

  const statCards = [
    {
      key: "total",
      label: t("beneficiaries.stat_total"),
      value: statsLoading ? "…" : (apiStats?.total ?? 0),
      icon: <MdPeople className="h-5 w-5" />,
      color: "text-slate-600", bgColor: "bg-slate-100",
      active: accountFilter === "all",
      onClick: () => { setAccountFilter("all"); setStatusFilter("all"); },
    },
    {
      key: "active",
      label: t("beneficiaries.stat_active"),
      value: statsLoading ? "…" : (bs.active ?? 0),
      icon: <MdCheckCircle className="h-5 w-5" />,
      color: "text-green", bgColor: "bg-green/10",
      active: accountFilter === "active",
      onClick: () => setAccountFilter((a) => a === "active" ? "all" : "active"),
    },
    {
      key: "pending",
      label: t("beneficiaries.stat_pending"),
      value: statsLoading ? "…" : (bs.pending ?? 0),
      icon: <MdHourglassEmpty className="h-5 w-5" />,
      color: "text-amber-600", bgColor: "bg-amber-50",
      active: accountFilter === "pending",
      onClick: () => setAccountFilter((a) => a === "pending" ? "all" : "pending"),
    },
    {
      key: "suspended",
      label: t("beneficiaries.stat_suspended"),
      value: statsLoading ? "…" : (bs.suspended ?? 0),
      icon: <MdBlock className="h-5 w-5" />,
      color: "text-red-500", bgColor: "bg-red-50",
      active: accountFilter === "suspended",
      onClick: () => setAccountFilter((a) => a === "suspended" ? "all" : "suspended"),
    },
  ];

  const columns = [
    {
      key: "beneficiary",
      label: t("beneficiaries.col_beneficiary"),
      icon: <MdPeople className="h-3.5 w-3.5" />,
      render: (b) => (
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-green/10 text-xs font-bold text-green">
            {b.user?.profile_photo
              ? <StorageImage fileKey={b.user.profile_photo} alt={b.user?.full_name} className="h-full w-full object-cover" fallback={getInitials(b.user?.full_name)} />
              : getInitials(b.user?.full_name)
            }
          </div>
          <div className="min-w-0 max-w-[200px] flex-1">
            <p className="truncate font-semibold text-slate-900">{b.user?.full_name}</p>
            {b.user?.full_name_ar && (
              <p className="truncate text-xs text-slate-400" dir="rtl">{b.user.full_name_ar}</p>
            )}
            <p className="truncate text-xs text-slate-400">{b.user?.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "account_status",
      label: t("beneficiaries.col_account_status"),
      icon: <MdGroups className="h-3.5 w-3.5" />,
      render: (b) => (
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${ACCOUNT_STATUS_BADGE[b.account_status] ?? "bg-slate-100 text-slate-500"}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
          {t(`beneficiaries.account_status_${b.account_status}`, { defaultValue: b.account_status ?? "—" })}
        </span>
      ),
    },
    {
      key: "classification",
      label: t("beneficiaries.col_classification"),
      render: (b) => {
        const name = (b.classification?.name_ar && i18n.language === "ar")
          ? b.classification.name_ar
          : b.classification?.name;
        return (
          <span className="truncate text-sm text-slate-700">
            {name || <span className="text-slate-300">—</span>}
          </span>
        );
      },
    },
    {
      key: "country",
      label: t("beneficiaries.col_country"),
      icon: <MdFlag className="h-3.5 w-3.5" />,
      render: (b) => (
        <span className="truncate text-sm text-slate-700">
          {COUNTRY_NAME_BY_CODE[b.country_of_origin] || b.country_of_origin || <span className="text-slate-300">—</span>}
        </span>
      ),
    },
    {
      key: "status",
      label: t("beneficiaries.col_status"),
      icon: <MdCheckCircle className="h-3.5 w-3.5" />,
      render: (b) => (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
          b.user?.is_active ? "bg-green/10 text-green" : "bg-slate-100 text-slate-500"
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${b.user?.is_active ? "bg-green" : "bg-slate-400"}`} />
          {b.user?.is_active ? t("beneficiaries.status_active") : t("beneficiaries.status_inactive")}
        </span>
      ),
    },
    {
      key: "actions",
      label: t("beneficiaries.col_actions"),
      align: "right",
      stopPropagation: true,
      render: (b) => (
        <div className="flex items-center justify-end gap-0.5">
          <RowIconButton icon={<MdOpenInNew className="h-4 w-4" />}     title={t("beneficiaries.view")}   onClick={() => navigate(`${base}/beneficiaries/${b.id}`)}      variant="primary" />
          <RowIconButton icon={<MdEdit className="h-4 w-4" />}          title={t("beneficiaries.edit")}   onClick={() => navigate(`${base}/beneficiaries/${b.id}/edit`)} />
          <RowIconButton icon={<MdDeleteOutline className="h-4 w-4" />} title={t("beneficiaries.delete")} onClick={() => setToDelete(b)} variant="danger" />
        </div>
      ),
    },
  ];

  const hasFilters = search !== "" || statusFilter !== "all" || accountFilter !== "all";

  const bg = apiStats?.by_gender ?? {};
  const genderTotal = (bg.male ?? 0) + (bg.female ?? 0) + (bg.unspecified ?? 0);
  const genderPct = (n) => genderTotal > 0 ? Math.round((n / genderTotal) * 100) : 0;

  return (
    <div className="mx-auto max-w-5xl bg-white p-6 rounded-2xl border border-slate-200">

      <PageHeader
        icon={<MdPeople className="h-5 w-5" />}
        title={t("beneficiaries.title")}
        subtitle={t("beneficiaries.subtitle")}
        actions={
          <button onClick={handleCopyLink}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-all duration-200 hover:border-green/40 hover:bg-green/5 hover:text-green active:scale-[0.98]">
            {copied
              ? <><MdCheck className="h-4 w-4 text-green" /> {t("beneficiaries.copied")}</>
              : <><MdLink className="h-4 w-4" /> {t("beneficiaries.copy_link")}</>
            }
          </button>
        }
      />

      {/* ── Stat cards ── */}
      <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {statCards.map((card) => (
          <button key={card.key} onClick={card.onClick}
            className={`group flex items-center gap-3 rounded-xl border px-4 py-3.5 text-start transition-all duration-200 ease-in-out hover:-translate-y-px active:translate-y-0 active:scale-[0.98] ${
              card.active ? "border-green/30 bg-green/5 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${card.bgColor} ${card.color}`}>{card.icon}</div>
            <div className="min-w-0 flex-1">
              <p className={`text-xl font-bold leading-none ${card.active ? "text-green" : "text-slate-900"}`}>{card.value}</p>
              <p className="mt-0.5 truncate text-xs text-slate-400">{card.label}</p>
            </div>
          </button>
        ))}
      </div>

      {/* ── Gender & top-city strip ── */}
      {apiStats && genderTotal > 0 && (
        <div className="mb-5 flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
          <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-400">
            {t("beneficiaries.by_gender")}
          </span>

          {/* Male */}
          <div className="flex items-center gap-2">
            <MdPerson className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-bold text-slate-800">{bg.male ?? 0}</span>
            <span className="text-xs text-slate-400">{t("beneficiaries.gender_male")} · {genderPct(bg.male ?? 0)}%</span>
          </div>

          {/* Female */}
          <div className="flex items-center gap-2">
            <MdPerson className="h-4 w-4 text-pink-400" />
            <span className="text-sm font-bold text-slate-800">{bg.female ?? 0}</span>
            <span className="text-xs text-slate-400">{t("beneficiaries.gender_female")} · {genderPct(bg.female ?? 0)}%</span>
          </div>

          {/* Unspecified (only if non-zero) */}
          {(bg.unspecified ?? 0) > 0 && (
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full bg-slate-300" />
              <span className="text-sm font-bold text-slate-800">{bg.unspecified}</span>
              <span className="text-xs text-slate-400">{t("beneficiaries.gender_unspecified")} · {genderPct(bg.unspecified)}%</span>
            </div>
          )}

          {/* Top city */}
          {apiStats.by_city?.length > 0 && (
            <>
              <span className="mx-1 h-4 w-px shrink-0 bg-slate-200" />
              <div className="flex items-center gap-1.5">
                <MdFlag className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-400">{t("beneficiaries.top_city")}:</span>
                <span className="text-sm font-semibold text-slate-700">{apiStats.by_city[0].city}</span>
                <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-xs font-medium text-slate-600">{apiStats.by_city[0].count}</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Filters ── */}
      <div className="mb-4 flex items-center gap-2">
        <SearchInput value={search} onChange={(v) => setSearch(v)} placeholder={t("beneficiaries.search_placeholder")} className="flex-1" />
        <FilterSelect value={accountFilter} onChange={setAccountFilter} options={ACCOUNT_STATUS_OPTIONS} icon={<MdGroups className="h-3.5 w-3.5" />} />
        <FilterSelect value={statusFilter}  onChange={setStatusFilter}  options={STATUS_OPTIONS}          icon={<MdCheckCircle className="h-3.5 w-3.5" />} />
        {hasFilters && (
          <Button variant="danger" icon={<MdClose className="h-3.5 w-3.5" />} text={t("beneficiaries.clear")}
            onClick={() => { setSearch(""); setStatusFilter("all"); setAccountFilter("all"); }} />
        )}
      </div>

      <DataTable
        columns={columns}
        data={beneficiaries}
        loading={loading}
        error={error}
        onRowClick={(b) => navigate(`${base}/beneficiaries/${b.id}`)}
        pageSize={8}
        emptyIcon={<MdPeople />}
        emptyTitle={t("beneficiaries.no_beneficiaries")}
        emptyDesc={hasFilters ? t("beneficiaries.adjust_filters") : t("beneficiaries.add_first")}
        emptyAction={!hasFilters ? { label: t("beneficiaries.add_beneficiary"), onClick: () => navigate(`${base}/beneficiaries/create`) } : undefined}
      />

      <BeneficiaryDeleteModal
        open={!!toDelete}
        beneficiary={toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </div>
  );
}
