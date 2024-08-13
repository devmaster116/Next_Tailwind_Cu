import React, { useEffect, useState } from 'react';
import styles from './Staff.module.scss';
import { db } from '@/firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { IConfig ,ConfigStaffMember} from '@/app/src/types';
import { getShrinkName } from '@/app/utils';


interface StaffProps {
  staffList: IConfig[];
}


const Staffs: React.FC<StaffProps> = ({ staffList}) => {
  return (
    <div className={styles.table}>
      <div className={styles.header}>
          <div className={styles.headerItem}>Name/Nickname</div>
          <div className={styles.headerItem }> Role </div>
    
      </div>
      <div className={styles.body}>
      {staffList[0].staffMembers?.map((item:ConfigStaffMember, index:number) => (
        <div className={styles.row} key={index}>
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
  );
};

export default Staffs;