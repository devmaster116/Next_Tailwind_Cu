import React, { MouseEventHandler, useState } from "react";
import styles from "./ViewStaffModal.module.scss";

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

  // const handleClose = () => {
  //   setIsExiting(true);
  //   setTimeout(onClose, 500);
  // };

  return (
    <div className={styles.modalOverlay}>
      <div
        className={`${styles.modal} ${isExiting ? styles.exit : ""}`}
        onClick={e => e.stopPropagation()}
      >
        {/* <div className={styles.headerContent}>
          <button className={styles.closeButton} onClick={handleClose}>
            <Image
              className={styles.icon}
              src="/icons/x-close.svg"
              height={12}
              width={12}
              alt="Close icon"
            />
          </button>
          <h2 className={styles.title}>{title}</h2>
        </div> */}
      <div className={styles.content}>
        {content}
      </div>
      </div>
    </div>
  );
};

export default ViewStaffModal;
