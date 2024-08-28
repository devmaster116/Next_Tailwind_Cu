import React, { MouseEventHandler, useContext, useState } from "react";
import styles from "./ViewStaffModal.module.scss";
import { useFormStep } from "@/app/hooks/useFormStep";
import Image from "next/image";
import { CancelSvg } from "@/app/assets/svg/cancel";
import { Avatar } from "./base/avatar";
import { FormContext } from "@/app/context/StaffContext";

const ViewStaffModal = ({
  show,
  title,
  onClose,
  content
}: {
  show: boolean;
  title: string | null;
  onClose: MouseEventHandler;
  content:  React.ReactNode
}) => {
  if (!show) {
    return null;
  }
  const [isExiting, setIsExiting] = useState(false);
  const { currentStaff } = useContext(FormContext)!

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 500);
  };

  return (
    <div className={styles.modalOverlay}>
      <div
        className={`${styles.modal} ${isExiting ? styles.exit : ""}`}
        onClick={e => e.stopPropagation()}
      >
           <div className="relative flex items-center justify-center px-4 pt-4 py-4 pl-1 border-gray-100 border mb-5">
                <p className="font-semibold  text-gray-800 text-[18px] leading-[28px] lg:text-[20px] lg:leading-[30px]">{currentStaff?.firstName+ " "+ currentStaff?.lastName}</p>
                <Avatar 
                  icon={<CancelSvg />}
                  classOverride={{
                    container: 'absolute left-4 top-4',
                }}
                  onClick={handleClose}
                />
            
              </div>
      <div className={styles.content}>
        {content}
      </div>
      </div>
    </div>
  );
};

export default ViewStaffModal;
