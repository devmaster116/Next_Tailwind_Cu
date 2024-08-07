import React, { useEffect, useState } from 'react';
import styles from './StaffRoles.module.scss';
import { db } from '@/firebase/config';
import { collection, getDocs } from 'firebase/firestore';


interface RoleInfo {
  role: string;
  access: string;
  staff: number;
}






const StaffRoles: React.FC = ({viewModal,roles, onEditRole}) => {
  return (
    <div className={styles.table}>
    <div className={styles.header}>
        <div className={styles.roleandAccess}> Role & Access</div>
        <div className={styles.role}>Role</div>
        <div className={styles.access}>Access</div>
        <div className={styles.staff}>Staff</div>
        <div className={styles.actions}>Action</div>
    </div>
    {roles.map((item :any, index:any) => (
        <div key={index} className={styles.row}>
            <div className={styles.role}>{item.name}</div>
            <div className={styles.access} >{item.description}</div>
            <div className={styles.staff} >{item.staff} <span>Staff</span></div>
            <div className={styles.mobileRow}>
              <div className={styles.nameAndStaff}>
              <div className={styles.role}>{item.name}</div>
              <div className={styles.staff} >{item.staff} <span>Staff</span></div>
              </div>
            <div className={styles.access} >{item.description}</div>
            </div>
            <div className={styles.action} >
                <button className={styles.button}  onClick={() => item.name === 'Owner' ? viewModal() : onEditRole(item)} >
                {item.name === 'Owner' ? 'View' : 'Edit'}
                </button>
            </div>
        </div>
    ))}
</div>
  );
};

export default StaffRoles;