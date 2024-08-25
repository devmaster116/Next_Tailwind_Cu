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
const StaffModalFullpage = ({
  content,
}:
{
    content: React.ReactElement;

}) => {
  const { width } = useWindowSize()
  const router = useRouter()
  const pathName = usePathname()
  const searchParams = useSearchParams()
  const nextSearchParams = new URLSearchParams(searchParams.toString())
  const { resetForm } = useContext(FormContext)!
  const [pageKey, setPageKey] = useState(0);
  const {
    currentStep, 
    setCurrentStep,
    setNextClicked
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
    setPageKey((prevKey) => prevKey + 1);
    resetForm()
    router.back()
      // nextSearchParams.delete('type')
      // console.log("nextsearchparam ===", nextSearchParams)
      // console.log("pathName ===", pathName)
      // console.log("path result ===", `${pathName}?${nextSearchParams}`)
      // router.replace(`${pathName}?${nextSearchParams}`)
  }


  const handleGoBack = () => {
    setCurrentStep(currentStep - 1)
  }

  return (
    <>
         <div className='flex justify-center px-4 w-full lg:w-[680px] mx-auto h-[90%] lg:h-full overflow-auto' >
            <div className="flex flex-row gap-8">
             <div className={twMerge(styles.titleDiv, width < 1024 ? "flex-col !pb-1" : "")}>
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
              // 'transition ease-in-out duration-300',
            )} >
               {width >= 1024 && <Form.StepStatus stepIndex={currentStep}></Form.StepStatus>}
               {steps[currentStep - 1].component ?? steps[0].component}
            </div>
          </div>
    </>
  );
};

export default StaffModalFullpage;
