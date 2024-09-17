import React, { MouseEventHandler, useState } from "react";
import styles from "./CustomModalFullPage.module.scss";
import Image from "next/image";
import CustomModal from "./CustomModal";
import { CancelSvg } from "../assets/svg/cancel";
import ModalFooter from "./ModalFooter";

const CustomModalFullPage = ({
  show,
  onClose,
  title,
  content,
  type,
  onUpdateClick,
  onDeleteClick,
  isExiting,
}: {
  show: boolean;
  onClose: MouseEventHandler;
  title: string;
  content: React.ReactElement;
  cancelButtonText?: string;
  confirmButtonText?: string;

  onUpdateClick: () => void;
  type?: string;
  updateButtonText?: string;
  onDeleteClick: () => void;
  isExiting: boolean;
}) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [isModalExiting, setIsModalExiting] = useState(false);

  const handleClose = (e: React.MouseEvent) => {
    setIsModalExiting(true);
    setTimeout(() => {
      setIsModalExiting(false);
      onClose(e);
    }, 500);
  };

  if (!show) {
    return null;
  }

  return (
    <>
      {type === "add" && (
        <div className={`${styles.modalOverlay} `}>
          <div
            className={`${styles.modal} ${isExiting ? styles.exit : ""}`}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.titleDiv}>
              <button className={styles.titleAddCloseBtn} onClick={onClose}>
                <CancelSvg width={12} height={12} color="#667085" />
              </button>
              <div className={styles.titleText}>{title}</div>
              <button onClick={onUpdateClick} className={styles.saveBtn}>
                Save
              </button>
            </div>
            <div className={styles.modalContent}>{content}</div>
            <ModalFooter onActionClick={onUpdateClick} actionLabel="Save" />
          </div>
        </div>
      )}
      {type === "view" && (
        <div className={`${styles.modalOverlay} `}>
          <div
            className={`${styles.modal} ${isModalExiting ? styles.exit : ""}`}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.titleDiv}>
              <button className={styles.titleAddCloseBtn} onClick={handleClose}>
                <CancelSvg width={12} height={12} color="#667085" />
              </button>
              <div className={styles.titleText}>{title}</div>
              <button className={styles.updateBtn} onClick={handleClose}>
                Done
              </button>
            </div>
            <div className={styles.modalContent}>{content}</div>
            <ModalFooter onActionClick={handleClose} actionLabel="Done" />
          </div>
        </div>
      )}
      {type === "edit" && (
        <div className={`${styles.modalOverlay} `}>
          <div
            className={`${styles.modal} ${isExiting ? styles.exit : ""}`}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.titleDiv}>
              <button className={styles.titleAddCloseBtn} onClick={onClose}>
                <CancelSvg width={12} height={12} color="#667085" />
              </button>
              <div className={styles.titleText}>{title}</div>
              <div style={{ display: "flex" }}>
                <button
                  className={styles.deleteButton}
                  style={{ marginRight: "20px" }}
                  onClick={() => {
                    setDeleteModal(true);
                  }}
                >
                  Delete Role
                </button>
                <button className={styles.updateBtn} onClick={onUpdateClick}>
                  Update
                </button>
              </div>
            </div>
            <div className={styles.modalContent}>{content}</div>
            <ModalFooter
              onActionClick={onUpdateClick}
              actionLabel="Update Role Permissions"
            />
          </div>
        </div>
      )}

      {deleteModal && (
        <CustomModal
          show={deleteModal}
          onClose={() => setDeleteModal(false)}
          type="delete"
          title=""
          onUpdateClick={onDeleteClick}
          confirmButtonText="Delete Role"
          cancelButtonText="Keep Role"
          content={
            <>
              <p className={styles.deleteModalTitle}>Deleting ‘{title}’ role</p>
              <p className={styles.deleteMessage}>
                Are you sure you want to delete this role?
              </p>
              <p className={styles.description}>
                Confirming this means you can't get this role but you can always
                recreate it if you wish.
              </p>
            </>
          }
        />
      )}
    </>
  );
};

export default CustomModalFullPage;
