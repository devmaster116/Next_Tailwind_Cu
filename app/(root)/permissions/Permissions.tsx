"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import withAuth from "@/app/components/Auth/withAuth";
import useWindowSize from "@/app/hooks/useWindowSize";
import LightLoader from "@/app/components/LightLoader";
import LoadingSkeleton from "./components/LoadingSkeleton";
import StaffRoles from "./components/StaffRoles";
import CustomModalFullPage from "@/app/components/CustomModalFullpage";
import Input from "@/app/components/Input";
import { fetchPermissions,addRoleToExistingDocument,fetchRoles, subscribeRoles } from "./data-fetching";

import { Kitchen, User } from "@/app/src/types";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
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
const initialPermissions: any[] = [
  { label: "Basic transacting", enabled: false },
  { label: "Enhanced transacting", enabled: false },
  { label: "Enhanced cash draw access", enabled: false },
  { label: "Manage menu", enabled: false },
  { label: "Reporting", enabled: false },
  { label: "POS Configuration", enabled: false },
  { label: "Online Ordering Control", enabled: false },
];


const Permissions = () => {
  const [loading, setLoading] = useState(false);
  const [editRoleModalOpen, setEditRoleModalOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState<any>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [ownerRoleModal, setOwnerRoleModal]=useState<any>();
  const [formState, setFormState] = useState<{ [key: string]: string }>({
    businessName: "",
    businessAddress: "",
    ownerEmail: "",
    ownerMobile: "",
    secondaryContactName: "",
    secondaryContactEmail: "",
    secondaryContacts: "",
  });

  interface RoleInfo {
    role: string;
    access: string;
    staff: number;
  }
  
  const [addNewRoleModalOpen, setAddNewRoleModalOpen] = useState(false);
  const [permissions, setPermissions] = useState(initialPermissions);
  const [newRoleName, setNewRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]); // Track selected permissions by index
  const [roles, setRoles] = useState<RoleInfo[]>([]);

  const [ownerDetials,setOwnerDetails]=useState<any>()



  console.log("the roles ",roles)

  const handleEditRole = (role:any) => {
    setRoleToEdit({
      ...role,
      originalName: role.name, 
    });
    setSelectedPermissions(
      role.permissions.map((p:any) =>
        permissions.findIndex((permission) => permission.label === p.name)
      )
    );
    setEditRoleModalOpen(true);
  };
  const handleRoleNameChange = (e:any) => {
    setRoleToEdit((prev:any) => ({
      ...prev,
      name: e.target.value,
    }));
  };
  const handleDeleteRole = async () => {
    if (!roleToEdit) return;

    try {
      const roleDocRef = doc(db, "roles", "be34pww7m5fy9yw9arvtcnmpkpbl");
      const roleSnapshot = await getDoc(roleDocRef);
      if (roleSnapshot.exists()) {
        const rolesData = roleSnapshot.data().roles || [];
        const updatedRoles = rolesData.filter(
          (r: any) => r.name !== roleToEdit.name
        );
        await updateDoc(roleDocRef, { roles: updatedRoles });
      }
      setEditRoleModalOpen(false);
      setRoleToEdit(null);
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  const handleEditSubmit = async () => {
    if (!roleToEdit) return;
  
    try {
      const updatedPermissions = selectedPermissions.map(index => {
        const permission = permissions[index];
        return permission ? {
          name: permission.label,
          description: permission.description,
        } : null;
      }).filter(Boolean);
  
      const combinedDescriptions = updatedPermissions.map((permission:any) => permission.name).join(", ");
  
      const updatedRole = {
        ...roleToEdit,
        permissions: updatedPermissions,
        description: combinedDescriptions || "No description", // Update the role description
      };
  
      const roleDocRef = doc(db, "roles", "be34pww7m5fy9yw9arvtcnmpkpbl");
      const roleSnapshot = await getDoc(roleDocRef);
  
      if (roleSnapshot.exists()) {
        const rolesData = roleSnapshot.data().roles || [];
        const updatedRoles = rolesData.map((r: any) =>
          r.name === roleToEdit.originalName ? updatedRole : r
        );
  
        // Update the roles document
        await updateDoc(roleDocRef, { roles: updatedRoles });
        setRoles(updatedRoles);
        console.log("Role updated successfully:", updatedRole);
      } else {
        console.error("Roles document not found");
      }
  
      // Close the modal and clear role to edit
      setEditRoleModalOpen(false);
      setRoleToEdit(null);
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

  

  useEffect(() => {
    const unsubscribePermissions = fetchPermissions((fetchedPermissions:any) => {
      setPermissions(
        fetchedPermissions.map((permission:any) => ({
          label: permission.name,
          description: permission.description,
          enabled: false,
        }))
      );
    });

    const unsubscribeRoles = subscribeRoles(({ rolesList, ownerDetails }:any) => {
      setRoles(rolesList);
      setOwnerDetails(ownerDetails);
    });

    return () => {
      unsubscribePermissions();
      unsubscribeRoles();
    };
  }, []);





  useEffect(() => {
    const fetchRolesData = async () => {
      try {
        const { rolesList, ownerDetails } = await fetchRoles(permissions);
        setRoles(rolesList);
        setOwnerDetails(ownerDetails);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      }
    };

    fetchRolesData();
  }, [permissions]);
  


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});
    
    if (!newRoleName.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, businessName: "Role name is required" }));
      return;
    }
    
    if (selectedPermissions.length === 0) {
      setErrors((prevErrors) => ({ ...prevErrors, permissions: "At least one permission is required" }));
      return;
    }
    
    try {
      const roleDocRef = doc(db, "roles", "be34pww7m5fy9yw9arvtcnmpkpbl");
      const roleSnapshot = await getDoc(roleDocRef);
      
      if (roleSnapshot.exists()) {
        const rolesData = roleSnapshot.data().roles || [];
        const roleExists = rolesData.some((role: any) => role.name.toLowerCase() === newRoleName.trim().toLowerCase());
        if (roleExists) {
          setErrors((prevErrors) => ({ ...prevErrors, businessName: "Role name already exists" }));
          return;
        }
      }
      
      const selectedPermissionDetails = selectedPermissions.map(index => permissions[index]);
      const combinedDescriptions = selectedPermissionDetails.map(permission => permission.label).join(", ");
  console.log("the secelted degails",selectedPermissionDetails)
      const newRole = {
        name: newRoleName,
        description: combinedDescriptions || "No description",
        permissions: selectedPermissions.map((index) => ({
          id: permissions[index].id,
          name: permissions[index].label,
          description: permissions[index].description || "No description available", // Ensure description is set
        })),
      };
      
      await addRoleToExistingDocument(newRole);
  
      setAddNewRoleModalOpen(false);
      setNewRoleName("");
      setSelectedPermissions([]);
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

  const viewRoleModal =()=>{
    setOwnerRoleModal(true);
  }

  return (
    <>
      <div className={styles.main_container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>POS Permissions</h1>
          <button
            className={styles.buttonPrimary}
            onClick={() => setAddNewRoleModalOpen(true)}
          >
            <span style={{ marginRight: "10px" }}>{plusIcon}</span>
            New Role{" "}
          </button>
        </div>
        <StaffRoles  viewModal={viewRoleModal}  roles={roles}  onEditRole={handleEditRole}/>
        {addNewRoleModalOpen && (
          <CustomModalFullPage
            show={addNewRoleModalOpen}
            onClose={() => {
              setAddNewRoleModalOpen(false);
            }}
            type="add"
            title={newRoleName ? newRoleName :"Add New Role"}
            onUpdateClick={handleSubmit}
            onDeleteClick={() => {}}

            content={
              <>
                <form className={styles.formContainer}>
                  <label>Role Name</label>
                  <Input
                    value={newRoleName}
                    handleInputChange={(e) => setNewRoleName(e.target.value)}
                    // handleBlurField={handleBlurField} // If needed
                    error={errors.businessName}
                    loading={loading}
                    placeholder="Enter New Role Name"
                  />

                  <h2  className={styles.ownerpermission}>POS Role Permissions</h2>
                  <ul>
                    {permissions.map((permission, index) => (
                      <li key={index} className={styles.permissionItem}>
                      <label className={styles.permissionsSection}>
                          <div>
                            <p className={styles.name}>{permission.label}</p>
                            <p className={styles.description}>{permission.description}</p>
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
                  <p style={{ color: "#F04438",textAlign:'center' }}> {errors.permissions}</p>
                 

                
                </form>
              </>
            }
          />
        )}
{/* ___________________________ */}


{ownerRoleModal && ownerDetials && ownerDetials.name && (
  <CustomModalFullPage
    show={true}
    onClose={() => setOwnerRoleModal(null)}
    type="view"
    title="Owner"
    onUpdateClick={() => {}}
    onDeleteClick={() => {}}

    content={
      <div className={styles.formContainer}>
        {/* <h2>Role: {ownerDetials.name}</h2> */}
        <h2 className={styles.roleHeading}>Role Name</h2>
        <input type="text"  value={ownerDetials.name} className={styles.readOnlyInput} readOnly/>
        <p className={styles.warningMsg}>This role name cannot be change</p>
        <h2 className={styles.ownerpermission}>Owners have full access. Permissions can’t be changed. </h2>
        <ul className={styles.disabled}>
          {(ownerDetials.permissions || []).map((permission: any, index: any) => (
            <li key={index} className={styles.permissionItem}>
              <label className={styles.permissionsSection}>
                <div>
                  <p className={styles.name}>{permission.name}</p>
                  <p className={styles.description}>{permission.description}</p>
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
          ))}
        </ul>
      </div>
    }
  />
)}


{editRoleModalOpen && roleToEdit && (
          <CustomModalFullPage
            show={editRoleModalOpen}
            onClose={() => setEditRoleModalOpen(false)}
            type="edit"
            title={roleToEdit.name}
            updateButtonText="Update Role"
            
            onUpdateClick={handleEditSubmit}
            onDeleteClick={handleDeleteRole}

            content={
              <div className={styles.formContainer}>

                <h2>Role Name </h2>

                <Input

                value={roleToEdit.name}

                handleInputChange={handleRoleNameChange}

                error={errors.roleName}

                loading={loading}

                placeholder="Enter Role Name"

                />
                
                {/* <input type="text"  value={roleToEdit.name} className={styles.readOnlyInput} /> */}

                <h2 className={styles.ownerpermission}>POS Role Permissions</h2>
                <ul className={styles.internalContainer}>
                  {permissions.map((permission, index) => (
                    <li key={index} className={styles.permissionItem}>
                      <label className={styles.permissionsSection}>
                        <div>
                          <p className={styles.name}>{permission.label}</p>
                          <p className={styles.description}>{permission.description}</p>
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
              </div>
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
