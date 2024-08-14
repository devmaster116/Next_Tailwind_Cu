import Image from "next/image";
import styles from "../StaffModalFullPage.module.scss";
import { useFormStep } from "@/app/hooks/useFormStep";
type StaffModalHeaderProps = {
  title: string
  handleGoForwardStep: () => void
  handleGoBack: () => void
}
export const StaffModalHeader = ({
  title,
  handleGoForwardStep,
  handleGoBack
}: StaffModalHeaderProps) => {
  const { currentStep } = useFormStep();
  
  return (
    <div className={styles.titleDiv}>
      <button className={styles.titleAddCloseBtn} onClick={handleGoBack}>
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
      <button 
        className={styles.saveBtn} 
        onClick={handleGoForwardStep}
      >
        {currentStep==4?"Save":"Next"}
      </button>
    </div>
  )
}
