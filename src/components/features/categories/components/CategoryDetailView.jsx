import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLayoutBase from "hooks/useLayoutBase";
import {
  MdArrowBack, MdEdit, MdDeleteOutline, MdCategory,
  MdLink, MdTextFields, MdCheckCircle,
  MdApps, MdAccountTree, MdSort, MdSubdirectoryArrowRight,
  MdPalette,
} from "react-icons/md";
import Button from "components/ui/buttons/Button";
import PageHeader from "components/ui/PageHeader";
import FormHeader from "components/ui/form/FormHeader";
import InfoRow from "components/ui/InfoRow";
import AlertBanner from "components/ui/AlertBanner";
import DropdownButton from "components/ui/buttons/DropdownButton";
import Loading from "components/loading/Loading";
import CategoryDeleteModal from "./CategoryDeleteModal";
import { useGetCategory, useDeleteCategory } from "components/features/categories/hooks";
import { useToast } from "components/ui/toast/ToastContext";

export default function CategoryDetailView() {
  const { t } = useTranslation();
  const MODULE_LABELS = {
    beneficiaries: t("categories.module_beneficiaries"),
    projects:      t("categories.module_projects"),
    blogs:         t("categories.module_blogs"),
    donations:     t("categories.module_donations"),
    campaigns:     t("categories.module_campaigns"),
  };
  const { id }   = useParams();
  const navigate = useNavigate();
  const base = useLayoutBase();

  const { category, execute: fetchCategory, loading, error } = useGetCategory();
  const { execute: deleteCategory, loading: deleteLoading, error: deleteError } = useDeleteCategory();
  const { success, error: toastError } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => { fetchCategory(id); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async () => {
    try {
      await deleteCategory(id);
      success(t("categories.toast_deleted"), `"${category?.name}" ${t("categories.toast_deleted_sub")}`);
      navigate(`${base}/categories`);
    } catch (err) {
      toastError(t("categories.toast_delete_failed"), err?.message);
    }
  };

  if (loading)   return <Loading text={t("categories.loading")} />;
  if (error)     return <AlertBanner message={error} />;
  if (!category) return null;

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdCategory className="h-5 w-5" />}
        title={category.name}
        subtitle={t("categories.detail_subtitle")}
        actions={
          <>
            <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text={t("categories.back")} onClick={() => navigate(`${base}/categories`)} />
            <DropdownButton
              label={t("categories.actions")}
              items={[
                { label: t("categories.edit_category"),   icon: <MdEdit className="h-4 w-4" />,          onClick: () => navigate(`${base}/categories/${id}/edit`) },
                { divider: true },
                { label: t("categories.delete_category"), icon: <MdDeleteOutline className="h-4 w-4" />, onClick: () => setDeleteOpen(true), variant: "danger" },
              ]}
            />
          </>
        }
      />

      <AlertBanner message={deleteError} />

      {/* ── Profile card ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-24 w-full bg-gradient-to-br from-green/10 via-green/5 to-green-50">
          <div className="h-full w-full bg-dot-green bg-[size:20px_20px] opacity-40" />
        </div>
        <div className="px-6 pb-6">
          <div className="-mt-8 mb-4 flex items-end justify-between">
            <div
              className={`flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl ring-4 ring-white shadow-md ${!category.hex_color ? "bg-green/10 text-green" : ""}`}
              style={category.hex_color ? { background: category.hex_color, color: category.text_color || undefined } : undefined}
            >
              <MdCategory className="h-7 w-7" />
            </div>
            <div className="flex items-center gap-2">
              {category.module && (
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 capitalize">
                  {MODULE_LABELS[category.module] ?? category.module}
                </span>
              )}
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                category.is_active ? "bg-green/10 text-green" : "bg-slate-100 text-slate-500"
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${category.is_active ? "bg-green animate-pulse" : "bg-slate-400"}`} />
                {category.is_active ? t("categories.status_active") : t("categories.status_inactive")}
              </span>
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-900">{category.name}</h2>
          {category.name_ar && (
            <p className="mt-0.5 text-base font-semibold text-slate-500" dir="rtl">{category.name_ar}</p>
          )}
          <p className="mt-1 font-mono text-xs text-slate-400">{category.slug}</p>
          {category.description && (
            <p className="mt-2 text-sm text-slate-500">{category.description}</p>
          )}
        </div>
      </div>

      {/* ── Category Information ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <FormHeader icon={<MdCategory className="h-5 w-5" />} title={t("categories.section_title")} subtitle={t("categories.detail_subtitle")} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow icon={<MdTextFields className="h-4 w-4" />}  label={t("categories.name_info")}   value={category.name} />
          {category.name_ar && (
            <InfoRow icon={<MdTextFields className="h-4 w-4" />} label={t("categories.name_ar_info")} value={<span dir="rtl">{category.name_ar}</span>} />
          )}
          <InfoRow icon={<MdLink className="h-4 w-4" />}        label={t("categories.slug_info")}   value={<span className="font-mono text-xs">{category.slug}</span>} />
          <InfoRow icon={<MdApps className="h-4 w-4" />}        label={t("categories.module_info")} value={MODULE_LABELS[category.module] ?? category.module ?? "—"} />
          <InfoRow icon={<MdSort className="h-4 w-4" />}        label={t("categories.order_info")}  value={category.order ?? "—"} />
          <InfoRow icon={<MdCheckCircle className="h-4 w-4" />} label={t("categories.status_info")} value={category.is_active ? t("categories.status_active") : t("categories.status_inactive")} />
          {category.parent && (
            <InfoRow icon={<MdAccountTree className="h-4 w-4" />} label={t("categories.parent_info")} value={<span className="font-mono text-xs">{category.parent}</span>} />
          )}
          {category.hex_color && (
            <InfoRow
              icon={<MdPalette className="h-4 w-4" />}
              label={t("categories.bg_color_info")}
              value={
                <div className="flex items-center gap-2">
                  <span className="h-5 w-5 rounded-md border border-slate-200 shadow-sm" style={{ background: category.hex_color }} />
                  <span className="font-mono text-xs">{category.hex_color}</span>
                </div>
              }
            />
          )}
          {category.text_color && (
            <InfoRow
              icon={<MdPalette className="h-4 w-4" />}
              label={t("categories.text_color_info")}
              value={
                <div className="flex items-center gap-2">
                  <span className="h-5 w-5 rounded-md border border-slate-200 shadow-sm" style={{ background: category.text_color }} />
                  <span className="font-mono text-xs">{category.text_color}</span>
                </div>
              }
            />
          )}
        </div>

        {/* Description bilingual */}
        {(category.description || category.description_ar) && (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {category.description && (
              <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                <p className="mb-1 text-xs font-medium text-slate-400">{t("categories.description_info")}</p>
                <p className="text-sm text-slate-700">{category.description}</p>
              </div>
            )}
            {category.description_ar && (
              <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3" dir="rtl">
                <p className="mb-1 text-xs font-medium text-slate-400">{t("categories.description_ar_info")}</p>
                <p className="text-sm text-slate-700">{category.description_ar}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Children ── */}
      {category.children?.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdSubdirectoryArrowRight className="h-5 w-5" />} title={t("categories.sub_categories")} subtitle={t("categories.sub_categories_sub")} />
          <div className="flex flex-col gap-2">
            {category.children.map((child) => (
              <button
                key={child.id}
                onClick={() => navigate(`${base}/categories/${child.id}`)}
                className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-start transition-all duration-150 hover:border-green/30 hover:bg-green/5"
              >
                <div className="flex items-center gap-3">
                  <MdCategory className="h-4 w-4 shrink-0 text-green" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{child.name}</p>
                    {child.name_ar && <p className="text-xs text-slate-400" dir="rtl">{child.name_ar}</p>}
                    <p className="font-mono text-xs text-slate-400">{child.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {child.module && (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 capitalize">
                      {MODULE_LABELS[child.module] ?? child.module}
                    </span>
                  )}
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                    child.is_active ? "bg-green/10 text-green" : "bg-slate-100 text-slate-400"
                  }`}>
                    <span className={`h-1 w-1 rounded-full ${child.is_active ? "bg-green" : "bg-slate-400"}`} />
                    {child.is_active ? t("categories.status_active") : t("categories.status_inactive")}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <CategoryDeleteModal
        open={deleteOpen}
        category={category}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
