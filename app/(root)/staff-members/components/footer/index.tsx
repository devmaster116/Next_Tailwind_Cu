import Image from "next/image";
import styles from "../StaffModalFullPage.module.scss";
import { useFormStep } from "@/app/hooks/useFormStep";
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
  
  return (
    <div className={styles.modalFooter}>
              <button  className={styles.updateBtn} onClick={handleGoForwardStep}>
              {currentStep==4?'Save' : 'Next'}
              </button>
     </div>
    // <div className={styles.titleDiv}>
    //   <button className={styles.titleAddCloseBtn} onClick={currentStep>1?handleGoBack:handleClose}>
    //       <Image
    //       className={styles.icon}
    //       src="/icons/close.svg"
    //       height={12}
    //       width={12}
    //       alt="Close Button"
    //       style={{
    //         filter:
    //           "invert(35%) sepia(5%) saturate(368%) hue-rotate(175deg) brightness(98%) contrast(90%)",
    //       }}
    //     />
    //   </button>
    //   <div className={styles.titleText}>{title}</div>
       
    //   {/* <button 
    //     className={styles.saveBtn} 
    //     onClick={handleGoForwardStep}
    //   >
    //     {currentStep==4?"Save":"Next"}
    //   </button> */}
    // </div>
  )
}
