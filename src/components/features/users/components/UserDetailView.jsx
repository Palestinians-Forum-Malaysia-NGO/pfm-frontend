import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdArrowBack, MdEdit, MdDeleteOutline, MdPerson } from "react-icons/md";
import Button from "components/ui/buttons/Button";
import PageHeader from "components/ui/PageHeader";
import AlertBanner from "components/ui/AlertBanner";
import UserProfileCard from "components/ui/UserProfileCard";
import UserDeleteModal from "./UserDeleteModal";
import DropdownButton from "components/ui/buttons/DropdownButton";
import Loading from "components/loading/Loading";
import { useGetUser, useDeleteUser } from "components/features/users/hooks";
import { useToast } from "components/ui/toast/ToastContext";

export default function UserDetailView() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const { user, execute: fetchUser, loading, error } = useGetUser();
  const { execute: deleteUser, loading: deleteLoading, error: deleteError } = useDeleteUser();
  const { success, error: toastError } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => { fetchUser(id); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async () => {
    try {
      await deleteUser(id);
      success("User deleted", `${user?.full_name} has been removed.`);
      navigate("/admin/users");
    } catch (err) {
      toastError("Failed to delete user", err?.message);
    }
  };

  if (loading) return <Loading text="Loading user..." />;
  if (error)   return <AlertBanner message={error} />;
  if (!user)   return null;

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdPerson className="h-5 w-5" />}
        title={user.full_name}
        subtitle="User Details"
        actions={
          <>
            <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text="Users" onClick={() => navigate("/admin/users")} />
            <DropdownButton
              label="Actions"
              items={[
                { label: "Edit User",   icon: <MdEdit className="h-4 w-4" />,          onClick: () => navigate(`/admin/users/${id}/edit`) },
                { divider: true },
                { label: "Delete User", icon: <MdDeleteOutline className="h-4 w-4" />, onClick: () => setDeleteOpen(true), variant: "danger" },
              ]}
            />
          </>
        }
      />

      <AlertBanner message={deleteError} />

      <UserProfileCard user={user} />

      <UserDeleteModal
        open={deleteOpen}
        user={user}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
