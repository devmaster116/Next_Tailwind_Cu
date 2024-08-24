import styles from "../StaffModalFullPage.module.scss";
import { useFormStep } from "@/app/hooks/useFormStep";
import { useContext } from "react";
import { FormContext } from "@/app/context/StaffContext";
import { twMerge } from "tailwind-merge";
type StaffModalFooterProps = {
  title: string
  handleGoForwardStep?: () => void
  handleGoBack?: () => void
  handleClose?: () => void
}
export const StaffModalFooter = ({
  title,
  handleGoForwardStep,
  handleGoBack,
  handleClose,
}: StaffModalFooterProps) => {
  const { currentStep } = useFormStep();
  const { currentStaff} = useContext(FormContext)!;
  
  return (
    // <div className={styles.modalFooter}>
      <div className={'flex justify-center items-center mt-4 pt-1 border-t border-gray-200 lg:hidden'}>
        <button 
          className={twMerge(
            styles.updateBtn,
            'w-full'
          )} 
          onClick={handleGoForwardStep}
        >
          {currentStep==4?"Save":"Next"}
        </button>
      </div>

  )
}
