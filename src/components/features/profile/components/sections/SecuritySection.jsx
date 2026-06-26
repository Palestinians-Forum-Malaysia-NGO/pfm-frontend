import React from "react";
import { useNavigate } from "react-router-dom";
import { MdLock } from "react-icons/md";
import FormHeader from "components/ui/form/FormHeader";
import Button from "components/ui/buttons/Button";

const SecuritySection = () => {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <FormHeader
        icon={<MdLock className="h-5 w-5" />}
        title="Security"
        subtitle="Manage your password and authentication"
      />
      <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200/80">
            <MdLock className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Password</p>
            <p className="text-xs text-slate-400">Change your account password</p>
          </div>
        </div>
        <Button variant="ghost" text="Change" onClick={() => navigate("/auth/change-password")} />
      </div>
    </div>
  );
};

export default SecuritySection;
