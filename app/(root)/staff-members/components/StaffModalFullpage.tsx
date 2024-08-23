import React, { MouseEventHandler, useContext, useState } from "react";
import styles from "./StaffModalFullPage.module.scss";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { useFormStep } from "@/app/hooks/useFormStep";
const StaffModalFullpage = ({
  show,
  onClose,
  // title,
  content,
  // isExiting,
  // handleGoForwardStep,
  // pageId
}: {
  show: boolean;
  // title: string;
  content: React.ReactElement;
  confirmButtonText?: string;
  // handleGoForwardStep: MouseEventHandler;
  updateButtonText?: string;
  onClose?: MouseEventHandler;
  // pageId:number
  // isExiting: boolean;
}) => {

  const {currentStep, handleNextStep} =useFormStep()
  const {statusModal} =useFormStep()

  if (!show) {
    return null;
  }
  return (
    <>
        {/* <div className={`${styles.modalOverlay} `}> */}
        <div className={twMerge(
          styles.modalOverlay,
          "!bg-white !items-start p-4 overflow-auto",
        )}>
          <div
            // className={`${styles.modal} ${!statusModal ? styles.exit : ""}`} 
            className='w-full' 
            
            // className={`${styles.modal} ${!statusModal ? styles.exit : ""}`}
            // onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalContent}>
              {content}
            </div>
            {/* <div className={styles.modalFooter}>
              <button  className={styles.updateBtn} onClick={handleNextStep}>
              {currentStep>3?'Save' : 'Next'}
              </button>
            </div> */}
          </div>
        </div>
    </>
  );
};

export default StaffModalFullpage;
