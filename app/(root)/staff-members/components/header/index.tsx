import Image from "next/image";
import styles from "../StaffModalFullPage.module.scss";
import { useFormStep } from "@/app/hooks/useFormStep";
import { useContext } from "react";
import { FormContext } from "@/app/context/StaffContext";
type StaffModalHeaderProps = {
  title: string
  handleGoForwardStep?: () => void
  handleGoBack?: () => void
  handleClose?: () => void
}
export const StaffModalHeader = ({
  title,
  handleGoForwardStep,
  handleGoBack,
  handleClose,
}: StaffModalHeaderProps) => {
  const { currentStep } = useFormStep();
  const { currentStaff} = useContext(FormContext)!;
  
  return (
    <div className={styles.titleDiv}>
      <button className={styles.titleAddCloseBtn} onClick={currentStep>1?handleGoBack:handleClose}>
          <Image
          className={styles.icon}
          src="/icons/close.svg"
          height={12}
          width={12}
          alt="Close Button"
          style={{
            filter:
              "invert(35%) sepia(5%) saturate(368%) hue-rotate(175deg) brightness(98%) contrast(90%)",
          }}
        />
      </button>
      <div className={styles.titleText}>{title}</div>
      {/* edit staff */}
      {currentStaff?(
        <button 
        className={styles.saveBtn} 
        onClick={handleGoForwardStep}
      >
       Update
      </button>  
      ):
      <button 
        className={styles.saveBtn} 
        onClick={handleGoForwardStep}
      >
        {currentStep==4?"Save":"Next"}
      </button>}
    </div>
  )
}
