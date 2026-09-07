const RowIconButton = ({ icon, onClick, title, variant = "default", disabled = false }) => {
  const cls = {
    default: "text-slate-400 enabled:hover:text-slate-700 enabled:hover:bg-slate-100",
    danger:  "text-slate-400 enabled:hover:text-red-500  enabled:hover:bg-red-50",
    primary: "text-slate-400 enabled:hover:text-green    enabled:hover:bg-green/10",
  }[variant] ?? "";

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-200 ease-in-out enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:select-none ${cls}`}
    >
      {icon}
    </button>
  );
};

export default RowIconButton;
