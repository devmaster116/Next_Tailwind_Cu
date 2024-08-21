import Image from "next/image";
import styles from "../StaffModalFullPage.module.scss";
import { useFormStep } from "@/app/hooks/useFormStep";
import { useContext } from "react";
import { FormContext } from "@/app/context/StaffContext";
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
    <div className={styles.modalFooter}>

            {currentStaff?(
                <button 
                className={styles.updateBtn} 
                onClick={handleGoForwardStep}
                >
                Update
                </button>  
                ):
                <button 
                  className={styles.updateBtn} 
                  onClick={handleGoForwardStep}
                >
                  {currentStep==4?"Save":"Next"}
                </button>}
      </div>

  )
}
