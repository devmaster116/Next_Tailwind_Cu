"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { RoleInfo, User } from "../src/types";

interface StaffContextType {
  allUserInfo: User[];
  setAllUserInfo: Dispatch<SetStateAction<User[]>>;
  
  userPhoto: any;
  setUserPhoto: Dispatch<SetStateAction<any>>;

  userRole: RoleInfo[];
  setUserRole: Dispatch<SetStateAction<RoleInfo[]>>;
  
  userCode: any;
  setUserCode: Dispatch<SetStateAction<any>>;
  
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  
  error: boolean;
  setError: Dispatch<SetStateAction<boolean>>;
}

const StaffContext = createContext<StaffContextType | undefined>(
  undefined
);

export const StaffProvider = ({ children }: { children: ReactNode }) => {
  const [allUserInfo, setAllUserInfo] = useState<User[]>([]);
  const [userPhoto, setUserPhoto] = useState<any>([]);
  const [userRole, setUserRole] = useState<RoleInfo[]>([]);
  const [userCode, setUserCode] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useState(false);
  return (
    <StaffContext.Provider
      value={{
        allUserInfo,
        setAllUserInfo,
        userPhoto,
        setUserPhoto,
        userRole,
        setUserRole,
        userCode,
        setUserCode,
        loading,
        setLoading,
        error,
        setError
      }}
    >
      {children}
    </StaffContext.Provider>
  );
};

export const useStaffContext = (): StaffContextType => {
  const context = useContext(StaffContext);
  if (!context) {
    throw new Error(
      "useStaffContext must be used within a StaffProvider"
    );
  }
  return context;
};
