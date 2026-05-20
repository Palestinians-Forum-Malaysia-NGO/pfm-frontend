import React from "react";

const sizeMap = {
  sm: "h-6 w-6 border-2",
  md: "h-10 w-10 border-4",
  lg: "h-14 w-14 border-[5px]",
};

const textSizeMap = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

const Loading = ({ size = "md", text = "Loading...", fullPage = false }) => {
  const wrapper = fullPage
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm"
    : "flex flex-col items-center justify-center py-10";

  return (
    <div className={wrapper}>
      <div
        className={`rounded-full border-slate-200 border-t-green animate-spin ${sizeMap[size]}`}
      />
      {text && (
        <p className={`mt-3 font-medium text-slate-400 ${textSizeMap[size]}`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default Loading;
