import React from "react";

export default function Footer() {
  return (
    <div className="mx-auto flex w-full max-w-screen-sm items-center justify-center px-5 pb-4 lg:max-w-full xl:pb-6">
      <p className="text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Palestinian Forum Malaysia. All Rights Reserved.
      </p>
    </div>
  );
}
