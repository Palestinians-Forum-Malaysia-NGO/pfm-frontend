// Custom components
import React from "react";

function InputField(props) {
 const { label, id, extra, placeholder, cols, rows, state, disabled } = props;

 return (
 <div className={`${extra}`}>
 <label
 htmlFor={id}
 className="ml-3 mb-2 text-sm font-bold text-navy-700"
 >
 {label}
 </label>
 <div>
 <textarea
 cols={cols}
 rows={rows}
 placeholder={placeholder}
 className={`flex w-full items-center justify-center rounded-xl border bg-white/0 pl-3 pt-3 text-sm outline-none ${
 disabled === true
 ? "!border-none !bg-gray-100"
 : state === "error"
 ? "!border-red-500 text-red-500 placeholder:text-red-500"
 : state === "success"
 ? "!border-green-500 text-green-500 placeholder:text-green-500"
 : disabled === true
 ? "!border-none !bg-gray-100"
 : "border-gray-200"
 }`}
 name={id}
 id={id}
 />
 </div>
 </div>
 );
}

export default InputField;
