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
  const [deleteModal,setDeleteModal]=useState(false)
  if (!show) {
    return null;
  }
  console.log("teh clcikc",onUpdateClick)

  return (
    <>
  
      {type === "add" && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.titleDiv}>
            <button className={styles.titleAddCloseBtn} onClick={onClose}>
                <Image
                  className={styles.icon}
                  src="/icons/close.svg"
                  height={10}
                  width={10}
                  alt="Close Button"
                />
              </button>
              <div className={styles.titleText}>{title}</div>
              <button onClick={onUpdateClick} className={styles.updateBtn} >
                New Role </button>
            </div>
            <div className={styles.modalContent}>{content}</div>
            
          </div>
        </div>
      )}
      {type === "view" && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.titleDiv}>
            <button className={styles.titleAddCloseBtn} onClick={onClose}>
                <Image
                  className={styles.icon}
                  src="/icons/close.svg"
                  height={10}
                  width={10}
                  alt="Close Button"
                />
              </button>
              <div className={styles.titleText}>{title}</div>
              <button  className={styles.updateBtn}  onClick={onClose}>
                Done </button>
            </div>
            <div className={styles.modalContent}>{content}</div>
            
          </div>
        </div>
      )}
      {type === "edit" && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.titleDiv}>
            <button className={styles.titleAddCloseBtn} onClick={onClose}>
                <Image
                  className={styles.icon}
                  src="/icons/close.svg"
                  height={10}
                  width={10}
                  alt="Close Button"
                />
              </button>
              <div className={styles.titleText}>{title}</div>
              <div className="flex">
              <button className={styles.confirmButton} style={{marginRight:"10px"}}  onClick={()=>{setDeleteModal(true)}}>
                Delete </button>
              <button className={styles.updateBtn} onClick={onUpdateClick} >
                Update </button>

              </div>
              
            </div>
            <div className={styles.modalContent}>{content}</div>
            
          </div>
        </div>
      )}

      {deleteModal && (
          <CustomModal
          show={deleteModal}
          onClose={() => setDeleteModal(false)}
          type="delete"
          title=""
          onUpdateClick={()=>{}}
          content={
            <>
              <h3 className={styles.deleteModalTitle}>Delete Admin User</h3>
              <p className={styles.deleteMessage}>
                Are you sure you want to delete the role?
              </p>
              <p className={styles.description}>
                Confirming this means they wont have access to the portal
                anymore.
              </p>
            </>
          }
          />
      )}
    </>
  );
};

export default CustomModalFullPage;