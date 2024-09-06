import React from "react";
import styles from "./customModal.module.scss";
import { twMerge } from "tailwind-merge";

const CustomModalFooter = ({
  onClose,
  onUpdateClick,
  cancelButtonText,
  confirmButtonText,
  updateButtonText,
  type,
}: {
  onClose: () => void;
  onUpdateClick: () => void;
  cancelButtonText?: string;
  confirmButtonText?: string;
  updateButtonText?: string;
  type: "delete" | "edit" | "add";
}) => {
  return (
    <>
      {type === "delete" && (
        <>
          <div className={twMerge(styles.deleteModalFooter, "flex-col")}>
            <button className={styles.closeButton} onClick={onClose}>
              {cancelButtonText ? cancelButtonText : "Keep User"}
            </button>
            <button className={styles.confirmButton} onClick={onUpdateClick}>
              {confirmButtonText ? confirmButtonText : "Delete User"}
            </button>
          </div>
        </>
      )}
      {type === "edit" && (
        <>
          <div className={styles.modalFooter}>
            <button className={styles.updateBtn} onClick={onUpdateClick}>
              {updateButtonText ? updateButtonText : "Update"}
            </button>
            <button className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
          </div>
        </>
      )}
      {type === "add" && (
        <div className={styles.modalFooter}>
          <button className={styles.updateBtn} onClick={onUpdateClick}>
            {updateButtonText ? updateButtonText : "Update"}
          </button>
        </div>
      )}
    </>
  );
};

export default CustomModalFooter;
