import { useState } from "react";
import { reportService } from "../services/reportService";
import { extractError } from "components/features/auth/utils";

const useExportOrganizationReport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async () => {
    setLoading(true);
    setError(null);
    try {
      const blob = await reportService.exportOrganizationReport();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `organization-report-${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const msg = extractError(err, "Failed to export report.");
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export default useExportOrganizationReport;
