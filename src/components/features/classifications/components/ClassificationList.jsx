import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLayoutBase from "hooks/useLayoutBase";
import {
  MdAdd, MdGroups, MdEdit, MdDeleteOutline, MdOpenInNew, MdClose,
} from "react-icons/md";
import { useClassificationList } from "components/features/classifications/hooks";
import ClassificationDeleteModal from "./ClassificationDeleteModal";
import Button        from "components/ui/buttons/Button";
import PageHeader    from "components/ui/PageHeader";
import RowIconButton from "components/ui/buttons/RowIconButton";
import SearchInput   from "components/form/SearchInput";
import SimpleDataTable from "components/ui/SimpleDataTable";

export default function ClassificationList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const base = useLayoutBase();
  const {
    classifications, loading, error,
    total,
    search,   setSearch,
    toDelete, setToDelete,
    deleteLoading,
    handleDeleteConfirm,
  } = useClassificationList();

  const columns = [
    {
      key: "name",
      label: t("classifications.col_classification"),
      icon: <MdGroups className="h-3.5 w-3.5" />,
      render: (c) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green/10 text-green">
            <MdGroups className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-slate-900">{c.name}</p>
            {c.name_ar && <p className="truncate text-xs text-slate-400" dir="rtl">{c.name_ar}</p>}
          </div>
        </div>
      ),
    },
    {
      key: "description",
      label: t("classifications.col_description"),
      render: (c) => (
        <span className="line-clamp-1 text-sm text-slate-600">
          {c.description || <span className="text-slate-300">—</span>}
        </span>
      ),
    },
    {
      key: "actions",
      label: t("classifications.col_actions"),
      align: "right",
      stopPropagation: true,
      render: (c) => (
        <div className="flex items-center justify-end gap-0.5">
          <RowIconButton icon={<MdOpenInNew className="h-4 w-4" />}     title={t("classifications.actions")}               onClick={() => navigate(`${base}/classifications/${c.id}`)}        variant="primary" />
          <RowIconButton icon={<MdEdit className="h-4 w-4" />}          title={t("classifications.edit_classification")}   onClick={() => navigate(`${base}/classifications/${c.id}/edit`)} />
          <RowIconButton icon={<MdDeleteOutline className="h-4 w-4" />} title={t("classifications.delete_classification")} onClick={() => setToDelete(c)} variant="danger" />
        </div>
      ),
    },
  ];

  const hasSearch = search !== "";

  return (
    <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdGroups className="h-5 w-5" />}
        title={t("classifications.title")}
        subtitle={t("classifications.subtitle")}
        actions={
          <Button icon={<MdAdd className="h-4 w-4" />} text={t("classifications.add_classification")} onClick={() => navigate(`${base}/classifications/create`)} />
        }
      />

      <div className="mb-5">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green/10 text-green">
            <MdGroups className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xl font-bold leading-none text-slate-900">{loading ? "—" : total}</p>
            <p className="mt-0.5 text-xs text-slate-400">{t("classifications.total")}</p>
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <SearchInput
          value={search}
          onChange={(v) => setSearch(v)}
          placeholder={t("classifications.search_placeholder")}
          className="flex-1"
        />
        {hasSearch && (
          <Button
            variant="danger"
            icon={<MdClose className="h-3.5 w-3.5" />}
            text={t("classifications.clear")}
            onClick={() => setSearch("")}
          />
        )}
      </div>

      <SimpleDataTable
        columns={columns}
        data={classifications}
        loading={loading}
        error={error}
        onRowClick={(c) => navigate(`${base}/classifications/${c.id}`)}
        pageSize={10}
        emptyIcon={<MdGroups />}
        emptyTitle={t("classifications.no_classifications")}
        emptyDesc={hasSearch ? t("classifications.adjust_search") : t("classifications.add_first")}
        emptyAction={!hasSearch ? { label: t("classifications.add_classification"), onClick: () => navigate(`${base}/classifications/create`) } : undefined}
      />

      <ClassificationDeleteModal
        open={!!toDelete}
        classification={toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </div>
  );
}
