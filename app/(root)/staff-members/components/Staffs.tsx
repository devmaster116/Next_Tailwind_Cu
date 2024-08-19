import React, { useEffect, useState } from 'react';
import styles from './Staff.module.scss';
import { db } from '@/firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { IConfig ,ConfigStaffMember} from '@/app/src/types';
import { getShrinkName } from '@/app/utils';
import StaffView from '../components/staff-view';
import Drawer from 'react-modern-drawer'
import CustomModal from '@/app/components/CustomModal';
import { ToastContainer, toast } from 'react-toastify';
import { useBanner } from '@/app/context/BannerContext';
import useWindowSize from '@/app/hooks/useWindowSize';
interface StaffProps {
  staffList: IConfig[];
}


const Staffs: React.FC<StaffProps> = ({ staffList}) => {
  const { width } = useWindowSize()
  const { setBanner } = useBanner()
  const [viewStaff, setViewStaff] = useState(false);
  const [staffItem,setStaffItem]=useState<ConfigStaffMember | undefined>(undefined)
  const [openDeleteModal, setOpenDeleteModal]=useState<boolean>(false)
  const openDeleteStaffModal = () => {
    setOpenDeleteModal(!openDeleteModal)
  }
 
  const updateStaff = () =>{
     
    setViewStaff(!viewStaff);
    setOpenDeleteModal(!openDeleteModal)
    setBanner(true)
  }
 
  const togglePanel = (item:ConfigStaffMember) => {
    setViewStaff(!viewStaff);
    setStaffItem(item)
  };
  const CloseTogglePanel=()=>{
    setViewStaff(!viewStaff);
  }
  return (
    <>     
      <div className={styles.table}>
        <div className={styles.header}>
            <div className={styles.headerName}>Name/Nickname</div>
            <div className={styles.headerRole }> Role </div>
      
        </div>
        <div className={styles.body}>
        {staffList[0].staffMembers?.map((item:ConfigStaffMember, index:number) => (
          <div className={styles.row} key={index} onClick={()=>togglePanel(item)  }>
            <div className={styles.leftItem}>
              <div className={styles.avatar}>
                  {getShrinkName(item.firstName, item.lastName)}
              </div>
              <div className={styles.content}>
                <p className={styles.fullName}>{item.firstName+" " +item.lastName}</p>
                <p className={styles.nickName}>@{item.displayName}</p>
              </div>
            </div>
            <div className={styles.rightItem}>
              <p>{item.roleName}</p>
            </div>
          </div>  
        ))}
        </div>
      </div>
      
      {openDeleteModal && (
          <CustomModal
            show={openDeleteModal}
            onClose={openDeleteStaffModal}
            type="delete"
            title=""
            onUpdateClick={updateStaff}
            confirmButtonText="Delete Now"
            cancelButtonText="Keep Staff"
            content={
              <>
                <h3 className={styles.deleteModalTitle}>Delete Staff Member?</h3>
                <p className={styles.deleteMessage}>
                  Are you sure you want to delete the {staffItem?.firstName + " " + staffItem?.lastName}?
                </p>
                <br />
                <p className={styles.description}>
                 This action cannot be undone and all related data will be permanently removed.
                </p>
              </>
            }
          />
      )}

      <Drawer
        open={viewStaff}
        onClose={CloseTogglePanel}
        direction='right'
        className='!w-full lg:w-[400px] overflow-auto bg-white '
        lockBackgroundScroll={true}
        overlayColor="bg-grey-25"
        overlayOpacity={0}
      >
        <StaffView
          className='h-[90%] overflow-auto' 
          onClose={CloseTogglePanel} 
          item={staffItem}
          onDeleteModalOpen = {openDeleteStaffModal} 
        />
      </Drawer>
    </>
  );
};

export default Staffs;