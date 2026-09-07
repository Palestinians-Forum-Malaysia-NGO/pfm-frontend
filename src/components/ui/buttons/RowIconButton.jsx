const RowIconButton = ({ icon, onClick, title, variant = "default" }) => {
  const cls = {
    default: "text-slate-400 hover:text-slate-700 hover:bg-slate-100",
    danger:  "text-slate-400 hover:text-red-500  hover:bg-red-50",
    primary: "text-slate-400 hover:text-green    hover:bg-green/10",
  }[variant] ?? "";

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-200 active:scale-[0.95] ${cls}`}
    >
      {icon}
    </button>
  );
};

export default RowIconButton;
