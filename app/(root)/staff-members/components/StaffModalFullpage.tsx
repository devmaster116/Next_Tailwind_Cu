import React, { useContext, useEffect, useState } from "react";
import styles from "./StaffModalFullPage.module.scss";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { useFormStep } from "@/app/hooks/useFormStep";
import useWindowSize from "@/app/hooks/useWindowSize";
import Form from "./form";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BackSvg } from "@/app/assets/svg/back";
import { FormContext } from "@/app/context/StaffContext";
import { UserInfo } from "../components/form-step/user-info";
import { UserPhoto } from "../components/form-step/user-photo";
import { UserRole } from "../components/form-step/user-role";
import { UserSignCode } from "../components/form-step/user-signcode";

import { EditUserInfo } from "./edit-step/edit-user-info";
import { EditUserRole } from "./edit-step/edit-user-role";
import { EditUserSignCode } from "./edit-step/edit-sign-code";
const StaffModalFullpage = ({
  type,
  editPage
}: {
  type:"edit" | "add";
  editPage:''|'user-info'|'user-role'|'user-sign'
}) => {
  const { width } = useWindowSize()
  const router = useRouter()
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const nextSearchParams = new URLSearchParams(searchParams.toString());
  const { resetForm} = useContext(FormContext)!
  const {
    currentStep, 
    setCurrentStep,
    pageKey,
    setPageKey,
    setNextClicked,
    setUpdateUserInfoClicked,
    setUpdateUserRoleClicked,
    setUpdateUserCodeClicked,
    
  } =useFormStep()

  const handleGoForwardStep = () => {
     setNextClicked(true)
  }
  const steps = [
    {
      step: 1,
      component: <UserInfo key={pageKey}/>
    },
    {
      step: 2,
      component: <UserPhoto />
    },
    {
      step: 3,
      component: <UserRole />
    },
    {
      step: 4,
      component: <UserSignCode />
    }
  ]
  const handleCloseModal = () => {
    setPageKey(pageKey + 1);
    resetForm()
    router.back()
  }
  const handleUpdateStaff = () => {
    if(searchParams?.get('type') === 'edit-staff'){
      setUpdateUserInfoClicked(true)
    }
    if(searchParams?.get('type') === 'edit-role'){
      setUpdateUserRoleClicked(true)
    }
    if(searchParams?.get('type') === 'edit-code'){
      setUpdateUserCodeClicked(true)

    }
    
  }

  const handleGoBack = () => {
    setCurrentStep(currentStep - 1)
  }

  return (
    <>
       {type == "add" && (
        <div className='flex flex-col  w-full  h-[90%]  lg:h-full ' > 
              <div className="flex flex-col gap-8">
                <div className={twMerge(styles.titleDiv, width < 1024 ? "flex-col !pb-1" : "", "!m-0 !relative")}>
                  <div className="flex justify-between items-center w-full">
                    <button
                      className={styles.titleAddCloseBtn}
                      onClick={currentStep > 1 ? handleGoBack : handleCloseModal}
                    >
                      {currentStep > 1 ? (
                        <BackSvg />
                      ) : (
                        <Image
                          className={styles.icon}
                          src="/icons/close.svg"
                          height={12}
                          width={12}
                          alt="Close Button"
                          style={{
                            filter: "invert(35%) sepia(5%) saturate(368%) hue-rotate(175deg) brightness(98%) contrast(90%)",
                          }}
                        />
                      )}
                    </button>
                    <div className={styles.titleText}>Add Staff Member</div>
                    <button className={styles.saveBtn} onClick={handleGoForwardStep}>
                      {currentStep === 4 ? "Save" : "Next"}
                    </button>
                  </div>
                    {
                      width <1024 &&      
                        <div className="w-full mt-2"> 
                        <Form.StepStatus stepIndex={currentStep}></Form.StepStatus>
                      </div>
                    }
                </div>
              </div>
              <div className={twMerge(
                  styles.modalContent,
                  '!px-4 overflow-auto w-full',
                  "lg:!w-[680px] mx-auto !pt-6 lg:!pt-8"
                   
                )}
              > 
                  {width >= 1024 && <Form.StepStatus stepIndex={currentStep}></Form.StepStatus>}
                  {steps[currentStep - 1].component ?? steps[0].component}
              </div>
              <div className={twMerge(styles.modalFooter,'')}>
                  <button 
                    className={styles.updateBtn} 
                    onClick={handleGoForwardStep}
                  >
                    {currentStep==4?"Save":"Next"}
                  </button>
              </div>
        </div>
      )} 
       {type == "edit" && (
        <div className='flex flex-col w-full h-[90%]  lg:h-full ' > 
              <div className="flex flex-col gap-8">
                <div className={twMerge(
                  styles.titleDiv, width < 1024 ? "flex-col" : "",
                  "!m-0 !relative"
                )}>
                  <div className="flex justify-between items-center w-full">
                    <button
                      className={styles.titleAddCloseBtn}
                      onClick={handleCloseModal}
                    >
                        <Image
                          className={styles.icon}
                          src="/icons/close.svg"
                          height={12}
                          width={12}
                          alt="Close Button"
                          style={{
                            filter: "invert(35%) sepia(5%) saturate(368%) hue-rotate(175deg) brightness(98%) contrast(90%)",
                          }}
                        />
                   
                    </button>
                    <div className={styles.titleText}>
                          {editPage=='user-info'&&(
                           'Update Details'
                          )} 
                          {editPage=='user-role'&&(
                             'Update Permissions'
                          )} 
                          {editPage=='user-sign'&&(
                              'Reset Code'
                          )} 

                    </div>
                    <button className={styles.saveBtn} onClick={handleUpdateStaff}>
                      Save
                    </button>
                  </div>
                  
                </div>
              </div>
              <div className={twMerge(
                  styles.modalContent,
                  '!px-4 overflow-auto w-full',
                  "!pt-6 lg:!pt-8",
                  "lg:!w-[680px] mx-auto"
                )}
              > 
                     {editPage=='user-info'&&(
                        <>
                       <EditUserInfo key={pageKey}/>
                        </>
                      )} 
                      {editPage=='user-role'&&(
                         <>
                         <EditUserRole/>
                         </>
                      )} 
                      {editPage=='user-sign'&&(
                        <>
                          <EditUserSignCode key={pageKey}/>
                        </>
                      )} 
              </div>
              <div className={twMerge(styles.modalFooter,'')}>
                  <button 
                    className={styles.updateBtn} 
                    onClick={handleUpdateStaff}
                  >
                    Save
                  </button>
              </div>
        </div>
      )} 
    </>
   
  
  );
};

export default StaffModalFullpage;
