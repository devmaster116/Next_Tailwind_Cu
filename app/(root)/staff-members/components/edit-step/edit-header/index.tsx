import Image from "next/image";
import styles from "../../StaffModalFullPage.module.scss";
import { twMerge } from "tailwind-merge";
import useWindowSize from "@/app/hooks/useWindowSize";
type StaffModalHeaderProps = {
  title: string
  children?: React.ReactNode
  handleGoForwardStep?: () => void
  handleGoBack?: () => void
  handleClose?: () => void
}
export const StaffEditModalHeader = ({
  title,
  children,
  handleGoForwardStep,
  handleGoBack,
  handleClose,
}: StaffModalHeaderProps) => {
  const { width } = useWindowSize()
  
  const EditMobileHeader = () => (
    <div className={twMerge(
      styles.titleDiv,
      "flex-col !pb-1"
    )}>
      <div className="flex juitify-between items-center w-full">
        <button className={styles.titleAddCloseBtn} onClick={handleClose}>

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
       Update
        </button>
      </div>
      {children && (
        <div className="w-full mt-2">
          {children}
        </div>
      )}
    </div>
  )

  const EditDesktopHeader = () => (
    <div className={styles.titleDiv}>
      <button className={styles.titleAddCloseBtn} onClick={handleClose}>

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
       Update
      </button>
    </div>
  )

  if (width < 1024)
    return <EditMobileHeader />
  return <EditDesktopHeader />

}

