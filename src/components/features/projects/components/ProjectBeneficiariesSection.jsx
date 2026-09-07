import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  MdPeople, MdClose, MdChevronLeft, MdChevronRight,
  MdOpenInNew, MdInsertDriveFile,
} from "react-icons/md";
import FormHeader from "components/ui/form/FormHeader";
import FilterSelect from "components/ui/FilterSelect";
import SearchInput from "components/form/SearchInput";
import Button from "components/ui/buttons/Button";
import useStorageUrl from "components/features/storage/hooks/useStorageUrl";
import useGetProjectBeneficiaries from "components/features/projects/hooks/useGetProjectBeneficiaries";
import { useGetClassifications } from "components/features/classifications/hooks";
import { useGetCategories } from "components/features/categories/hooks";
import { ACCOUNT_STATUS_OPTIONS } from "components/features/beneficiaries/constants/beneficiary";
import { isSafeUrl } from "utils/url";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" }) : "—";

function ProofCell({ fileKey }) {
  const { t } = useTranslation();
  const { url } = useStorageUrl(fileKey, { forcePresigned: true });
  if (!fileKey) return <span className="text-slate-300">—</span>;
  if (!url) return <span className="text-xs text-slate-400">{t("projects.beneficiaries_loading_proof")}</span>;
  if (!isSafeUrl(url)) return <span className="text-slate-300">—</span>;
  return (
    <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-green hover:underline">
      <MdInsertDriveFile className="h-3.5 w-3.5" /> {t("projects.beneficiaries_view_proof")} <MdOpenInNew className="h-3 w-3" />
    </a>
  );
}

export default function ProjectBeneficiariesSection({ projectId }) {
  const { t, i18n } = useTranslation();
  const { beneficiaries, count, hasNext, hasPrev, execute, loading, error } = useGetProjectBeneficiaries();
  const { classifications } = useGetClassifications();
  const { categories } = useGetCategories({ module: "beneficiaries" });

  const [search, setSearch]               = useState("");
  const [statusFilter, setStatusFilter]   = useState("all");
  const [classificationFilter, setClassificationFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [year, setYear]                   = useState("");
  const [page, setPage]                   = useState(1);

  const params = useMemo(() => {
    const p = { page };
    if (search.trim())              p.search = search.trim();
    if (statusFilter !== "all")     p.status = statusFilter;
    if (classificationFilter !== "all") p.classification = classificationFilter;
    if (categoryFilter !== "all")   p.category = categoryFilter;
    if (year)                       p.year = year;
    return p;
  }, [page, search, statusFilter, classificationFilter, categoryFilter, year]);

  useEffect(() => { execute(projectId, params); }, [projectId, params]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { setPage(1); }, [search, statusFilter, classificationFilter, categoryFilter, year]);

  const STATUS_OPTIONS = ACCOUNT_STATUS_OPTIONS.map((o) => ({
    value: o.value, label: t(`projects.beneficiaries_status_${o.value}`, { defaultValue: o.label }),
  }));

  const CLASSIFICATION_OPTIONS = [
    { value: "all", label: t("projects.beneficiaries_all_classifications") },
    ...classifications.map((c) => ({ value: c.id, label: (c.name_ar && i18n.language === "ar") ? c.name_ar : c.name })),
  ];

  const CATEGORY_OPTIONS = [
    { value: "all", label: t("projects.beneficiaries_all_categories") },
    ...categories.map((c) => ({ value: c.id, label: (c.name_ar && i18n.language === "ar") ? c.name_ar : c.name })),
  ];

  const hasFilters = search !== "" || statusFilter !== "all" || classificationFilter !== "all" || categoryFilter !== "all" || year !== "";
  const clearFilters = () => { setSearch(""); setStatusFilter("all"); setClassificationFilter("all"); setCategoryFilter("all"); setYear(""); };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <FormHeader
        icon={<MdPeople className="h-5 w-5" />}
        title={t("projects.beneficiaries_helped_title")}
        subtitle={t("projects.beneficiaries_helped_sub", { count })}
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <SearchInput value={search} onChange={setSearch} placeholder={t("projects.beneficiaries_search_placeholder")} className="flex-1 min-w-[180px]" />
        <FilterSelect value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} icon={<MdPeople className="h-3.5 w-3.5" />} />
        <FilterSelect value={classificationFilter} onChange={setClassificationFilter} options={CLASSIFICATION_OPTIONS} />
        <FilterSelect value={categoryFilter} onChange={setCategoryFilter} options={CATEGORY_OPTIONS} />
        <input
          value={year}
          onChange={(e) => setYear(e.target.value.replace(/\D/g, "").slice(0, 4))}
          placeholder={t("projects.beneficiaries_year_placeholder")}
          className="w-24 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-green"
        />
        {hasFilters && (
          <Button variant="danger" icon={<MdClose className="h-3.5 w-3.5" />} text={t("projects.clear")} onClick={clearFilters} />
        )}
      </div>

      {error && <p className="py-4 text-center text-sm text-red-500">{error}</p>}

      {loading ? (
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100" />)}
        </div>
      ) : beneficiaries.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">
          {hasFilters ? t("projects.beneficiaries_no_match") : t("projects.beneficiaries_none_yet")}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="border-b border-slate-100">
                {[
                  t("projects.beneficiaries_col_name"),
                  t("projects.beneficiaries_col_proof"),
                  t("projects.beneficiaries_col_note"),
                  t("projects.beneficiaries_col_recorded_by"),
                  t("projects.beneficiaries_col_date"),
                ].map((col) => (
                  <th key={col} className="pb-3 pr-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {beneficiaries.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/60">
                  <td className="py-3 pr-4">
                    <p className="text-sm font-semibold text-slate-900">{r.beneficiary?.full_name}</p>
                    {r.beneficiary?.classifications?.length > 0 && (
                      <div className="mt-0.5 flex flex-wrap gap-1">
                        {r.beneficiary.classifications.map((c) => (
                          <span key={c} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">{c}</span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="py-3 pr-4"><ProofCell fileKey={r.proof} /></td>
                  <td className="py-3 pr-4 text-sm text-slate-600">{r.note || "—"}</td>
                  <td className="py-3 pr-4 text-sm text-slate-500">{r.recorded_by || "—"}</td>
                  <td className="py-3 text-sm text-slate-500">{fmtDate(r.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(hasNext || hasPrev) && (
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
          <p className="text-xs text-slate-400">{t("projects.beneficiaries_page_info", { page, count })}</p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!hasPrev}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <MdChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasNext}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <MdChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
