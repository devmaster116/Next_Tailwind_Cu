"use client";
import React, { useEffect, useRef, useState } from "react";
import withAuth from "@/app/components/Auth/withAuth";
import LightLoader from "@/app/components/LightLoader";
import LoadingSkeleton from "./components/LoadingSkeleton";
import Staffs from "./components/Staffs";
import StaffModalFullPage from "./components/StaffModalFullpage";
import { Kitchen, IConfig, User } from "@/app/src/types";
import { FormStep } from "./components/form-step";
import { ToastStatus  } from "./components/base/toast-status";
import {
  collection,
  onSnapshot,

} from "firebase/firestore";
import { db } from "@/firebase/config";

import styles from "./StaffMember.module.scss";
import { useBanner } from "@/app/context/BannerContext";
import { useFormStep } from "@/app/hooks/useFormStep";

const StaffMembers = () => {
  const { banner, setBanner } = useBanner();
  const [loading, setLoading] = useState(false);
  const { statusModal, setStatusModal, statusAddStaff,setStatusAddStaff } = useFormStep()
  const [staffConfig,setStaffConfig] = useState<IConfig[]>([])

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


  const handleClose = () => {
    setBanner(false)
  }

  const handleCloseStaffBanner = () => {
    setStatusAddStaff(false)
  }
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

  

  return (
    <>
      {banner && (
        <ToastStatus label={"Alfonso Was Deleted As Staff Member"} onClose={handleClose}/>
      )}
      {statusAddStaff && (
        <ToastStatus label={"New Staff Member Created"} onClose={handleCloseStaffBanner}/>
      )}
      <div className={"w-full"}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Staff Members</h1>
          <button
            className={styles.buttonPrimary}
            onClick={()=> setStatusModal(true)}
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
          <StaffModalFullPage
            show={statusModal}
            content={
              <div className={styles.formContainer}>
                   <FormStep/>
            </div>
            }
          />

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