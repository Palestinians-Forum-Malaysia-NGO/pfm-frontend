import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdArrowBack, MdAdd, MdFactCheck } from "react-icons/md";
import useLayoutBase from "hooks/useLayoutBase";
import PageHeader   from "components/ui/PageHeader";
import { SearchableSelect, validate } from "components/form";
import Button       from "components/ui/buttons/Button";
import FormHeader   from "components/ui/form/FormHeader";
import AlertBanner  from "components/ui/AlertBanner";
import Loading      from "components/loading/Loading";
import { useCreateApplication } from "components/features/applications/hooks";
import { useGetProjects } from "components/features/projects/hooks";
import { useGetBeneficiaries } from "components/features/beneficiaries/hooks";
import { useToast } from "components/ui/toast/ToastContext";

const RULES = {
  project:     [{ required: true }],
  beneficiary: [{ required: true }],
};

const EMPTY = { project: "", beneficiary: "" };

export default function ApplicationCreateForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const base = useLayoutBase();
  const { execute: createApplication, loading, error } = useCreateApplication();
  const { success, error: toastError } = useToast();
  const { projects, loading: projectsLoading } = useGetProjects();
  const { beneficiaries, loading: beneficiariesLoading } = useGetBeneficiaries();

  const [formData, setFormData] = useState(EMPTY);
  const [errors, setErrors]     = useState({});

  const updateFormData = (field, value) => setFormData((p) => ({ ...p, [field]: value }));

  const projectOptions = projects.map((p) => ({ value: p.id, label: p.title }));
  const beneficiaryOptions = beneficiaries.map((b) => ({ value: b.id, label: `${b.user?.full_name} (${b.user?.email})` }));

  const canSubmit = !Object.entries(RULES).some(([field, rules]) => !!validate(formData[field], rules));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.entries(RULES).forEach(([field, rules]) => {
      const err = validate(formData[field], rules);
      if (err) newErrors[field] = err;
    });
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    try {
      const created = await createApplication({
        project:     formData.project,
        beneficiary: formData.beneficiary,
      });
      success(t("applications.toast_created"), t("applications.toast_created_sub"));
      navigate(`${base}/applications/${created.id}`);
    } catch (err) {
      toastError(t("applications.toast_create_failed"), err?.message);
    }
  };

  if (projectsLoading || beneficiariesLoading) return <Loading text={t("applications.loading")} />;

  return (
    <div className="mx-auto max-w-5xl flex flex-col rounded-2xl border border-slate-200 bg-white">

      <PageHeader
        icon={<MdAdd className="h-5 w-5" />}
        title={t("applications.add_title")}
        subtitle={t("applications.add_subtitle")}
        className="p-6 border-b border-slate-200"
        actions={
          <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text={t("applications.back")} onClick={() => navigate(`${base}/applications`)} />
        }
      />

      <AlertBanner message={error} className="p-6 border-b border-slate-200" />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col">

        <div className="bg-white p-6 border-b border-slate-200">
          <FormHeader icon={<MdFactCheck className="h-5 w-5" />} title={t("applications.section_info")} subtitle={t("applications.section_info_sub")} />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <SearchableSelect
              label={t("applications.info_project")} field="project" placeholder={t("applications.select_project")}
              options={projectOptions}
              formData={formData} errors={errors} updateFormData={updateFormData} rules={RULES.project}
            />
            <SearchableSelect
              label={t("applications.info_beneficiary")} field="beneficiary" placeholder={t("applications.select_beneficiary")}
              options={beneficiaryOptions}
              formData={formData} errors={errors} updateFormData={updateFormData} rules={RULES.beneficiary}
            />
          </div>
        </div>

        <div className="flex gap-3 p-6">
          <Button variant="ghost" text={t("applications.cancel")} onClick={() => navigate(`${base}/applications`)} className="flex-1" />
          <Button
            type="submit" variant="primary" text={t("applications.create_btn")}
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
