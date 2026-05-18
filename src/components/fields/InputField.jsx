// Custom components
import React from "react";

function InputField(props) {
 const { label, id, extra, type, placeholder, variant, state, disabled } =
 props;

 return (
 <div className={`${extra}`}>
 <label
 htmlFor={id}
 className={`text-sm text-navy-700 ${
 variant === "auth" ? "ml-1.5 font-medium" : "ml-3 font-bold"
 }`}
 >
 {label}
 </label>
 <input
 disabled={disabled}
 type={type}
 id={id}
 placeholder={placeholder}
 className={`mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none ${
 disabled === true
 ? "!border-none !bg-gray-100"
 : state === "error"
 ? "border-red-500 text-red-500 placeholder:text-red-500"
 : state === "success"
 ? "border-green-500 text-green-500 placeholder:text-green-500"
 : "border-gray-200"
 }`}
 />
 </div>
 );
}

export default InputField;
