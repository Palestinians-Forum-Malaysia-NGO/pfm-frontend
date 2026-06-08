import React, { useState, useMemo } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import Loading from "components/loading/Loading";
import EmptyState from "components/empty/empty";
import PrevButton from "components/ui/buttons/PrevButton";
import NextButton from "components/ui/buttons/NextButton";

/**
 * DataTable — reusable table with pagination, loading, error, and empty states.
 *
 * Props:
 *   columns      – array of column defs (see below)
 *   data         – array of row objects
 *   keyField     – field used as React key (default: "id")
 *   loading      – boolean
 *   error        – string | null
 *   onRowClick   – (row) => void — makes rows clickable
 *   selectable   – show checkbox column (default: false)
 *   pageSize     – rows per page (default: 8, pass 0 to disable pagination)
 *   emptyIcon    – ReactNode for empty state
 *   emptyTitle   – string
 *   emptyDesc    – string
 *   emptyAction  – { label, onClick } | { label, href }
 *   minWidth     – table min-width class (default: "min-w-[600px]")
 *   className    – extra classes on the outer wrapper
 *
 * Column definition:
 *   {
 *     key            – unique string
 *     label          – header text
 *     icon           – optional icon beside header label
 *     render         – (row) => ReactNode  (required)
 *     headerClass    – extra class on <th>
 *     cellClass      – extra class on <td>
 *     align          – "left" | "right" | "center" (default: "left")
 *     stopPropagation – prevent row onClick when clicking this cell
 *   }
 */
const DataTable = ({
  columns = [],
  data = [],
  keyField = "id",
  loading = false,
  error = null,
  onRowClick,
  selectable = false,
  pageSize = 8,
  emptyIcon,
  emptyTitle = "No records found",
  emptyDesc,
  emptyAction,
  minWidth = "min-w-[600px]",
  className = "",
}) => {
  const [page, setPage] = useState(1);

  // Reset to page 1 when data changes
  const totalPages = pageSize > 0
    ? Math.max(1, Math.ceil(data.length / pageSize))
    : 1;

  const paginated = useMemo(() => {
    if (pageSize <= 0) return data;
    return data.slice((page - 1) * pageSize, page * pageSize);
  }, [data, page, pageSize]);

  // Reset page if data shrinks and current page is out of range
  React.useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const alignClass = (align) => {
    if (align === "right")  return "text-right";
    if (align === "center") return "text-center";
    return "text-left";
  };

  if (loading) return <Loading text="Loading..." />;
  if (error)   return <p className="py-6 text-center text-sm text-red-500">{error}</p>;

  if (data.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDesc}
        action={emptyAction}
      />
    );
  }

  return (
    <div className={className}>
      {/* ── Table ── */}
      <div className="overflow-x-auto rounded-lg rounded-b-none border border-b-0 border-slate-200">
        <table className={`w-full ${minWidth} bg-white text-sm`}>

          {/* Head */}
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left">
              {selectable && (
                <th className="w-10 px-4 py-3">
                  <input type="checkbox" className="accent-green h-3.5 w-3.5 rounded" />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-xs font-semibold text-slate-500 ${alignClass(col.align)} ${col.headerClass ?? ""}`}
                >
                  {col.icon || col.label ? (
                    <span className="inline-flex items-center gap-1.5">
                      {col.icon}
                      {col.label}
                    </span>
                  ) : null}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-slate-200 bg-white">
            {paginated.map((row) => (
              <tr
                key={row[keyField]}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`bg-white transition-colors duration-150 ease-in-out ${
                  onRowClick ? "cursor-pointer hover:bg-slate-50" : ""
                }`}
              >
                {selectable && (
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" className="accent-green h-3.5 w-3.5" />
                  </td>
                )}
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3 ${alignClass(col.align)} ${col.cellClass ?? ""}`}
                    onClick={col.stopPropagation ? (e) => e.stopPropagation() : undefined}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Footer ── */}
      {pageSize > 0 && (
        <div className="flex flex-col gap-3 rounded-b-xl border border-slate-200 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">

          {/* Result count */}
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
              {data.length}
            </span>
            <span className="text-xs text-slate-400">
              results &mdash; page{" "}
              <span className="font-semibold text-slate-600">{page}</span>
              {" of "}
              <span className="font-semibold text-slate-600">{totalPages}</span>
            </span>
          </div>

          {/* Pagination */}
          <div className={`flex items-center justify-center gap-1 sm:justify-end ${totalPages <= 1 ? "pointer-events-none opacity-40" : ""}`}>
            <PrevButton
              text="Prev"
              icon={<MdChevronLeft className="h-3.5 w-3.5" />}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            />

            <div className="flex items-center gap-1.5 px-2">
              {[0, 1, 2].map((i) => {
                const pos = page === 1 ? 0 : page === totalPages ? 2 : 1;
                return (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-200 ease-in-out ${
                      i === pos ? "w-4 bg-green" : "w-1.5 bg-slate-300"
                    }`}
                  />
                );
              })}
            </div>

            <NextButton
              text="Next"
              icon={<MdChevronRight className="h-3.5 w-3.5" />}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
