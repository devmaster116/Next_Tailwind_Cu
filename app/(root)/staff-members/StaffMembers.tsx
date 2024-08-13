"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import withAuth from "@/app/components/Auth/withAuth";
import useWindowSize from "@/app/hooks/useWindowSize";
import LightLoader from "@/app/components/LightLoader";
import LoadingSkeleton from "./components/LoadingSkeleton";
import Staffs from "./components/Staffs";
import CustomModalFullPage from "@/app/components/CustomModalFullpage";
import CustomModal from "@/app/components/CustomModal";
import Input from "@/app/components/Input";
import {
  fetchPermissions,
  addRoleToExistingDocument,
  fetchRoles,
  subscribeRoles,
} from "./data-fetching";

import { Kitchen, RoleInfo, User,IConfig, ConfigStaffMember } from "@/app/src/types";
import {
  addDoc,
  collection,
  doc,
  FieldValue,
  getDoc,
  getDocs,
  query,
  updateDoc,
  arrayRemove,
  where,
  onSnapshot,
  DocumentData,
  QuerySnapshot,
} from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import {
  handleBlurField,
  handleInputChangeField,
  validateEmail,
  formatDate,
  validateMobileNumber,
} from "@/app/components/Auth/utils/helper";
import { User as FirebaseUser } from "firebase/auth";
import { useKitchen } from "../../context/KitchenContext";
import { useUser } from "../../context/UserContext";
import styles from "./StaffMember.module.scss";
import { FirebaseError } from "firebase/app";
import { v4 as uuidv4 } from "uuid"; // Import uuid to generate unique IDs



