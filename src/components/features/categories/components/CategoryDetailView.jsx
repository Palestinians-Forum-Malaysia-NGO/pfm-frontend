import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdArrowBack, MdEdit, MdDeleteOutline, MdCategory,
  MdBadge, MdLink, MdTextFields, MdCheckCircle,
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
  const { id }   = useParams();
  const navigate = useNavigate();

  const { category, execute: fetchCategory, loading, error } = useGetCategory();
  const { execute: deleteCategory, loading: deleteLoading, error: deleteError } = useDeleteCategory();
  const { success, error: toastError } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => { fetchCategory(id); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async () => {
    try {
      await deleteCategory(id);
      success("Category deleted", `"${category?.name}" has been removed.`);
      navigate("/admin/categories");
    } catch (err) {
      toastError("Failed to delete category", err?.message);
    }
  };

  if (loading)   return <Loading text="Loading category…" />;
  if (error)     return <AlertBanner message={error} />;
  if (!category) return null;

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdCategory className="h-5 w-5" />}
        title={category.name}
        subtitle="Category Details"
        actions={
          <>
            <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text="Categories" onClick={() => navigate("/admin/categories")} />
            <DropdownButton
              label="Actions"
              items={[
                { label: "Edit Category",   icon: <MdEdit className="h-4 w-4" />,          onClick: () => navigate(`/admin/categories/${id}/edit`) },
                { divider: true },
                { label: "Delete Category", icon: <MdDeleteOutline className="h-4 w-4" />, onClick: () => setDeleteOpen(true), variant: "danger" },
              ]}
            />
          </>
        }
      />

      <AlertBanner message={deleteError} />

      {/* ── Profile card ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div
          className="h-24 w-full"
          style={{ background: "linear-gradient(135deg, #007A3D18 0%, #007A3D08 50%, #e2f5eb 100%)" }}
        >
          <div
            className="h-full w-full opacity-40"
            style={{ backgroundImage: "radial-gradient(circle, #007A3D22 1px, transparent 1px)", backgroundSize: "20px 20px" }}
          />
        </div>
        <div className="px-6 pb-6">
          <div className="-mt-8 mb-4 flex items-end justify-between">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-green/10 ring-4 ring-white shadow-md text-green">
              <MdCategory className="h-7 w-7" />
            </div>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
              category.is_active ? "bg-green/10 text-green" : "bg-slate-100 text-slate-500"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${category.is_active ? "bg-green animate-pulse" : "bg-slate-400"}`} />
              {category.is_active ? "Active" : "Inactive"}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">{category.name}</h2>
          <p className="mt-1 font-mono text-xs text-slate-400">{category.slug}</p>
          {category.description && (
            <p className="mt-2 text-sm text-slate-500">{category.description}</p>
          )}
        </div>
      </div>

      {/* ── Category Information ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <FormHeader icon={<MdCategory className="h-5 w-5" />} title="Category Information" subtitle="Full details for this category" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow icon={<MdTextFields className="h-4 w-4" />}  label="Name"   value={category.name} />
          <InfoRow icon={<MdLink className="h-4 w-4" />}        label="Slug"   value={category.slug} />
          <InfoRow icon={<MdCheckCircle className="h-4 w-4" />} label="Status" value={category.is_active ? "Active" : "Inactive"} />
          <InfoRow icon={<MdBadge className="h-4 w-4" />}       label="ID"     value={category.id} />
        </div>
        {category.description && (
          <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
            <p className="mb-1 text-xs font-medium text-slate-400">Description</p>
            <p className="text-sm text-slate-700">{category.description}</p>
          </div>
        )}
      </div>

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
