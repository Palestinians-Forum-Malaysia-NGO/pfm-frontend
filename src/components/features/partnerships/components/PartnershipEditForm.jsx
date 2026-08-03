import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdArrowBack, MdEdit, MdHandshake } from "react-icons/md";
import useLayoutBase from "hooks/useLayoutBase";
import PageHeader   from "components/ui/PageHeader";
import { InputField, SelectField, StorageImageField, ToggleInput, validate } from "components/form";
import { getNestedValue } from "components/form/utils/getNestedValue";
import Button       from "components/ui/buttons/Button";
import FormHeader   from "components/ui/form/FormHeader";
import AlertBanner  from "components/ui/AlertBanner";
import Loading      from "components/loading/Loading";
import { useGetPartnership, useUpdatePartnership } from "components/features/partnerships/hooks";
import { PARTNERSHIP_TYPES } from "components/features/partnerships/constants/partnershipTypes";
import { useToast } from "components/ui/toast/ToastContext";

const RULES = {
  name:             [{ required: true }, { maxLength: 200 }],
  logo:             [{ required: true }],
  partnership_type: [{ required: true }],
  website_url:      [{ maxLength: 500 }, { url: true }],
};

const EMPTY = {
  name: "", logo: null, logoUrl: null, partnership_type: "", website_url: "", order: "0", is_active: true,
};

export default function PartnershipEditForm() {
  const { t } = useTranslation();
  const { id }   = useParams();
  const navigate = useNavigate();
  const base = useLayoutBase();

  const { execute: fetchPartnership, loading, error: loadError } = useGetPartnership();
  const { execute: updatePartnership, loading: saving, error: saveError } = useUpdatePartnership();
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState(EMPTY);
  const [initial, setInitial]   = useState(null);
  const [errors, setErrors]     = useState({});

  const updateFormData = (field, value) => setFormData((p) => ({ ...p, [field]: value }));

  const TYPE_OPTIONS = PARTNERSHIP_TYPES.map((v) => ({ value: v, label: t(`partnerships.type_${v}`) }));

  const isDirty = !initial || JSON.stringify(formData) !== JSON.stringify(initial);

  const hasErrors = Object.entries(RULES).some(
    ([field, rules]) => !!validate(getNestedValue(formData, field), rules)
  );

  useEffect(() => {
    fetchPartnership(id).then((data) => {
      if (!data) return;
      const snapshot = {
        name:             data.name             ?? "",
        logo:             data.logo?.file_key    ?? null,
        logoUrl:          data.logo?.public_url  ?? null,
        partnership_type: data.partnership_type  ?? "",
        website_url:      data.website_url       ?? "",
        order:             data.order != null ? String(data.order) : "0",
        is_active:         data.is_active        ?? true,
      };
      setFormData(snapshot);
      setInitial(snapshot);
    }).catch(() => {});
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.entries(RULES).forEach(([field, rules]) => {
      const err = validate(getNestedValue(formData, field), rules);
      if (err) newErrors[field] = err;
    });
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }
    setErrors({});

    const payload = {
      name:             formData.name,
      logo:             formData.logo,
      partnership_type: formData.partnership_type,
      website_url:      formData.website_url || undefined,
      order:             formData.order !== "" ? Number(formData.order) : 0,
      is_active:         formData.is_active,
    };

    try {
      await updatePartnership(id, payload);
      success(t("partnerships.toast_updated"), `${formData.name} ${t("partnerships.toast_updated_sub")}`);
      navigate(`${base}/partnerships/${id}`);
    } catch (err) {
      toastError(t("partnerships.toast_update_failed"), err?.message);
    }
  };

  if (loading)   return <Loading text={t("partnerships.loading")} />;
  if (loadError) return <p className="py-12 text-center text-sm text-red-500">{loadError}</p>;

  return (
    <div className="mx-auto max-w-5xl flex flex-col rounded-2xl border border-slate-200 bg-white">

      <PageHeader
        icon={<MdEdit className="h-5 w-5" />}
        title={t("partnerships.edit_title")}
        subtitle={formData.name || t("partnerships.detail_subtitle")}
        className="p-6 border-b border-slate-200"
        actions={
          <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text={t("partnerships.back_to_partnership")} onClick={() => navigate(`${base}/partnerships/${id}`)} />
        }
      />

      <AlertBanner message={saveError} className="p-6 border-b border-slate-200" />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col">

        <div className="bg-white p-6 border-b border-slate-200">
          <FormHeader icon={<MdHandshake className="h-5 w-5" />} title={t("partnerships.section_info")} subtitle={t("partnerships.section_info_sub")} />
          <StorageImageField
            label={t("partnerships.info_logo")}
            folder="partnerships/logos"
            required
            currentUrl={formData.logoUrl}
            onUpload={(key) => updateFormData("logo", key)}
            onRemove={() => updateFormData("logo", null)}
            errors={errors}
            field="logo"
          />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField
              label={t("partnerships.info_name")} field="name" placeholder="Islamic Relief Malaysia"
              formData={formData} errors={errors} updateFormData={updateFormData} rules={RULES.name}
            />
            <SelectField
              label={t("partnerships.info_type")} field="partnership_type"
              options={TYPE_OPTIONS}
              formData={formData} errors={errors} updateFormData={updateFormData} rules={RULES.partnership_type}
            />
          </div>
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField
              label={t("partnerships.info_website")} field="website_url" placeholder="https://example.org" required={false}
              formData={formData} errors={errors} updateFormData={updateFormData} rules={RULES.website_url}
            />
            <InputField
              label={t("partnerships.info_order")} field="order" type="number" placeholder="0"
              required={false}
              formData={formData} errors={errors} updateFormData={updateFormData}
            />
          </div>
          <ToggleInput label={t("partnerships.info_active")} field="is_active" formData={formData} errors={errors} updateFormData={updateFormData} />
        </div>

        <div className="flex gap-3 p-6">
          <Button variant="ghost" text={t("partnerships.cancel")} onClick={() => navigate(`${base}/partnerships/${id}`)} className="flex-1" />
          <Button
            type="submit" variant="primary" text={t("partnerships.save_changes")}
            loading={saving}
            disabled={hasErrors || !isDirty || saving}
            className="flex-1"
          />
        </div>
      </form>
    </div>
  );
}
