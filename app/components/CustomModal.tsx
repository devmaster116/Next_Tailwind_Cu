import React from "react";
import styles from "./CustomModal.module.scss";
import Image from "next/image";
import CustomModalFooter from "./CustomModalFooter";
import { Avatar } from "./base/avatar";
import { CancelSvg } from "../assets/svg/cancel";

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
  onClose: () => void;
  title: string;
  content: React.ReactElement;
  cancelButtonText?: string;
  confirmButtonText?: string;
  onUpdateClick: () => void;
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
              <Avatar
                icon={<CancelSvg width={14} height={14} color="#3F3F3F" />}
                classOverride={{
                  icon: "w-10 h-10 border rounded-md",
                }}
                onClick={onClose}
              />
            </div>
            <div className={`${styles.modalContent}`}>{content}</div>
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
                <CancelSvg width={10} height={10} color="#3F3F3F" />
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
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.titleDiv}>
              <div className={styles.titleText}>{title}</div>
              <button className={styles.titleAddCloseBtn} onClick={onClose}>
                <CancelSvg width={10} height={10} color="#3F3F3F" />
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
