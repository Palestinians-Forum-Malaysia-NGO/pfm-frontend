import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MdPeople } from "react-icons/md";
import Modal from "components/ui/modals/Modal";
import Button from "components/ui/buttons/Button";
import { MultiSelect } from "components/form";
import { useGetStaffs } from "components/features/staff/hooks";

const AssignStaffModal = ({ open, onClose, onConfirm, loading }) => {
  const { t } = useTranslation();
  const { staffs, loading: staffsLoading } = useGetStaffs();
  const [userIds, setUserIds] = useState([]);

  useEffect(() => { if (open) setUserIds([]); }, [open]);

  const options = staffs.map((s) => ({
    value: s.user?.id,
    label: `${s.user?.full_name} (${s.user?.email})`,
  }));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t("projects.assign_staff_title")}
      subtitle={t("projects.assign_staff_subtitle")}
      icon={<MdPeople size={20} className="text-green" />}
      footer={
        <div className="flex gap-2">
          <Button variant="ghost" text={t("projects.cancel")} onClick={onClose} disabled={loading} className="flex-1" />
          <Button
            variant="primary"
            text={t("projects.assign_staff_btn")}
            loading={loading}
            disabled={!userIds.length}
            onClick={() => onConfirm(userIds)}
            className="flex-1"
          />
        </div>
      }
    >
      <MultiSelect
        label={t("projects.select_staff")}
        field="user_ids"
        required={false}
        placeholder={staffsLoading ? t("projects.loading_staff") : t("projects.select_staff_placeholder")}
        options={options}
        formData={{ user_ids: userIds }}
        errors={{}}
        updateFormData={(_, value) => setUserIds(value)}
      />
    </Modal>
  );
};

export default AssignStaffModal;
