import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./Staff.module.scss";
import { db } from "@/firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { IConfig, ConfigStaffMember } from "@/app/src/types";
import { getShrinkName } from "@/app/utils";
import StaffView from "../components/staff-view";
import CustomModal from "@/app/components/CustomModal";
import { useBanner } from "@/app/context/BannerContext";
import { useKitchen } from "@/app/context/KitchenContext";
import { FormContext } from "@/app/context/StaffContext";
import { twMerge } from "tailwind-merge";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ViewStaffModal from "./ViewStaffModal";
import useWindowSize from "@/app/hooks/useWindowSize";

const useOutsideAlerter = (
  tblRef: any,
  ref: any,
  onClickOutside: () => void
) => {
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        !tblRef.current.contains(event.target)
      ) {
        onClickOutside();
      }
    };
    document.addEventListener("mouseup", handleClickOutside);
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [ref]);
};

interface StaffProps {
  staffList: IConfig;
}

const Staffs: React.FC<StaffProps> = ({ staffList }) => {
  const { setBanner } = useBanner();
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const { kitchen } = useKitchen();
  const kitchenId = kitchen?.kitchenId ?? null;
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { loadStaffForEdit, currentStaff } = useContext(FormContext)!;
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [isExiting, setIsExiting] = useState(false);
  const { width } = useWindowSize();
  const mediumSizeScreen = 1024;

  const modalRef = useRef(null);
  const tblRef = useRef(null);

  useOutsideAlerter(tblRef, modalRef, () => {
    setIsExiting(true);
    setTimeout(() => {
      window.history.replaceState(null, "", "/staff-members");
    }, 500);
  });

  const openDeleteStaffModal = () => {
    setOpenDeleteModal(!openDeleteModal);
  };
  const updateStaff = async () => {
    setOpenDeleteModal(!openDeleteModal);

    if (!kitchenId) {
      console.error("Kitchen ID is required but was not provided.");
      setErrors(prevErrors => ({
        ...prevErrors,
        kitchenId: "Kitchen ID is required",
      }));
      return;
    }

    try {
      const configDocRef = doc(db, "configs", kitchenId);
      const configDoc = await getDoc(configDocRef);

      if (!configDoc.exists()) {
        console.log("Config document does not exist!");
        return;
      }

      try {
        const configDocRef = doc(db, "configs", kitchenId);
        const configDoc = await getDoc(configDocRef);

        if (!configDoc.exists()) {
          console.log("Config document does not exist!");
          return;
        }

        const { staffMemberConfigs = {} } = configDoc.data();
        const { staffMembers = [] } = staffMemberConfigs;

        if (currentStaff && currentStaff.id) {
          const updatedStaffMembers = staffMembers.filter(
            (member: ConfigStaffMember) => member.id !== currentStaff.id
          );

          await updateDoc(configDocRef, {
            "staffMemberConfigs.staffMembers": updatedStaffMembers,
          });
          window.history.replaceState(null, "", "/staff-members");
          setBanner(true);
        } else {
          console.log("Invalid staffItem or missing roleID");
        }
      } catch (error) {
        console.error("Error deleting role:", error);
      }
    } catch (error) {}
  };

  const togglePanel = (item: ConfigStaffMember) => {
    router.push(`${pathName}?type=view-staff&id=${item.id}`);
    if (width < mediumSizeScreen) {
      if (typeof window != "undefined" && window.document) {
        document.body.style.overflow = "hidden";
      }
    }

    loadStaffForEdit(item);
  };

  const CloseTogglePanel = () => {
    window.history.replaceState(null, "", "/staff-members");
    width < mediumSizeScreen ? (document.body.style.overflow = "unset") : "";
  };

  useEffect(() => {
    if (!searchParams?.get("type")?.includes("view-staff")) setIsExiting(false);
  }, [searchParams?.get("type")?.includes("view-staff")]);

  return (
    <>
      <div className={styles.table}>
        <div className={styles.header}>
          <div className={styles.headerName}>Name/Nickname</div>
          <div className={styles.headerRole}> Role </div>
        </div>
        <div className={styles.body} ref={tblRef}>
          {staffList &&
            staffList &&
            staffList?.staffMembers?.map(
              (item: ConfigStaffMember, index: number) => (
                <div
                  className={styles.row}
                  key={index}
                  onClick={() => {
                    togglePanel(item);
                  }}
                >
                  <div className={styles.leftItem}>
                    <div className={styles.avatar}>
                      {item?.displayImageURL ? (
                        <img
                          src={item.displayImageURL}
                          className="rounded-full w-12 h-12"
                          alt="Uploaded"
                          width="100"
                        />
                      ) : (
                        <>{getShrinkName(item.firstName, item.lastName)}</>
                      )}
                    </div>
                    <div className={styles.content}>
                      <p className={styles.fullName}>
                        {item.firstName + " " + item.lastName}
                      </p>
                      <p className={styles.nickName}>@{item.displayName}</p>
                    </div>
                  </div>
                  <div
                    className={twMerge(
                      styles.rightItem,
                      `!text-[1rem] lg:!text-[1.125rem] mt-[-20px]lg:mt-[-20px] self-baseline`
                    )}
                  >
                    {item.roleName}
                  </div>
                </div>
              )
            )}
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
              <h3 className={twMerge(styles.deleteModalTitle, "text-gray-900")}>
                Delete Staff Member?
              </h3>
              <p className={styles.deleteMessage}>
                Are you sure you want to delete the{" "}
                {currentStaff?.firstName + " " + currentStaff?.lastName}?
              </p>
              <br />
              <p className={styles.description}>
                This action cannot be undone and all related data will be
                permanently removed.
              </p>
            </>
          }
        />
      )}

      <ViewStaffModal
        ref={modalRef}
        staffList={staffList}
        isExiting={isExiting}
        setIsExiting={setIsExiting}
        show={searchParams?.get("type")?.includes("view-staff") || false}
        onClose={CloseTogglePanel}
        title={currentStaff?.firstName + " " + currentStaff?.lastName}
        content={
          <>
            <StaffView
              className="h-[90%] lg:h-full overflow-auto"
              onDeleteModalOpen={openDeleteStaffModal}
              onClose={CloseTogglePanel}
            />
          </>
        }
      />
    </>
  );
};

export default Staffs;
