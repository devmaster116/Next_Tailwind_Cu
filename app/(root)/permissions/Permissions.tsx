"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import withAuth from "@/app/components/Auth/withAuth";
import useWindowSize from "@/app/hooks/useWindowSize";
import LightLoader from "@/app/components/LightLoader";
import LoadingSkeleton from "./components/LoadingSkeleton";
import StaffRoles from "./components/StaffRoles";
import CustomModalFullPage from "@/app/components/CustomModalFullpage";
import CustomModal from "@/app/components/CustomModal";
import Input from "@/app/components/Input";
import {
  fetchPermissions,
  addRoleToExistingDocument,
  fetchRoles,
  subscribeRoles,
} from "./data-fetching";

import { Kitchen, RoleInfo, User } from "@/app/src/types";
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
import styles from "./Permission.module.scss";
import { FirebaseError } from "firebase/app";
import { v4 as uuidv4 } from "uuid"; // Import uuid to generate unique IDs



const Permissions = () => {
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

  const [addNewRoleModalOpen, setAddNewRoleModalOpen] = useState(false);
  const [permissions, setPermissions] = useState<any[]>([])
  const [newRoleName, setNewRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]); // Track selected permissions by index
  const [roles, setRoles] = useState<RoleInfo[]>([]);
  const errorRef = useRef<HTMLParagraphElement | null>(null);
  const roleNameInputRef = useRef<HTMLInputElement | null>(null);
  const [editSelectedPermissions, setEditSelectedPermissions] = useState<
    number[]
  >([]);
  const [deleteModal, setDeleteModal] = useState(false)


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
      // setNewRoleName("");
    }, 500);
  };


  const handleEditRole = (role: RoleInfo) => {
    setRoleToEdit({
      ...role,
      originalName: role.name,
    });
    setEditSelectedPermissions(
      role.permissions.map((p: any) =>
        permissions.findIndex((permission) => permission.label === p.name)
      )
    );
    setEditRoleModalOpen(true);
  };
  const handleRoleNameChange = (e: any) => {
    setRoleToEdit((prev: any) => ({
      ...prev,
      name: e.target.value,
    }));
  };
  const handleDeleteRole = async () => {
    // console.log('deleted triggered')
    if (!roleToEdit) return;
    if (!kitchenId) {
      console.error("Kitchen ID is required but was not provided.");
      setErrors((prevErrors) => ({
        ...prevErrors,
        kitchenId: "Kitchen ID is required",
      }));

      return;
    }

    try {
      const roleDocRef = doc(db, "roles", kitchenId);
      const roleSnapshot = await getDoc(roleDocRef);
      if (roleSnapshot.exists()) {
        const rolesData = roleSnapshot.data().roles || [];
        const updatedRoles = rolesData.filter(
          (r: any) => r.id !== roleToEdit.id // Use ID to identify the role to delete
        );
        
        await updateDoc(roleDocRef, { roles: updatedRoles });
      }
      setEditRoleModalOpen(false);
      setDeleteModal(false);
      setRoleToEdit(null);
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  useEffect(() => {
    if (errors.permissions && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [errors.permissions]);

  const handleEditSubmit = async () => {
    if (!roleToEdit) return;
    setErrors({}); // Clear previous errors

    if (!roleToEdit.name.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        roleName: "Role name is required",
      }));
      if (roleNameInputRef.current) {
        roleNameInputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    if (editSelectedPermissions.length === 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        permissions: "At least one permission is required",
      }));
      if (errorRef.current) {
        errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    if (!kitchenId) {
      console.error("Kitchen ID is required but was not provided.");
      setErrors((prevErrors) => ({
        ...prevErrors,
        kitchenId: "Kitchen ID is required",
      }));
      return;
    }

    try {
      const updatedPermissions = editSelectedPermissions
        .map((index) => {
          const permission = permissions[index];
          return permission
            ? {
              name: permission.label,
              description: permission.description,
              id: permission.id
            }
            : null;
        })
        .filter(Boolean);

      const combinedDescriptions = updatedPermissions
        .map((permission: any) => permission.name)
        .join(", ");

      const updatedRole = {
        ...roleToEdit,
        permissions: updatedPermissions,
        description: combinedDescriptions || "No description", // Update the role description
      };

      const roleDocRef = doc(db, "roles", kitchenId);
      const roleSnapshot = await getDoc(roleDocRef);

      if (roleSnapshot.exists()) {
        const rolesData = roleSnapshot.data().roles || [];
        const updatedRoles = rolesData.map((r: any) =>
          r.id === roleToEdit.id ? updatedRole : r // Use ID to identify the role to update
        );
        // Update the roles document
        await updateDoc(roleDocRef, { roles: updatedRoles });
        setRoles(updatedRoles);
        // console.log("Role updated successfully:", updatedRole);
      } else {
        console.error("Roles document not found");
      }
      handleCloseModal(setEditRoleModalOpen);



      // Close the modal and clear role to edit
      // setEditRoleModalOpen(false);
      // setRoleToEdit(null);
      // setEditSelectedPermissions([]);
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewRoleName(e.target.value);
  };

  const togglePermission = (index: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleEditPermission = (index: number) => {
    setEditSelectedPermissions((prev: any) =>
      prev.includes(index)
        ? prev.filter((i: any) => i !== index)
        : [...prev, index]
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
    const unsubscribe = onSnapshot(collection(db, "roles"), (snapShot) => {
      const ownerData: RoleInfo[] = []

      snapShot.docs.forEach(data => {
        ownerData.push(data.data() as RoleInfo)
      })

      setOwnerDetails(ownerData[0]?.roles[0])
    });
    () => unsubscribe()
  }, [])
  
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
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );

  const viewRoleModal = () => {
    setOwnerRoleModal(true);
  };

  return (
    <>
      <div className={styles.main_container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>POS Permissions</h1>
          <button
            className={styles.buttonPrimary}
            onClick={() =>{ setAddNewRoleModalOpen(true);setNewRoleName("");}}
          >
            <span style={{ marginRight: "8px" }}>{plusIcon}</span>
            New Role{" "}
          </button>
        </div>
        <StaffRoles
          viewModal={viewRoleModal}
          roles={roles}
          onEditRole={handleEditRole}
        />
        {addNewRoleModalOpen && (
          <CustomModalFullPage
            show={addNewRoleModalOpen}
            onClose={() => handleCloseModal(setAddNewRoleModalOpen)}
            type="add"
            title={"Add New Role"}
            isExiting={isExiting}
            onUpdateClick={handleSubmit}
            onDeleteClick={() => { }}
            content={
              <>
                <div className={styles.formContainer}>
                  <div className={styles.inputLabelsection}>
                    <label className={styles.ownerpermission}>Role Name</label>
                    <Input
                      value={newRoleName}
                      handleInputChange={(e) => setNewRoleName(e.target.value)}
                       //handleBlurField={handleBlurField} // If needed
                      error={errors.businessName}
                      loading={loading}
                      placeholder="Enter Role Name"
                      ref={roleNameInputRef}
                    />
                     {/* <Input
                    value={roleToEdit.name}
                    handleInputChange={handleRoleNameChange}
                    error={errors.roleName}
                    loading={loading}
                    placeholder="Enter Role Name"
                    ref={roleNameInputRef}

                  /> */}

                  </div>


                  <h2 className={`${styles.ownerpermission} ${styles.mobilePadding} ${styles.mobileDivider}`}>
                    POS Role Permissions
                  </h2>

                  <ul className={styles.mobilePadding}>
                    {permissions.map((permission, index) => (
                      <li key={index} className={styles.permissionItem}>
                        <label className={styles.permissionsSection}>
                          <div>
                            <p className={styles.name}>{permission.label}</p>
                            <p className={styles.description}>
                              {permission.description}
                            </p>
                          </div>

                          <div className={styles.switch}>
                            <input
                              type="checkbox"
                              id={`toggle${index}`}
                              checked={selectedPermissions.includes(index)}
                              onChange={() => togglePermission(index)}
                              className={styles.toggle}
                            />
                            <span className={styles.slider}></span>
                          </div>
                        </label>
                      </li>

                    ))}
                  </ul>
                  <p
                    ref={errorRef}
                    style={{ color: "#F04438", textAlign: "center" }}
                  >
                    {" "}
                    {errors.permissions}
                  </p>
                </div>
              </>
            }
          />
        )}
        {/* ___________________________ */}

        {ownerRoleModal && ownerDetials?.name && (
          <CustomModalFullPage
            show={true}
            onClose={() => setOwnerRoleModal(null)}
            isExiting={isExiting}
            type="view"
            title="Owner"
            onUpdateClick={() => { }}
            onDeleteClick={() => { }}
            content={
              <div className={styles.formContainer}>
                {/* <h2>Role: {ownerDetials.name}</h2> */}
                <div className={styles.inputLabelsection}>
                  <h2 className={styles.ownerpermission}>Role Name</h2>
                  <input
                    type="text"
                    value={ownerDetials.name}
                    className={styles.readOnlyInput}
                    readOnly
                    style={{ width: '100%', }}
                    disabled
                  />
                  <p className={styles.warningMsg}>
                    This role name cannot be change.
                  </p>
                </div>
                {/* <h2 className={`${styles.ownerpermission} ${styles.mobilePadding} ${styles.mobiledivider}`}> */}

                <h2 className={`${styles.ownerpermission} ${styles.mobilePadding} ${styles.mobileDivider} ${styles.ownerPermissionMobile}`}>
                  Owners have full access. Permissions can’t be changed.{" "}
                </h2>
                <ul className={`${styles.disabled} ${styles.mobilePadding}`}>
                  {(ownerDetials.permissions || []).map(
                    (permission: any, index: any) => (
                      <li key={index} className={styles.permissionItem}>
                        <label className={styles.permissionsSection}>
                          <div>
                            <p className={styles.name}>{permission.name}</p>
                            <p className={styles.description}>
                              {permission.description}
                            </p>
                          </div>
                          <div className={styles.switch}>
                            <input
                              type="checkbox"
                              disabled
                              id={`toggle${index}`}
                              checked={true}
                              className={styles.toggle}
                            />
                            <span className={styles.slider}></span>
                          </div>
                        </label>
                      </li>
                    )
                  )}
                </ul>
              </div>
            }
          />
        )}

        {editRoleModalOpen && roleToEdit && (
          <CustomModalFullPage
            show={editRoleModalOpen}
            onClose={() => handleCloseModal(setEditRoleModalOpen)}
            isExiting={isExiting}
            type="edit"
            title={roleToEdit.name}
            updateButtonText="Update Role"
            onUpdateClick={handleEditSubmit}
            onDeleteClick={handleDeleteRole}
            content={
              <div className={styles.formContainer}>
                <div className={styles.inputLabelsection}>
                  <h2 className={styles.ownerpermission}>Role Name </h2>
                  <Input
                    value={roleToEdit.name}
                    handleInputChange={handleRoleNameChange}
                    error={errors.roleName}
                    loading={loading}
                    placeholder="Enter Role Name"
                    ref={roleNameInputRef}

                  />
                  {/* {errors.roleName && (
    <p style={{ color: "#F04438" }}>{errors.roleName}</p>
  )} */}
                  <div>
                    <button className={`${styles.deleteButtonMobile}`} onClick={() => { setDeleteModal(true) }}>Delete Role</button>
                  </div>
                </div>

                {/* <input type="text"  value={roleToEdit.name} className={styles.readOnlyInput} /> */}

                <h2 className={`${styles.ownerpermission} ${styles.mobilePadding} ${styles.mobileDivider}`}>POS Role Permissions</h2>
                <ul className={` ${styles.mobilePadding} ${styles.internalContainer}`}>
                  {permissions.map((permission, index) => (
                    <li key={index} className={styles.permissionItem}>
                      <label className={styles.permissionsSection}>
                        <div>
                          <p className={styles.name}>{permission.label}</p>
                          <p className={styles.description}>
                            {permission.description}
                          </p>
                        </div>
                        <div className={styles.switch}>
                          <input
                            type="checkbox"
                            id={`editToggle${index}`}
                            checked={editSelectedPermissions.includes(index)}
                            onChange={() => toggleEditPermission(index)}
                            className={styles.toggle}
                          />
                          <span className={styles.slider}></span>
                        </div>
                      </label>
                    </li>
                  ))}
                </ul>
                <p ref={errorRef} style={{ color: "#F04438", textAlign: "center" }}>
                  {errors.permissions}
                </p>
              </div>
            }
          />
        )}

        {deleteModal && roleToEdit && (
          <CustomModal
            show={deleteModal}
            onClose={() => setDeleteModal(false)}
            type="delete"
            title=""
            onUpdateClick={handleDeleteRole}
            confirmButtonText="Delete Role"
            cancelButtonText="Keep Role"

            content={
              <>
                <h3 className={styles.deleteModalTitle}>Deleting ‘{roleToEdit.name}’ role</h3>
                <p className={styles.deleteMessage}>
                  Are you sure you want to delete the role?
                </p>
                <br />
                <p className={styles.description}>
                  Confirming this means they wont have access to the portal
                  anymore.
                </p>
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

export default withAuth(Permissions);