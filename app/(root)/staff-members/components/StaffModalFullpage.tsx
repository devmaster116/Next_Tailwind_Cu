import React, { MouseEventHandler, useState } from "react";
import styles from "./StaffModalFullPage.module.scss";
import Image from "next/image";
import { useFormStep } from "@/app/hooks/useFormStep";
import { twMerge } from "tailwind-merge";
const StaffModalFullpage = ({
  show,
  // onClose,
  // title,
  content,
  // isExiting,
  // handleGoForwardStep,
  // pageId
}: {
  show: boolean;
  // onClose: MouseEventHandler;
  // title: string;
  content: React.ReactElement;
  confirmButtonText?: string;
  // handleGoForwardStep: MouseEventHandler;
  updateButtonText?: string;
  // pageId:number
  // isExiting: boolean;
}) => {
  const [isExitings, setIsExitings] = useState(false);
  const handleClose = (e: React.MouseEvent) => {
    setIsExitings(true);
    setTimeout(() => {
      setIsExitings(false);
      // onClose(e); // Calls the parent onClose to actually hide the modal
    }, 500); // Duration of the exit animation
  };

  if (!show) {
    return null;
  }
  return (
    <>
        {/* <div className={`${styles.modalOverlay} `}> */}
        <div className={twMerge(
          styles.modalOverlay,
          "!bg-white !items-start",
        )}>
          <div
            // className={`${styles.modal} ${isExiting ? styles.exit : ""}`}
            // onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalContent}>
              {content}
            </div>
            <div className={styles.modalFooter}>
              <button  className={styles.updateBtn}>
              {/* {pageId>3 ? 'Save' : 'Next'}Next */}
              </button>
            </div>
          </div>
        </div>
    </>
  );
};

export default StaffModalFullpage;
