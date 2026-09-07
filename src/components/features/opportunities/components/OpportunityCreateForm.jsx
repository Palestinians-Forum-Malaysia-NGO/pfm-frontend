import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdArrowBack, MdAdd, MdWork } from "react-icons/md";
import useLayoutBase from "hooks/useLayoutBase";
import PageHeader   from "components/ui/PageHeader";
import { InputField, TextareaField, SelectField, ToggleInput, validate } from "components/form";
import { getNestedValue } from "components/form/utils/getNestedValue";
import Button       from "components/ui/buttons/Button";
import FormHeader   from "components/ui/form/FormHeader";
import AlertBanner  from "components/ui/AlertBanner";
import { useCreateOpportunity } from "components/features/opportunities/hooks";
import { OPPORTUNITY_TYPES, OPPORTUNITY_LOCATIONS } from "components/features/opportunities/constants/opportunityTypes";
import { useToast } from "components/ui/toast/ToastContext";

const RULES = {
  title:                [{ required: true }, { maxLength: 255 }],
  description:          [{ required: true }, { minLength: 10 }, { maxLength: 5000 }],
  type:                 [{ required: true }],
  location:             [{ required: true }],
  available_positions:  [{ required: true }, { min: 0 }],
};

const EMPTY = {
  title: "", description: "", type: "", location: "", available_positions: "1", for_public: true,
};

export default function OpportunityCreateForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const base = useLayoutBase();
  const { execute: createOpportunity, loading, error } = useCreateOpportunity();
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState(EMPTY);
  const [errors, setErrors]     = useState({});

  const updateFormData = (field, value) => setFormData((p) => ({ ...p, [field]: value }));

  const TYPE_OPTIONS = OPPORTUNITY_TYPES.map((v) => ({ value: v, label: t(`opportunities.type_${v}`) }));
  const LOCATION_OPTIONS = OPPORTUNITY_LOCATIONS.map((v) => ({ value: v, label: t(`opportunities.location_${v}`) }));

  const canSubmit = !Object.entries(RULES).some(
    ([field, rules]) => !!validate(getNestedValue(formData, field), rules)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.entries(RULES).forEach(([field, rules]) => {
      const err = validate(getNestedValue(formData, field), rules);
      if (err) newErrors[field] = err;
    });
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    const payload = {
      title:                formData.title,
      description:          formData.description,
      type:                 formData.type,
      location:             formData.location,
      available_positions:  formData.available_positions !== "" ? Number(formData.available_positions) : 0,
      for_public:           formData.for_public,
    };

    try {
      const created = await createOpportunity(payload);
      success(t("opportunities.toast_created"), `${formData.title} ${t("opportunities.toast_created_sub")}`);
      navigate(`${base}/opportunities/${created.id}`);
    } catch (err) {
      toastError(t("opportunities.toast_create_failed"), err?.message);
    }
  };

  return (
    <div className="mx-auto max-w-5xl flex flex-col rounded-2xl border border-slate-200 bg-white">

      <PageHeader
        icon={<MdAdd className="h-5 w-5" />}
        title={t("opportunities.add_title")}
        subtitle={t("opportunities.add_subtitle")}
        className="p-6 border-b border-slate-200"
        actions={
          <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text={t("opportunities.back")} onClick={() => navigate(`${base}/opportunities`)} />
        }
      />

      <AlertBanner message={error} className="p-6 border-b border-slate-200" />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col">

        <div className="bg-white p-6 border-b border-slate-200">
          <FormHeader icon={<MdWork className="h-5 w-5" />} title={t("opportunities.section_info")} subtitle={t("opportunities.section_info_sub")} />
          <InputField
            label={t("opportunities.info_title")} field="title" placeholder="Volunteer Coordinator"
            formData={formData} errors={errors} updateFormData={updateFormData} rules={RULES.title}
          />
          <TextareaField
            label={t("opportunities.info_description")} field="description" rows={5} placeholder={t("opportunities.description_placeholder")}
            formData={formData} errors={errors} updateFormData={updateFormData} rules={RULES.description}
          />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <SelectField
              label={t("opportunities.info_type")} field="type"
              options={TYPE_OPTIONS}
              formData={formData} errors={errors} updateFormData={updateFormData} rules={RULES.type}
            />
            <SelectField
              label={t("opportunities.info_location")} field="location"
              options={LOCATION_OPTIONS}
              formData={formData} errors={errors} updateFormData={updateFormData} rules={RULES.location}
            />
          </div>
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField
              label={t("opportunities.info_positions")} field="available_positions" type="number" placeholder="1"
              formData={formData} errors={errors} updateFormData={updateFormData} rules={RULES.available_positions}
            />
          </div>
          <ToggleInput label={t("opportunities.info_public")} field="for_public" formData={formData} errors={errors} updateFormData={updateFormData} />
        </div>

        <div className="flex gap-3 p-6">
          <Button variant="ghost" text={t("opportunities.cancel")} onClick={() => navigate(`${base}/opportunities`)} className="flex-1" />
          <Button
            type="submit" variant="primary" text={t("opportunities.create_btn")}
            icon={<MdAdd className="h-4 w-4" />}
            loading={loading}
            disabled={!canSubmit || loading}
            className="flex-1"
          />
        </div>

      </form>
    </div>
  );
}
