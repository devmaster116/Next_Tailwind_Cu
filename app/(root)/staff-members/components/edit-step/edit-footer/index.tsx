import styles from "../../StaffModalFullPage.module.scss";
type StaffModalFooterProps = {
  title: string
  handleGoForwardStep?: () => void
  handleGoBack?: () => void
  handleClose?: () => void
}
export const StaffEditModalFooter = ({
  title,
  handleGoForwardStep,
  handleGoBack,
  handleClose,
}: StaffModalFooterProps) => {

  
  return (
    <div className={styles.modalFooter}>
            <button 
            className={styles.updateBtn} 
            onClick={handleGoForwardStep}
            >
            Update
            </button>  
     
      </div>

  )
}
