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
import { UserSvg } from "@/app/assets/svg/user";
import { twMerge } from "tailwind-merge";

const StaffMembers = () => {
  const { banner, setBanner } = useBanner();
  // const [loading, setLoading] = useState(true);
  const { statusModal, setStatusModal, statusAddStaff,setStatusAddStaff } = useFormStep()
  const [staffConfig,setStaffConfig] = useState<IConfig[]>([])

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "configs"), (snapShot) => {
      const _configs: IConfig[] = []

      snapShot.docs.forEach(data => {
        _configs.push(data.data().staffMemberConfigs as IConfig)
      })
      // setLoading(false)
      setStaffConfig(_configs)
      
    });
    // () => unsubscribe()
    return () => unsubscribe();
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

  if (!Array.isArray(staffConfig) || staffConfig.length === 0)
    return <> <LightLoader /></>

  return (
    <>
      {/* {loading && (
        <>
          <LightLoader />
          <LoadingSkeleton />
        </>
      )} */}
      {banner && (
        <ToastStatus label={"Alfonso Was Deleted As Staff Member"} onClose={handleClose}/>
      )}
      {statusAddStaff && (
        <ToastStatus label={"New Staff Member Created"} onClose={handleCloseStaffBanner}/>
      )}
      <div className={"w-full"}>
        
        {
           staffConfig?.[0]?.staffMembers?.length > 0?(
              <>
                <div className={styles.pageHeader}>
                  <h1 className={styles.pageTitle}>Staff Members</h1>
                  <button className={styles.buttonPrimary} onClick={() => setStatusModal(true)}>
                    <span style={{ marginRight: "8px" }}>{plusIcon}</span>
                    Staff Member{" "}
                  </button>
                </div>
                <Staffs staffList={staffConfig} />
              </>
            ) : (
              <>
                <div className={styles.freshpageHeader}>
                  <h1 className={styles.pageTitle}>Staff Members</h1>
                </div>
                <div className="bg-gray-25 flex flex-col rounded-lg border border-gray-200 px-4 pb-5">
                  <div className="flex items-center justify-center py-4">
                    <div className="flex flex-col items-center ">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <UserSvg />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-gray-800 font-semibold text-[16px] leading-[24px] sm:text-[18px] sm:leading-[28px] mb-2">
                      No Staff Created
                    </p>
                    <p className="text-gray-800 font-normal text-[14px] leading-[20px] sm:text-[16px] sm:leading-[24px] mb-4">
                      You haven’t created any staff yet.
                    </p>
                    <button className={styles.buttonPrimary} onClick={() => setStatusModal(true)}>
                      <span style={{ marginRight: "8px" }}>{plusIcon}</span>
                      Staff Member{" "}
                    </button>
                  </div>
                </div>
              </>
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

        {/* {loading && (
          <>
            <LightLoader />
          </>
        )} */}
      </div>
    </>
  );
};

export default withAuth(StaffMembers);