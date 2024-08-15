"use client";
import React, { useEffect, useRef, useState } from "react";
import withAuth from "@/app/components/Auth/withAuth";
import LightLoader from "@/app/components/LightLoader";
import LoadingSkeleton from "./components/LoadingSkeleton";
import Staffs from "./components/Staffs";
import StaffModalFullPage from "./components/StaffModalFullpage";
import { Kitchen, IConfig, User } from "@/app/src/types";
import { FormProvider } from "@/app/context/StaffForm";
import { FormStep } from "./components/form-step";
import { FormStepProvider } from "@/app/context/StaffFormStep";
import { ToastStatus  } from "./components/base/toast-status";
import {
  addDoc,
  collection,
  doc,
  FieldValue,
  getDoc,
  getDocs,
  query,
  updateDoc,
  arrayRemove,
  where,
  onSnapshot,
  DocumentData,
  QuerySnapshot,
} from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import {
  handleBlurField,
  handleInputChangeField,
  validateEmail,
  formatDate,
  validateMobileNumber,
} from "@/app/components/Auth/utils/helper";
import { User as FirebaseUser } from "firebase/auth";
import { useKitchen } from "../../context/KitchenContext";
import styles from "./StaffMember.module.scss";
import { FirebaseError } from "firebase/app";
import { useFormStep } from "@/app/hooks/useFormStep";
import { useForm } from "@/app/hooks/useForm";

const StaffMembers = () => {

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isExiting, setIsExiting] = useState(false);

  const [toastMessage, setToastMessage] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

  const [addNewStaffModalOpen, setAddNewStaffModalOpen] = useState(false);

  const [staffConfig,setStaffConfig] = useState<IConfig[]>([])

  const errorRef = useRef<HTMLParagraphElement | null>(null);

  const handleCloseModal = (modalStateSetter:  React.Dispatch<React.SetStateAction<boolean>>) => {
    setIsExiting(true);
    setTimeout(() => {
      modalStateSetter(false);
      setIsExiting(false);
      setErrors({});
    }, 500);
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "configs"), (snapShot) => {
      const _configs: IConfig[] = []

      snapShot.docs.forEach(data => {
        _configs.push(data.data().staffMemberConfigs as IConfig)
      })
      setStaffConfig(_configs)
    });
    () => unsubscribe()
  }, []);

useEffect(() => {
    const storedToastFlag = localStorage.getItem("toastflag");
    if (storedToastFlag !== null) {
      setToastMessage(JSON.parse(storedToastFlag));
    }
    const storedModalFlag = localStorage.getItem("staffDelflag");
    if (storedModalFlag !== null) {
      setOpenDeleteModal(JSON.parse(storedModalFlag));
    }
  }, []); 

  // Step 3: Save values back to localStorage when they change
  useEffect(() => {
    localStorage.setItem("toastflag", JSON.stringify(toastMessage));
    localStorage.setItem("staffDelflag", JSON.stringify(openDeleteModal));
  }, [toastMessage, openDeleteModal]); // Run this effect whenever these states change


  const plusIcon = (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.99984 1.16667V12.8333M1.1665 7H12.8332"
        stroke="white"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  const ModalContainer = () => (
    <>
      <div className={styles.formContainer}>
        <FormStepProvider>
          <FormProvider>
            <FormStep/>
          </FormProvider>
        </FormStepProvider>
      </div>
    </>
  )

  return (
    <>
      {toastMessage&& openDeleteModal&&(
        <ToastStatus label={"aa"} cls="bb" />
      )}
      <div className={styles.main_container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Staff Members</h1>
          <button
            className={styles.buttonPrimary}
            onClick={() =>{ setAddNewStaffModalOpen(true);}}
          >
              <span style={{ marginRight: "8px" }}>{plusIcon}</span>
              Staff Member{" "}
          </button>
        </div>
        {
          staffConfig && staffConfig.length > 0 && (
            <Staffs
              staffList={staffConfig}
            />
          )
        }
        {addNewStaffModalOpen && (
          <StaffModalFullPage
            show={addNewStaffModalOpen}
            content={
              <div className={styles.formContainer}>
                <FormStepProvider>
                  <FormProvider>
                    <ModalContainer/>
                  </FormProvider>
                </FormStepProvider>
            </div>
            }
          />
        )}

        {loading && (
          <>
            <LightLoader />
          </>
        )}
      </div>
    </>
  );
};

export default withAuth(StaffMembers);