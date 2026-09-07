import React from "react";
import { useNavigate } from "react-router-dom";
import { MdCheckCircle, MdChevronRight } from "react-icons/md";

/** tasks: [{ id, label, to? }] */
export default function PendingTasksList({ tasks, loading, emptyText }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        {[1, 2, 3].map((i) => <div key={i} className="h-10 animate-pulse rounded-xl bg-slate-100" />)}
      </div>
    );
  }

  if (!tasks?.length) {
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green/10 text-green">
          <MdCheckCircle className="h-5 w-5" />
        </div>
        <p className="text-sm text-slate-400">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-slate-100">
      {tasks.map((task) => (
        <button
          key={task.id}
          onClick={() => task.to && navigate(task.to)}
          disabled={!task.to}
          className="flex items-center justify-between gap-2 py-3 text-start transition-colors duration-150 hover:bg-slate-50/60 disabled:cursor-default"
        >
          <span className="text-sm text-slate-700">{task.label}</span>
          {task.to && <MdChevronRight className="h-4 w-4 shrink-0 text-slate-300" />}
        </button>
      ))}
    </div>
  );
}
