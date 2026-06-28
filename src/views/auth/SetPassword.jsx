import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MdMarkEmailRead, MdArrowForward } from "react-icons/md";
import AlertBanner from "components/ui/AlertBanner";
import { useForgotPassword } from "components/features/auth/hooks";

export default function SetPassword() {
  const [searchParams]   = useSearchParams();
  const email            = searchParams.get("email") ?? "";

  const { execute: forgotPassword, loading, error } = useForgotPassword();
  const [sent, setSent]   = useState(false);
  const [resent, setResent] = useState(false);

  /* Auto-send on mount */
  useEffect(() => {
    if (!email) return;
    forgotPassword({ email })
      .then(() => setSent(true))
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleResend = async () => {
    setResent(false);
    try {
      await forgotPassword({ email });
      setResent(true);
    } catch {}
  };

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100 text-center">

      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green/10">
        <MdMarkEmailRead className="h-8 w-8 text-green" />
      </div>

      <h1 className="mt-5 text-xl font-bold text-navy-700">Check your email</h1>

      <p className="mt-2 text-sm text-slate-400">
        We've sent a <span className="font-semibold text-slate-600">password setup link</span> to{" "}
        <span className="font-semibold text-slate-700">{email || "your email address"}</span>.
        Open the link to create your password and complete your account setup.
      </p>

      <AlertBanner message={error} />

      {resent && (
        <div className="mt-3 rounded-xl border border-green/20 bg-green/5 px-4 py-2.5 text-sm font-medium text-green">
          A new link has been sent.
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={handleResend}
          disabled={loading}
          className="flex h-11 w-full items-center justify-center rounded-full border border-slate-200 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-50 active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
          ) : (
            "Resend link"
          )}
        </button>

        <Link
          to="/auth/sign-in"
          className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-green transition-colors hover:text-green-600"
        >
          Back to sign in <MdArrowForward className="h-4 w-4" />
        </Link>
      </div>

      <p className="mt-6 text-xs text-slate-400">
        Once you've set your password, sign in with your email and new password.
      </p>
    </div>
  );
}
