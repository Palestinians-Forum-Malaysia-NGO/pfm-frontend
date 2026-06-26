import React from "react";
import { MdPerson } from "react-icons/md";
import PageHeader from "components/ui/PageHeader";
import AlertBanner from "components/ui/AlertBanner";
import Loading from "components/loading/Loading";
import UserProfileCard from "components/ui/UserProfileCard";
import EditProfileSection from "./sections/EditProfileSection";
import SecuritySection from "./sections/SecuritySection";
import MemberInfoSection from "./sections/MemberInfoSection";
import { useProfile } from "components/features/profile/hooks";

const ProfilePage = () => {
  const { profile, loading, error, refetch } = useProfile();

  if (loading) return <Loading text="Loading profile..." />;
  if (error)   return <AlertBanner message={error} />;
  if (!profile) return null;

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">
      <PageHeader
        icon={<MdPerson className="h-5 w-5" />}
        title="My Profile"
        subtitle="Your account information and settings"
      />

      <UserProfileCard user={profile} showId />

      {profile.role === "member" && <MemberInfoSection profile={profile} />}

      <EditProfileSection profile={profile} onSaved={refetch} />

      <SecuritySection />
    </div>
  );
};

export default ProfilePage;
