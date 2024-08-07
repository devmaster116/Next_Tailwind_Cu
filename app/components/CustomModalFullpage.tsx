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
}) => {
  const [deleteModal,setDeleteModal]=useState(false)
  if (!show) {
    return null;
  }

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
                <button onClick={onUpdateClick} className={styles.updateBtn}>Save</button>
            </div>
            <div className={styles.modalContent}>{content}</div>
            <div className={styles.modalFooter}>
              <button onClick={onUpdateClick} className={styles.updateBtn}>Save</button>
            </div>
            
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
            <div className={styles.modalFooter}>
            <button  className={styles.updateBtn}  onClick={onClose}>
                Done </button>
            </div>
            
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
              <div style={{display:"flex"}}>
              <button className={styles.deleteButton} style={{marginRight:"10px"}}  onClick={()=>{setDeleteModal(true)}}>
                Delete </button>
              <button className={styles.updateBtn} onClick={onUpdateClick} >
                Update </button>

              </div>
              
            </div>
            <div className={styles.modalContent}>{content}</div>
            <div className={styles.modalFooterEdit}>
              <button className={styles.deleteButton} style={{marginRight:"10px"}}  onClick={()=>{setDeleteModal(true)}}>
                  Delete </button>
                <button className={styles.updateBtn} onClick={onUpdateClick} >
                  Update </button>
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
              <h3 className={styles.deleteModalTitle}>Deleting ‘{title}’ role</h3>
              <p className={styles.deleteMessage}>
                Are you sure you want to delete the role?
              </p>
              <br/>
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