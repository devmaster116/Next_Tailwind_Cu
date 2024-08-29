import React, { MouseEventHandler, useContext, useState, forwardRef, Ref, useEffect } from "react";
import styles from "./ViewStaffModal.module.scss";
import { Avatar } from "./base/avatar";
import { FormContext } from "@/app/context/StaffContext";
import { CancelSvg } from "@/app/assets/svg/cancel";
import { twMerge } from "tailwind-merge";
import { useParams, useRouter, useSearchParams } from "next/navigation";

interface ViewStaffModalProps {
  show: boolean;
  isExiting: boolean;
  title: string | null;
  content: React.ReactNode;
  onClose: MouseEventHandler;
  setIsExiting: (status: boolean) => void;
}

const ViewStaffModal = forwardRef<HTMLDivElement, ViewStaffModalProps>(
  ({ show, title, onClose, content, isExiting, setIsExiting }, ref) => {
  const { currentStaff } = useContext(FormContext)!;
  // const searchParams = useSearchParams()

    const handleClose = () => {
      setIsExiting(true);
      setTimeout(onClose, 500);
    };

    if (!show) {
      return null;
    }

    return (
      <div className={styles.modalOverlay} ref={ref}>
        <div
          className={twMerge(
            styles.modal,
            isExiting ? styles.exit : styles.enter
          )}
        >
          <div className="relative flex items-center justify-center px-4 pt-4 py-4 pl-1 border-gray-100 border mb-5">
            <p className="font-semibold text-gray-800 text-[18px] leading-[28px] lg:text-[20px] lg:leading-[30px]">
              {currentStaff?.firstName + " " + currentStaff?.lastName}
            </p>
            <Avatar
              icon={<CancelSvg />}
              classOverride={{
                container: 'absolute left-4 top-4',
              }}
              onClick={handleClose}
            />
          </div>
          <div className={styles.content}>{content}</div>
        </div>
      </div>
    );
  }
);

ViewStaffModal.displayName = "ViewStaffModal";

export default ViewStaffModal;

