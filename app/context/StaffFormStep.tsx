"use client";
import { createContext, useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

type FormStepContextData = {
  currentStep: number;
  setCurrentStep: (status: number) => void;

  stepInvalid: boolean
  setStepInvalid: (status: boolean) => void;
  
  statusModal: boolean
  setStatusModal: (status: boolean) => void;

  pageKey:number;
  setPageKey: (status: number) => void;

  statusAddStaff: boolean
  setStatusAddStaff: (status: boolean) => void;

  steps: { title: string; number: number }[];
  handleNextStep: () => void;
  handlePreviousStep: () => void;
  // handleSave:()=>void;
  handleClose:()=>void;
  moveToStep(step: number): void;

  nextClicked: boolean 
  setNextClicked: (_clicked: boolean) => void

  updateUserInfoClicked: boolean 
  setUpdateUserInfoClicked: (_clicked: boolean) => void

  updateUserRoleClicked: boolean 
  setUpdateUserRoleClicked: (_clicked: boolean) => void

  updateUserCodeClicked: boolean 
  setUpdateUserCodeClicked: (_clicked: boolean) => void
}

export const FormStepContext = createContext<FormStepContextData>({
  currentStep: 1,
  setCurrentStep: () =>{},

  pageKey:1,
  setPageKey: () => {},

  stepInvalid: false,
  setStepInvalid: () =>{},

  statusModal: false,
  setStatusModal: () =>{},

  nextClicked: false,
  setNextClicked: () => {},

  updateUserRoleClicked: false,
  setUpdateUserRoleClicked: () => {},

  updateUserInfoClicked: false,
  setUpdateUserInfoClicked: () => {},

  updateUserCodeClicked: false,
  setUpdateUserCodeClicked: () => {},

  statusAddStaff: false,
  setStatusAddStaff: () =>{},
  steps: [],
  handleNextStep: () => {},
  handlePreviousStep: () => {},
  moveToStep: () => {},
  // handleSave:()=>{},
  handleClose:()=>{},
} as FormStepContextData);

interface FormStepProviderProps {
  children: React.ReactNode;
}

export const FormStepProvider = ({ children }: FormStepProviderProps) => {
  
  const [currentStep, setCurrentStep] = useState(1);
  const [pageKey, setPageKey] = useState(1);
  const [statusModal, setStatusModal] = useState(false);
  const [stepInvalid, setStepInvalid] = useState(false);
  const [nextClicked, setNextClicked] = useState(false)
  const [updateUserInfoClicked, setUpdateUserInfoClicked] = useState(false)
  const [updateUserRoleClicked, setUpdateUserRoleClicked] = useState(false)
  const [updateUserCodeClicked, setUpdateUserCodeClicked] = useState(false)

  // const [editUserInfoStatusModal, setEditUserInfoStatusModal] = useState(false);
  // const [editUserRoleStatusModal, setEditUserRoleStatusModal] = useState(false);
  // const [editUserSignCodeStatusModal, setEditUserSignCodeStatusModal] = useState(false);
  
  const [statusAddStaff, setStatusAddStaff] =useState(false)
  const [steps, _] = useState([
    { title: 'Profile', number: 1 },
    { title: 'Add Prfile Photo', number: 2 },
    { title: 'Assign Role', number: 3 },
    { title: 'Generate Code', number: 4 },
  ])

    const handleNextStep = () => {
      const newStepValue = currentStep + 1;
      if (currentStep < steps.length) {
        setCurrentStep(newStepValue);
      };
      if(currentStep==steps.length){
        // setStatusModal(false);

        setStatusAddStaff(true);
  
        setCurrentStep(1);
      }
    };

    const handlePreviousStep = () => {
  
        const newStepValue = currentStep - 1;
      
        setCurrentStep(newStepValue);
    };

    const handleSave = () => {
    
      setStatusModal(false);

      setStatusAddStaff(true);

      setCurrentStep(1);
    };
    const handleClose = () => {
      setCurrentStep(1);
      setStatusModal(false);
  };

    const moveToStep = (step: number) => {
      setCurrentStep(step);
    }

  return (
    <FormStepContext.Provider 
      value={{ 
        steps,
        currentStep, 
        setStatusAddStaff,
        pageKey,
        setPageKey,
        updateUserInfoClicked,
        setUpdateUserInfoClicked,
        updateUserRoleClicked,
        setUpdateUserRoleClicked,
        updateUserCodeClicked,
        setUpdateUserCodeClicked,
        stepInvalid,
        setStepInvalid,
        statusModal,
        setStatusModal,
        statusAddStaff,
        setCurrentStep, 
        handleNextStep, 
        handlePreviousStep,
        // handleSave,
        handleClose,
        moveToStep,
        nextClicked, 
        setNextClicked
      }}>
      {children}
    </FormStepContext.Provider>
  );
};
