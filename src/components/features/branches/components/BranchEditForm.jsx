import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdArrowBack, MdEdit, MdBusiness } from "react-icons/md";
import useLayoutBase from "hooks/useLayoutBase";
import PageHeader   from "components/ui/PageHeader";
import { InputField, ToggleInput, validate } from "components/form";
import Button       from "components/ui/buttons/Button";
import FormHeader   from "components/ui/form/FormHeader";
import AlertBanner  from "components/ui/AlertBanner";
import Loading      from "components/loading/Loading";
import { useGetBranch, useUpdateBranch } from "components/features/branches/hooks";
import { useToast } from "components/ui/toast/ToastContext";

const RULES = {
  name:    [{ required: true }, { maxLength: 150 }],
  name_ar: [{ required: true }, { maxLength: 150 }],
};

const EMPTY = { name: "", name_ar: "", is_active: true };

export default function BranchEditForm() {
  const { t } = useTranslation();
  const { id }   = useParams();
  const navigate = useNavigate();
  const base = useLayoutBase();

  const { execute: fetchBranch, loading, error: loadError } = useGetBranch();
  const { execute: updateBranch, loading: saving, error: saveError } = useUpdateBranch();
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState(EMPTY);
  const [initial, setInitial]   = useState(null);
  const [errors, setErrors]     = useState({});

  const updateFormData = (field, value) => setFormData((p) => ({ ...p, [field]: value }));

  const isDirty = !initial || JSON.stringify(formData) !== JSON.stringify(initial);

  const hasErrors = Object.entries(RULES).some(([field, rules]) => !!validate(formData[field], rules));

  useEffect(() => {
    fetchBranch(id).then((data) => {
      if (!data) return;
      const snapshot = {
        name:      data.name      ?? "",
        name_ar:   data.name_ar   ?? "",
        is_active: data.is_active ?? true,
      };
      setFormData(snapshot);
      setInitial(snapshot);
    }).catch(() => {});
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.entries(RULES).forEach(([field, rules]) => {
      const err = validate(formData[field], rules);
      if (err) newErrors[field] = err;
    });
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }
    setErrors({});

    try {
      await updateBranch(id, {
        name:      formData.name,
        name_ar:   formData.name_ar,
        is_active: formData.is_active,
      });
      success(t("branches.toast_updated"), `${formData.name} ${t("branches.toast_updated_sub")}`);
      navigate(`${base}/branches/${id}`);
    } catch (err) {
      toastError(t("branches.toast_update_failed"), err?.message);
    }
  };

  if (loading)   return <Loading text={t("branches.loading")} />;
  if (loadError) return <p className="py-12 text-center text-sm text-red-500">{loadError}</p>;

  return (
    <div className="mx-auto max-w-5xl flex flex-col rounded-2xl border border-slate-200 bg-white">

      <PageHeader
        icon={<MdEdit className="h-5 w-5" />}
        title={t("branches.edit_title")}
        subtitle={formData.name || t("branches.detail_subtitle")}
        className="p-6 border-b border-slate-200"
        actions={
          <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text={t("branches.back_to_branch")} onClick={() => navigate(`${base}/branches/${id}`)} />
        }
      />

      <AlertBanner message={saveError} className="p-6 border-b border-slate-200" />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col">

        <div className="bg-white p-6 border-b border-slate-200">
          <FormHeader icon={<MdBusiness className="h-5 w-5" />} title={t("branches.section_info")} subtitle={t("branches.section_info_sub")} />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField
              label={t("branches.info_name")} field="name" placeholder="Kuala Lumpur HQ"
              formData={formData} errors={errors} updateFormData={updateFormData} rules={RULES.name}
            />
            <InputField
              label={t("branches.info_name_ar")} field="name_ar" placeholder="المقر الرئيسي كوالالمبور"
              formData={formData} errors={errors} updateFormData={updateFormData} rules={RULES.name_ar}
            />
          </div>
          <ToggleInput label={t("branches.info_active")} field="is_active" formData={formData} errors={errors} updateFormData={updateFormData} />
        </div>

        <div className="flex gap-3 p-6">
          <Button variant="ghost" text={t("branches.cancel")} onClick={() => navigate(`${base}/branches/${id}`)} className="flex-1" />
          <Button
            type="submit" variant="primary" text={t("branches.save_changes")}
            loading={saving}
            disabled={hasErrors || !isDirty || saving}
            className="flex-1"
          />
        </div>
      </form>
    </div>
  );
}
