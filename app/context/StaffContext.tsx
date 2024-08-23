"use client"
import React, { createContext, useReducer,useState,useEffect } from 'react';
import { ConfigStaffMember,RoleInfo}  from "../src/types";
import {doc,setDoc,collection,getDocs,getDoc ,updateDoc} from "firebase/firestore";
import { auth, db } from "@/firebase/config";

export type FormContextType = {
  state: ConfigStaffMember;
  roles:RoleInfo[];
  dispatch: React.Dispatch<FormAction>;
  saveStaffToFirebase: () => Promise<void>; 
  getStaffRole: () => Promise<void>; 
  resetForm: () => void;
  currentStaff: ConfigStaffMember | null;
  loadStaffForEdit: (staff: ConfigStaffMember) => void;
  updateStaffInFirebase: (updatedStaff: ConfigStaffMember, kitchenId: string | any ) => Promise<void>;
};

export type FormAction =
  | { type: 'SET_USER_INFO'; payload: Partial<ConfigStaffMember> }
  | { type: 'SET_PROFILE_IMAGE_URL'; payload: string }
  | { type: 'SET_USER_ROLE'; payload: string }
  | { type: 'SET_USER_ROLE_ID'; payload: string }
  | { type: 'SET_PASSCODE'; payload: string }
  | { type: 'SET_CURRENT_STAFF'; payload: ConfigStaffMember | null }
  | { type: 'RESET_FORM' };

const initialState: ConfigStaffMember = {
  firstName: '',
  lastName: '',
  displayName: '',
  email: '',
  phoneNumber: '',
  displayImageURL: '',
  roleName: '',
  roleID:'',
  passcode: '',
};

export const FormContext = createContext<FormContextType | undefined>(undefined);

const formReducer = (state: ConfigStaffMember, action: FormAction): ConfigStaffMember => {
  switch (action.type) {
    case 'SET_USER_INFO' :
      return { ...state, ...action.payload };
    case 'SET_PROFILE_IMAGE_URL':
      return { ...state, displayImageURL: action.payload };
    case 'SET_USER_ROLE':
      return { ...state, roleName: action.payload };
      case 'SET_USER_ROLE_ID':
      return { ...state, roleID: action.payload };
    case 'SET_PASSCODE':
      return { ...state, passcode: action.payload };
    case 'RESET_FORM':
      return initialState; // Reset to initial stat
    default:
      return state;
  }
};

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [roles, setRoles] = useState<RoleInfo[]>([]);
  const [currentStaff, setCurrentStaff] = useState<ConfigStaffMember | null>(null);
    const saveStaffToFirebase = async () => {


    };
    const resetForm = () => {
      dispatch({ type: 'RESET_FORM' });
    };
    const getStaffRole = async () => {
        try {
          const rolesCollection = collection(db, "roles"); // Replace "roles" with your collection name
          const rolesSnapshot = await getDocs(rolesCollection);
          const _configs: RoleInfo[] = []
          rolesSnapshot.docs.forEach(data => {
            _configs.push(data.data().roles as RoleInfo)
          })
          setRoles(Array.isArray(_configs[0]) ? _configs[0] : []);
       
        } catch (error) {
          console.error("Error fetching roles: ", error);
        }

    };
   
      // Load staff data for editing and populate form
  const loadStaffForEdit = (staff: ConfigStaffMember) => {

    dispatch({ type: 'SET_CURRENT_STAFF', payload: staff });
    setCurrentStaff(staff);
  };

  const updateStaffInFirebase = async (updatedStaff: ConfigStaffMember,kitchenId:string) => {
  
    try {
      if (!kitchenId) {
         console.error("Kitchen ID is required but was not provided.");
         return;
       }

     const configDocRef = doc(db, "configs", kitchenId);
     // Retrieve the document and destructure the necessary data
     const configDoc = await getDoc(configDocRef);
     if (!configDoc.exists()) {
         console.log("Config document does not exist!");
         return;
     }
 
     const { staffMemberConfigs = {} } = configDoc.data();
     const { staffMembers = [] } = staffMemberConfigs;
     const existingStaffIndex = staffMembers.findIndex(
      (member: { passcode: string; }) => member.passcode === updatedStaff.passcode
  );

      if (existingStaffIndex !== -1) {
            // Staff member exists, update the data
            staffMembers[existingStaffIndex] = updatedStaff;
            console.log("Existing staff member updated successfully!");
        } else {
            // Add new staff member if no match found
            // staffMembers = [...staffMembers, updatedStaff];
            console.log("New staff member added successfully!");
        }
     // Update the document with the new staff member and other config settings
     await updateDoc(configDocRef, {
         "staffMemberConfigs.staffMembers": staffMembers,
         "staffMemberConfigs.enabled": true,
         "staffMemberConfigs.idleTime": 0,
         "staffMemberConfigs.passcodeEnabled": true,
     });
 
     console.log("New staff member added successfully!");
 } catch (error) {
     console.error("Error adding new staff member:", error);
 }
    // if (updatedStaff && updatedStaff.email) {
    //   const staffDoc = doc(db, "staff", updatedStaff.email); // Assuming email is unique
    //   await updateDoc(staffDoc, updatedStaff);
    // }
  };
  useEffect(() => {
    getStaffRole(); 
  }, []);
  return (
    <FormContext.Provider value={{ state, roles,dispatch ,currentStaff,   loadStaffForEdit,
      updateStaffInFirebase,resetForm,saveStaffToFirebase,getStaffRole}}>
      {children}
    </FormContext.Provider>
  );
};


