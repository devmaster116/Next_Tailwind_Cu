import React, { MouseEventHandler } from "react";
import styles from "./customModal.module.scss";
import Image from "next/image";
import CustomModalFooter from "./customModalFooter";

const CustomModal = ({
  show,
  onClose,
  title,
  content,
  type,
  updateButtonText,
  onUpdateClick,
  cancelButtonText,
  confirmButtonText,
}: {
  show: boolean;
  onClose: MouseEventHandler;
  title: string;
  content: React.ReactElement;
  cancelButtonText?: string;
  confirmButtonText?: string;
  onUpdateClick: MouseEventHandler;
  type?: string;
  updateButtonText?: string;
}) => {
  if (!show) {
    return null;
  }

  return (
    <>
      {type === "delete" && (
        <div className={styles.modalOverlay}>
          <div
            className={styles.deleteModal}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.titleDivDeleteModal}>
              <div className={styles.deleteModalTitle}>
                <Image
                  className={styles.errorIcon}
                  src="/icons/alert-circle.svg"
                  height={48}
                  width={48}
                  alt="Close Button"
                />
              </div>
              <button className={styles.titleCloseBtn} onClick={onClose}>
                <Image
                  className={styles.icon}
                  src="/icons/close.svg"
                  height={10}
                  width={10}
                  alt="Close Button"
                />
              </button>
            </div>
            <div className={styles.modalContent}>{content}</div>
            <CustomModalFooter
              updateButtonText={updateButtonText}
              confirmButtonText={confirmButtonText}
              cancelButtonText={cancelButtonText}
              type="delete"
              onUpdateClick={onUpdateClick}
              onClose={onClose}
            />
          </div>
        </div>
      )}

      {type === "edit" && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.titleDiv}>
              <div className={styles.titleText}>{title}</div>
              <button className={styles.titleCloseBtn} onClick={onClose}>
                <Image
                  className={styles.icon}
                  src="/icons/close.svg"
                  height={10}
                  width={10}
                  alt="Close Button"
                />
              </button>
            </div>
            <div className={styles.modalContent}>{content}</div>
            <CustomModalFooter
              updateButtonText={updateButtonText}
              type="edit"
              onUpdateClick={onUpdateClick}
              onClose={onClose}
            />
          </div>
        </div>
      )}

      {type === "add" && (
        <div className={styles.modalOverlay}>
          <div className={styles.addModal} onClick={e => e.stopPropagation()}>
            <div className={styles.titleDiv}>
              <div className={styles.titleText}>{title}</div>
              <button className={styles.titleAddCloseBtn} onClick={onClose}>
                <Image
                  className={styles.icon}
                  src="/icons/close.svg"
                  height={10}
                  width={10}
                  alt="Close Button"
                />
              </button>
            </div>
            <div className={styles.modalContent}>{content}</div>
            <CustomModalFooter
              updateButtonText={updateButtonText}
              type="add"
              onUpdateClick={onUpdateClick}
              onClose={onClose}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CustomModal;
