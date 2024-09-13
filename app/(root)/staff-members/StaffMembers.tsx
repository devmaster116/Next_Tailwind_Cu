"use client";
import React, { useContext, useEffect, useMemo, useState } from "react";
import withAuth from "@/app/components/Auth/withAuth";
import LightLoader from "@/app/components/LightLoader";
import Staffs from "./components/Staffs";
import StaffModalFullPage from "./components/StaffModalFullpage";
import { IConfig } from "@/app/src/types";
import { ToastStatus } from "../../components/base/toast-status";
import Drawer from "react-modern-drawer";

import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";

import styles from "./StaffMember.module.scss";
import { useBanner } from "@/app/context/BannerContext";
import { useFormStep } from "@/app/hooks/useFormStep";
import { UserSvg } from "@/app/assets/svg/user";
import { FormContext } from "@/app/context/StaffContext";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { PlusIcon } from "@/app/assets/svg/plusIcon";

const StaffMembers = () => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const { banner, setBanner } = useBanner();
  const { statusAddStaff, setStatusAddStaff } = useFormStep();

  const { currentStaff, roles, getStaffRole } = useContext(FormContext)!;

  const [staffConfig, setStaffConfig] = useState<IConfig[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "configs"), snapShot => {
      const _configs: IConfig[] = [];

      snapShot.docs.forEach(data => {
        _configs.push(data.data().staffMemberConfigs as IConfig);
      });

      if (!_configs?.[0]?.staffMembers) {
        setStaffConfig(_configs);
        return;
      }

      const _staffMembers = _configs[0].staffMembers;

      const updateConfigs = async () => {
        const updatedConfigs = await Promise.all(
          _staffMembers.map(async staff => {
            const role = roles.find(r => r.id === staff.roleId);
            if (role) {
              return {
                ...staff,
                roleName: role.name,
                description: role.description,
              };
            }
            return staff;
          })
        );

        _configs[0] = {
          ..._configs[0],
          staffMembers: updatedConfigs,
        };

        setStaffConfig(_configs);
      };

      updateConfigs()
        .then(() => {
          console.log("Configs updated with roles from context:", _configs);
        })
        .catch(error => {
          console.error("Error updating configs:", error);
        });
    });

    return () => unsubscribe();
  }, [roles]);

  const handleClose = () => {
    setBanner(false);
  };
  const handleAddStaff = async () => {
    router.push(`${pathName}?type=add-staff`);
  };

  const handleCloseStaffBanner = () => {
    setStatusAddStaff(false);
  };

  const openModal = useMemo(() => {
    return searchParams?.get("type") === "add-staff";
  }, [searchParams]);

  useEffect(() => {
    getStaffRole();
  }, []);

  if (!Array.isArray(staffConfig) || staffConfig.length === 0)
    return (
      <>
        <LightLoader />
      </>
    );

  return (
    <>
      {banner && (
        <ToastStatus
          label={`${currentStaff?.firstName} was deleted as staff member`}
          onClose={handleClose}
        />
      )}
      {statusAddStaff && (
        <ToastStatus
          label={"New staff member created"}
          onClose={handleCloseStaffBanner}
        />
      )}
      <div className={"w-full"}>
        {staffConfig?.[0]?.staffMembers?.length > 0 ? (
          <>
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>Staff Members</h1>
              <button className={styles.buttonPrimary} onClick={handleAddStaff}>
                <span style={{ marginRight: "8px" }}>
                  <PlusIcon width={14} height={14} color="#fff" />
                </span>
                Staff Member
              </button>
            </div>
            <Staffs staffList={staffConfig} />
          </>
        ) : (
          <>
            <div className={styles.freshpageHeader}>
              <h1 className={styles.pageTitle}>Staff Members</h1>
            </div>
            <div className="bg-white flex flex-col rounded-lg border border-gray-200 px-4 py-5 mt-5 lg:mt-3">
              <div className="flex items-center justify-center pb-4">
                <div className="flex flex-col items-center ">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <UserSvg />
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-gray-800 font-semibold text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px] mb-2">
                  No Staff Created
                </p>
                <p className="text-gray-800 font-normal text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] mb-4">
                  You haven't created any staff yet.
                </p>
                <button
                  className={styles.buttonPrimary}
                  onClick={handleAddStaff}
                >
                  <span style={{ marginRight: "8px" }}>
                    <PlusIcon width={14} height={14} color="#fff" />
                  </span>
                  Staff Member
                </button>
              </div>
            </div>
          </>
        )}
        <Drawer
          open={openModal}
          direction="bottom"
          className="w-full !h-full"
          overlayOpacity={0}
        >
          <StaffModalFullPage type="add" editPage="" />
        </Drawer>

        <Drawer
          open={searchParams?.get("type") === "edit-staff"}
          direction="bottom"
          className="w-full !h-full e"
          lockBackgroundScroll={true}
          overlayOpacity={0}
        >
          <StaffModalFullPage type="edit" editPage="user-info" />
        </Drawer>
        <Drawer
          open={searchParams?.get("type") === "edit-role"}
          direction="bottom"
          className="w-full !h-full"
          lockBackgroundScroll={true}
          overlayOpacity={0}
        >
          <StaffModalFullPage type="edit" editPage="user-role" />
        </Drawer>
        <Drawer
          open={searchParams?.get("type") === "edit-code"}
          direction="bottom"
          className="w-full !h-full"
          lockBackgroundScroll={true}
          overlayOpacity={0}
        >
          <StaffModalFullPage type="edit" editPage="user-sign" />
        </Drawer>
      </div>
    </>
  );
};

export default withAuth(StaffMembers);
