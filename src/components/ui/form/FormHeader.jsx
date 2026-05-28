const FormHeader = ({ icon, title, subtitle, actions }) => (
  <div className="mb-6 flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
    {/* Left — icon + title */}
    <div className="flex items-center gap-3 min-w-0">
      {icon && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green/10 text-green">
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <h1 className="truncate text-base font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="truncate text-xs text-slate-400">{subtitle}</p>}
      </div>
    </div>

    {/* Right — actions */}
    {actions && (
      <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
    )}
  </div>
);

export default FormHeader;