const StaffMembers = () => {
  const [loading, setLoading] = useState(false);
  const { kitchen } = useKitchen();
  const kitchenId = kitchen?.kitchenId ?? null
  const [editRoleModalOpen, setEditRoleModalOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState<any>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [ownerRoleModal, setOwnerRoleModal] = useState<any>();
  const [isExiting, setIsExiting] = useState(false);
  const [formState, setFormState] = useState<{ [key: string]: string }>({
    businessName: "",
    businessAddress: "",
    ownerEmail: "",
    ownerMobile: "",
    secondaryContactName: "",
    secondaryContactEmail: "",
    secondaryContacts: "",
  });
  const validateRequired = (value: string) => value?.trim().length > 0;

  const [addNewRoleModalOpen, setAddNewRoleModalOpen] = useState(false);
  const [permissions, setPermissions] = useState<any[]>([])
  const [staffConfig,setStaffConfig] = useState<IConfig[]>([])

  const [newRoleName, setNewRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]); // Track selected permissions by index
  const [roles, setRoles] = useState<RoleInfo[]>([]);
  const errorRef = useRef<HTMLParagraphElement | null>(null);
  const roleNameInputRef = useRef<HTMLInputElement | null>(null);
  const [editSelectedPermissions, setEditSelectedPermissions] = useState<
    number[]
  >([]);

  const [ownerDetials, setOwnerDetails] = useState<any>();

  const handleCloseModal = (modalStateSetter:  React.Dispatch<React.SetStateAction<boolean>>) => {
    setIsExiting(true);
    setTimeout(() => {
      modalStateSetter(false);
      setIsExiting(false);
      setErrors({});
      setSelectedPermissions([]);
      setEditSelectedPermissions([]);
      setRoleToEdit(null);
    }, 500);
  };



  useEffect(() => {
    if (errors.permissions && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [errors.permissions]);

  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewRoleName(e.target.value);
  };

  const togglePermission = (index: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };



  useEffect(() => {
    if (!kitchenId) {
      console.error("Kitchen ID is required but was not provided.");
      return;
    }
    const unsubscribePermissions = fetchPermissions((fetchedPermissions: any) => {
      setPermissions(
        fetchedPermissions.map((permission: any) => ({
          id: permission.id,
          label: permission.name,
          description: permission.description,
          enabled: false,
        }))
      );
    });

    const unsubscribeRoles = subscribeRoles(
      kitchenId,
      ({ rolesList, ownerDetails }: any) => {
        setRoles(rolesList);
        // setOwnerDetails(ownerDetails);
      }
    );

    return () => {
      if (unsubscribePermissions) unsubscribePermissions();
      if (unsubscribeRoles) unsubscribeRoles();
    };
  }, [kitchenId]);


  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "configs"), (snapShot) => {
      const _configs: IConfig[] = []

      snapShot.docs.forEach(data => {
        _configs.push(data.data().staffMemberConfigs as IConfig)
      })
      setStaffConfig(_configs)
    });
    () => unsubscribe()
  }, []);

  useEffect(() => {

    const unsubscribe = onSnapshot(collection(db, "roles"), (snapShot) => {
      const ownerData: RoleInfo[] = []

      snapShot.docs.forEach(data => {
        ownerData.push(data.data() as RoleInfo)

      })

      setOwnerDetails(ownerData[0]?.roles[0])
    });
    () => unsubscribe()
  }, [])
  useEffect(() => {
    const fetchRolesData = async () => {
      try {
        const { rolesList, ownerDetails } = await fetchRoles(permissions);
        setRoles(rolesList);
        // setOwnerDetails(ownerDetails);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      }
    };

    fetchRolesData();
  }, [permissions]);

 useEffect(() => {
    const fetchRolesData = async () => {
      try {
        const { rolesList, ownerDetails } = await fetchRoles(permissions);
        setRoles(rolesList);
        // setOwnerDetails(ownerDetails);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      }
    };

    fetchRolesData();
  }, [permissions]);


  const handleSubmit = async () => {
    setErrors({});
    if (!kitchenId) {
      console.error("Kitchen ID is required but was not provided.");
      setErrors((prevErrors) => ({
        ...prevErrors,
        kitchenId: "Kitchen ID is required",
      }));
      return;
    }

    if (!newRoleName.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        businessName: "Role name is required",
      }));
      if (roleNameInputRef.current) {
        roleNameInputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    if (selectedPermissions.length === 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        permissions: "At least one permission is required",
      }));
      if (errorRef.current) {
        errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    try {
      const roleDocRef = doc(db, "roles", kitchenId);
      const roleSnapshot = await getDoc(roleDocRef);

      if (roleSnapshot.exists()) {
        const rolesData = roleSnapshot.data().roles || [];
        const roleExists = rolesData.some(
          (role: any) =>
            role.name.toLowerCase() === newRoleName.trim().toLowerCase()
        );
        if (roleExists) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            businessName: "Role name already exists",
          }));
          return;
        }
      }

      const selectedPermissionDetails = selectedPermissions.map(
        (index) => permissions[index]
      );
      const combinedDescriptions = selectedPermissionDetails
        .map((permission) => permission.label)
        .join(", ");

      const newRole = {
        id: `role_${uuidv4()}`,
        name: newRoleName,
        description: combinedDescriptions || "No description",
        permissions: selectedPermissionDetails.map((permission) => ({
          id: permission.id,
          name: permission.label,
          description: permission.description || "No description available",
        })),
      };

      await addRoleToExistingDocument(newRole, kitchenId);

      handleCloseModal(setAddNewRoleModalOpen);

    } catch (error) {
      console.error("Error saving role:", error);
    }
  };
  const plusIcon = (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.99984 1.16667V12.8333M1.1665 7H12.8332"
        stroke="white"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );


  return (
    <>
      <div className={styles.main_container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Staff Members</h1>
          <button
            className={styles.buttonPrimary}
            onClick={() =>{ setAddNewRoleModalOpen(true);}}
          >
            <span style={{ marginRight: "8px" }}>{plusIcon}</span>
            Staff Member{" "}
          </button>
        </div>
        {
          staffConfig && staffConfig.length > 0 && (
            <Staffs
              staffList={staffConfig}
            />
          )
        }
        {addNewRoleModalOpen && (
          <CustomModalFullPage
            show={addNewRoleModalOpen}
            onClose={() => handleCloseModal(setAddNewRoleModalOpen)}
            type="next"
            title={"Add Staff Member"}
            isExiting={isExiting}
            onUpdateClick={handleSubmit}
            onDeleteClick={() => { }}
            content={
              <>
                <div className={styles.formContainer}>

                  <h2 className={`${styles.ownerpermission} ${styles.mobilePadding} ${styles.mobileDivider}`}>
                    Profile
                  </h2>
                   <p>Add your staff members name, nickname, email address and mobile number</p>   
                   <form className={styles.formContainer}>
                  <Input
                    value={formState.businessName}
                    handleInputChange={(e) =>
                      handleInputChangeField(
                        e,
                        setFormState,
                        setErrors,
                        "businessName"
                      )
                    }
                    handleBlurField={(e) =>
                      handleBlurField(
                        e,
                        setFormState,
                        setErrors,
                        validateRequired,
                        "Please enter a valid business name.",
                        "businessName"
                      )
                    }
                    error={errors.businessName}
                    loading={loading}
                    placeholder="Enter New Business Name"
                  />
                </form>
                </div>
              </>
            }
          />
        )}

        {loading && (
          <>
            <LightLoader />
          </>
        )}
      </div>
    </>
  );
};

export default withAuth(StaffMembers);