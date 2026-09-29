import React, { useState, useMemo } from "react";
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
import { useGetProjects, useGetProject } from "components/features/projects/hooks";
import { useGetBeneficiaries } from "components/features/beneficiaries/hooks";
import { useToast } from "components/ui/toast/ToastContext";

const RULES = {
  project:     [{ required: true }],
  beneficiary: [{ required: true }],
};

const EMPTY = { project: "", beneficiary: "" };

const idsOf = (classifications) => (classifications ?? []).map((c) => c.id ?? c);

export default function ApplicationCreateForm() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const base = useLayoutBase();
  const { execute: createApplication, loading, error } = useCreateApplication();
  const { success, error: toastError } = useToast();
  const { projects, loading: projectsLoading } = useGetProjects();
  const { beneficiaries, loading: beneficiariesLoading } = useGetBeneficiaries();
  const { project, execute: fetchProject, loading: projectLoading } = useGetProject();

  const [formData, setFormData] = useState(EMPTY);
  const [errors, setErrors]     = useState({});

  // The backend rejects an application when the project has target
  // classifications and the beneficiary is in none of them — so once a project
  // is picked, only offer beneficiaries who can actually apply to it.
  const selectedProject = project?.id === formData.project ? project : null;
  const targetIds = useMemo(() => idsOf(selectedProject?.classifications), [selectedProject]);
  const eligible = useMemo(() => (
    targetIds.length === 0
      ? beneficiaries
      : beneficiaries.filter((b) => idsOf(b.classifications).some((id) => targetIds.includes(id)))
  ), [beneficiaries, targetIds]);

  const updateFormData = (field, value) => {
    setFormData((p) => ({ ...p, [field]: value }));
    if (field === "project" && value) {
      fetchProject(value)
        .then((proj) => {
          const ids = idsOf(proj?.classifications);
          if (!ids.length) return;
          // Drop a previously picked beneficiary the new project doesn't accept.
          setFormData((p) => {
            const b = beneficiaries.find((x) => x.id === p.beneficiary);
            return b && !idsOf(b.classifications).some((id) => ids.includes(id)) ? { ...p, beneficiary: "" } : p;
          });
        })
        .catch(() => {}); // surfaced via the create call's 400 if it matters
    }
  };

  const projectOptions = projects.map((p) => ({ value: p.id, label: p.title }));
  const beneficiaryOptions = eligible.map((b) => ({ value: b.id, label: `${b.user?.full_name} (${b.user?.email})` }));
  const targetNames = (selectedProject?.classifications ?? [])
    .map((c) => (i18n.language === "ar" && c.name_ar) || c.name)
    .filter(Boolean)
    .join(", ");

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
          {formData.project && !projectLoading && targetIds.length > 0 && (
            <p className={`mt-2 text-xs ${eligible.length ? "text-slate-500" : "text-red-500"}`}>
              {eligible.length
                ? t("applications.eligible_hint", { classifications: targetNames })
                : t("applications.no_eligible", { classifications: targetNames })}
            </p>
          )}
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
