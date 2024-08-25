"use client";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import withAuth from "@/app/components/Auth/withAuth";
import LightLoader from "@/app/components/LightLoader";
import LoadingSkeleton from "./components/LoadingSkeleton";
import Staffs from "./components/Staffs";
import StaffModalFullPage from "./components/StaffModalFullpage";
import { Kitchen, IConfig, User } from "@/app/src/types";
import { FormStep } from "./components/form-step";
import { ToastStatus  } from "./components/base/toast-status";
import Drawer from 'react-modern-drawer'

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
import { FormContext } from "@/app/context/StaffContext";
import { EditUserInfo } from "./components/edit-step/edit-user-info";
import { EditUserRole } from "./components/edit-step/edit-user-role";
import { EditUserSignCode } from "./components/edit-step/edit-sign-code";
import { 
  useRouter, 
  usePathname,
  useSearchParams
} from "next/navigation";


const StaffMembers = () => {
  const router = useRouter()
  const pathName = usePathname()
  const searchParams = useSearchParams()
  const { banner, setBanner } = useBanner();
  const { 
    statusModal, 
    // setStatusModal, 
    statusAddStaff,
    setStatusAddStaff , 
    
  } = useFormStep()

  const {state} = useContext(FormContext)!;

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
  const handleAddStaff =async()=>{
    router.push(`${pathName}?type=add-staff`)
    // setStatusModal(true)
  }

  const handleCloseStaffBanner = () => {
    setStatusAddStaff(false)
  }

  const openModal = useMemo(() => {
    return searchParams?.get('type') === 'add-staff'
  }, [searchParams])

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

  // to be removed

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
                  <button 
                    className={styles.buttonPrimary} 
                    onClick={handleAddStaff}
                  >
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
                <div className="bg-white flex flex-col rounded-lg border border-gray-200 px-4 py-5 mt-5 lg:mt-8">
                  <div className="flex items-center justify-center pb-4">
                    <div className="flex flex-col items-center ">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <UserSvg />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-gray-800 font-semibold text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px] mb-2">
                      No Staff Created
                    </p>
                    <p className="text-gray-800 font-normal text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] mb-4">
                      You haven’t created any staff yet.
                    </p>
                    <button className={styles.buttonPrimary} onClick={handleAddStaff}>
                      <span style={{ marginRight: "8px" }}>{plusIcon}</span>
                      Staff Member{" "}
                    </button>
                  </div>
                </div>
              </>
            )
        }
              <Drawer
                // open={ searchParams?.get('type') === 'add-staff' }
                open={openModal}
                // onClose={CloseTogglePanel}
                direction='bottom'
                className=' overflow-auto w-full !h-full !bg-[#FCFCFD] lg:!bg-white '
                lockBackgroundScroll={true}
                overlayOpacity={0}
              >
                  <StaffModalFullPage 
                   content={
                      <FormStep/>
                  }
                  />
              </Drawer>
        {/* <StaffModalFullPage
          // show={statusModal}
          show={
            searchParams.get('type') === 'add-staff' 
          }
            content={
            <div className={styles.formContainer}>
              <FormStep/>
            </div>
          }
        /> */}

{/* eidt UserInfo modal */}
       {/* <StaffModalFullPage
          show={searchParams.get('type') === 'edit-staff'}
          content={
            <div className={styles.formContainer}>
              <EditUserInfo/>
            </div>
          }
        /> */}
{/* eidt Role modal */}
        {/* <StaffModalFullPage
       show={searchParams.get('type') === 'edit-role'}
          content={
            <div className={styles.formContainer}>
              <EditUserRole/>
            </div>
          }
        /> */}
      {/* eidt SignCode modal */}
     {/* <StaffModalFullPage
       show={searchParams.get('type') === 'edit-code'}
        content={
          <div className={styles.formContainer}>
            <EditUserSignCode/>
          </div>
        }
      /> */}
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