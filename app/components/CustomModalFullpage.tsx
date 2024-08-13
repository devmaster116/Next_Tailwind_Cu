import React, { MouseEventHandler, useState } from "react";
import styles from "./customModalFullPage.module.scss";
import Image from "next/image";
import CustomModalFooter from "./customModalFooter";
import CustomModal from "./CustomModal";

const CustomModalFullPage = ({
  show,
  onClose,
  title,
  content,
  type,
  updateButtonText,
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
  onUpdateClick: MouseEventHandler;
  type?: string;
  updateButtonText?: string;
  onDeleteClick: MouseEventHandler;
  isExiting: boolean;
}) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [isExitings, setIsExitings] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const handleClose = (e: React.MouseEvent) => {
    setIsExitings(true);
    setTimeout(() => {
      setIsExitings(false);
      onClose(e); // Calls the parent onClose to actually hide the modal
    }, 500); // Duration of the exit animation
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
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.titleDiv}>
              <button className={styles.titleAddCloseBtn} onClick={onClose}>
                <Image
                  className={styles.icon}
                  src="/icons/close.svg"
                  height={12}
                  width={12}
                  alt="Close Button"
                  style={{
                    filter:
                      "invert(35%) sepia(5%) saturate(368%) hue-rotate(175deg) brightness(98%) contrast(90%)",
                  }}
                />
              </button>
              <div className={styles.titleText}>{title}</div>
              <button onClick={onUpdateClick} className={styles.saveBtn}>
                Save
              </button>
            </div>
            <div className={styles.modalContent}>{content}</div>
            <div className={styles.modalFooter}>
              <button onClick={onUpdateClick} className={styles.updateBtn}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {type === "next" && (
        <div className={`${styles.modalOverlay} `}>
          <div
            className={`${styles.modal} ${isExiting ? styles.exit : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.titleDiv}>
              <button className={styles.titleAddCloseBtn} onClick={onClose}>
                <Image
                  className={styles.icon}
                  src="/icons/close.svg"
                  height={12}
                  width={12}
                  alt="Close Button"
                  style={{
                    filter:
                      "invert(35%) sepia(5%) saturate(368%) hue-rotate(175deg) brightness(98%) contrast(90%)",
                  }}
                />
              </button>
              <div className={styles.titleText}>{title}</div>
              <button onClick={onUpdateClick} className={styles.saveBtn}>
                Next
              </button>
            </div>
            <div className={styles.modalContent}>{content}</div>
            <div className={styles.modalFooter}>
              <button onClick={onUpdateClick} className={styles.updateBtn}>
                Next
              </button>
            </div>
          </div>
        </div>
      )}
      {type === "view" && (
        <div className={`${styles.modalOverlay} `}>
          <div
            className={`${styles.modal} ${isExitings ? styles.exit : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.titleDiv}>
              <button className={styles.titleAddCloseBtn} onClick={handleClose}>
                <Image
                  className={styles.icon}
                  src="/icons/close.svg"
                  height={10}
                  width={10}
                  alt="Close Button"
                  style={{
                    filter:
                      "invert(35%) sepia(5%) saturate(368%) hue-rotate(175deg) brightness(98%) contrast(90%)",
                  }}
                />
              </button>
              <div className={styles.titleText}>{title}</div>
              <button className={styles.updateBtn} onClick={handleClose}>
                Done{" "}
              </button>
            </div>
            <div className={styles.modalContent}>{content}</div>
            <div className={styles.modalFooter}>
              <button className={styles.updateBtn} onClick={handleClose}>
                Done{" "}
              </button>
            </div>
          </div>
        </div>
      )}
      {type === "edit" && (
        <div className={`${styles.modalOverlay} `}>
          <div
            className={`${styles.modal} ${isExiting ? styles.exit : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.titleDiv}>
              <button className={styles.titleAddCloseBtn} onClick={onClose}>
                <Image
                  className={styles.icon}
                  src="/icons/close.svg"
                  height={10}
                  width={10}
                  alt="Close Button"
                  style={{
                    filter:
                      "invert(35%) sepia(5%) saturate(368%) hue-rotate(175deg) brightness(98%) contrast(90%)",
                  }}
                />
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
                  Delete Role{" "}
                </button>
                {/* <button className={styles.updateBtn} onClick={onUpdateClick} > */}
                <button className={styles.updateBtn} onClick={onUpdateClick}>
                  Update{" "}
                </button>
              </div>
            </div>
            <div className={styles.modalContent}>{content}</div>
            <div className={`${styles.modalFooterEdit} ${styles.modalFooter}`}>
              <button className={styles.updateBtn} onClick={onUpdateClick}>
                Update Role Permissions{" "}
              </button>
            </div>
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
              <p className={styles.deleteModalTitle}>
                Deleting ‘{title}’ role
              </p>
              <p className={styles.deleteMessage}>
                Are you sure you want to delete the role?
              </p>
              <br />
              <p className={styles.description}>
                Confirming this means you can’t get this role but you can always
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
