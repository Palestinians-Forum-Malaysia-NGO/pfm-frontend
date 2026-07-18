import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdHandshake, MdOpenInNew, MdRestore, MdClose, MdLink } from "react-icons/md";
import useLayoutBase from "hooks/useLayoutBase";
import { useInactivePartnershipList } from "components/features/partnerships/hooks";
import { PARTNERSHIP_TYPES } from "components/features/partnerships/constants/partnershipTypes";
import Button        from "components/ui/buttons/Button";
import PageHeader     from "components/ui/PageHeader";
import RowIconButton  from "components/ui/buttons/RowIconButton";
import SearchInput    from "components/form/SearchInput";
import FilterSelect   from "components/ui/FilterSelect";
import DataTable      from "components/ui/DataTable";

export default function InactivePartnershipsList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const base = useLayoutBase();
  const {
    partnerships, loading, error,
    search, setSearch,
    typeFilter, setTypeFilter,
    restoreLoading,
    handleRestore,
  } = useInactivePartnershipList();

  const TYPE_LABEL = Object.fromEntries(PARTNERSHIP_TYPES.map((v) => [v, t(`partnerships.type_${v}`)]));

  const TYPE_OPTIONS = [
    { value: "all", label: t("partnerships.type_all") },
    ...PARTNERSHIP_TYPES.map((v) => ({ value: v, label: TYPE_LABEL[v] })),
  ];

  const hasFilters = search !== "" || typeFilter !== "all";
  const clearFilters = () => { setSearch(""); setTypeFilter("all"); };

  const columns = [
    {
      key: "name",
      label: t("partnerships.col_name"),
      icon: <MdHandshake className="h-3.5 w-3.5" />,
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
            {p.logo?.public_url
              ? <img src={p.logo.public_url} alt={p.name} className="h-full w-full object-cover" />
              : <MdHandshake className="h-4 w-4 text-slate-400" />
            }
          </div>
          <div className="min-w-0 max-w-[220px] flex-1">
            <p className="truncate font-semibold text-slate-900">{p.name}</p>
            <p className="truncate text-xs text-slate-400">{TYPE_LABEL[p.partnership_type] ?? p.partnership_type}</p>
          </div>
        </div>
      ),
    },
    {
      key: "website",
      label: t("partnerships.col_website"),
      render: (p) => p.website_url ? (
        <a href={p.website_url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-green">
          <MdLink className="h-3.5 w-3.5" /> {t("partnerships.visit_link")}
        </a>
      ) : <span className="text-slate-300">—</span>,
    },
    {
      key: "updated_at",
      label: t("partnerships.col_deactivated_at"),
      render: (p) => <span className="text-sm text-slate-500">{p.updated_at ? new Date(p.updated_at).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" }) : "—"}</span>,
    },
    {
      key: "actions",
      label: t("partnerships.col_actions"),
      align: "right",
      stopPropagation: true,
      render: (p) => (
        <div className="flex items-center justify-end gap-0.5">
          <RowIconButton icon={<MdOpenInNew className="h-4 w-4" />} title={t("partnerships.view")}    onClick={() => navigate(`${base}/partnerships/${p.id}`)} variant="primary" />
          <RowIconButton icon={<MdRestore className="h-4 w-4" />}   title={t("partnerships.restore")} onClick={() => handleRestore(p)} disabled={restoreLoading} />
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-5xl bg-white p-6 rounded-2xl border border-slate-200">

      <PageHeader
        icon={<MdHandshake className="h-5 w-5" />}
        title={t("partnerships.inactive_title")}
        subtitle={t("partnerships.inactive_subtitle")}
        actions={
          <Button variant="ghost" text={t("partnerships.back_to_all")} onClick={() => navigate(`${base}/partnerships`)} />
        }
      />

      <div className="mb-4 flex items-center gap-2">
        <SearchInput value={search} onChange={(v) => setSearch(v)} placeholder={t("partnerships.search_placeholder")} className="flex-1" />
        <FilterSelect value={typeFilter} onChange={setTypeFilter} options={TYPE_OPTIONS} icon={<MdHandshake className="h-3.5 w-3.5" />} />
        {hasFilters && (
          <Button variant="danger" icon={<MdClose className="h-3.5 w-3.5" />} text={t("partnerships.clear")} onClick={clearFilters} />
        )}
      </div>

      <DataTable
        columns={columns}
        data={partnerships}
        loading={loading}
        error={error}
        onRowClick={(p) => navigate(`${base}/partnerships/${p.id}`)}
        pageSize={8}
        emptyIcon={<MdHandshake />}
        emptyTitle={t("partnerships.no_inactive_partnerships")}
        emptyDesc={hasFilters ? t("partnerships.adjust_filters") : t("partnerships.no_inactive_partnerships_desc")}
      />
    </div>
  );
}
