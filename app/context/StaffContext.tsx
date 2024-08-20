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

};

export type FormAction =
  | { type: 'SET_USER_INFO'; payload: Partial<ConfigStaffMember> }
  | { type: 'SET_PROFILE_IMAGE_URL'; payload: string }
  | { type: 'SET_USER_ROLE'; payload: string }
  | { type: 'SET_USER_ROLE_ID'; payload: string }
  | { type: 'SET_PASSCODE'; payload: string }
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
  // const [selectStaff, setSelectStaff] = useState<ConfigStaffMember[]>([]);
  
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
    useEffect(() => {
      getStaffRole(); 
    }, []);
  return (
    <FormContext.Provider value={{ state, roles,dispatch , resetForm,saveStaffToFirebase,getStaffRole}}>
      {children}
    </FormContext.Provider>
  );
};


