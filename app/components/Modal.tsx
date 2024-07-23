import React, { MouseEventHandler } from "react";
import styles from "./Modal.module.scss";

const Modal = ({
  show,
  onClose,
  title,
  description,
  cancelButtonText = "",
  confirmButtonText = "",
  onConfirmClick,
}: {
  show: boolean;
  onClose: MouseEventHandler;
  title: string;
  description: React.ReactElement;
  cancelButtonText?: string;
  confirmButtonText?: string;
  onConfirmClick: MouseEventHandler;
}) => {
  if (!show) {
    return null;
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.titleText}>{title}</div>
        <div className={styles.modalContent}>
          {description}
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.closeButton} onClick={onClose}>
            {cancelButtonText ? cancelButtonText : "Cancel"}
          </button>
          <button className={styles.confirmButton} onClick={onConfirmClick}>
          {confirmButtonText ? confirmButtonText : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
