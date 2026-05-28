const PageHeader = ({ icon, title, subtitle, actions, className = "" }) => (
  <div className={`mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${className}`}>
    {/* Left — icon + title */}
    <div className="flex min-w-0 items-center gap-3">
      {icon && (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green/10 text-green">
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <h1 className="truncate text-xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="mt-0.5 truncate text-sm text-slate-400">{subtitle}</p>}
      </div>
    </div>

    {/* Right — actions */}
    {actions && (
      <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
    )}
  </div>
);

export default PageHeader;
