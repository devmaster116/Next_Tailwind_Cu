import React, { MouseEventHandler } from "react";
import styles from "./customModal.module.scss";

const CustomModalFooter = ({
  onClose,
  onUpdateClick,
  cancelButtonText,
  confirmButtonText,
  updateButtonText,
  type,
}: {
  onClose: MouseEventHandler;
  onUpdateClick: MouseEventHandler;
  cancelButtonText?: string;
  confirmButtonText?: string;
  updateButtonText?: string;
  type: "delete" | "edit" | "add";
}) => {
  return (
    <>
      {type === "delete" && (
        <>
          <div className={styles.deleteModalFooter}>
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
