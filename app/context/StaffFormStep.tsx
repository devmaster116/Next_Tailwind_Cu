"use client";
import { createContext, useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

type FormStepContextData = {
  currentStep: number;
  setCurrentStep: (status: number) => void;
  
  statusModal: boolean
  setStatusModal: (status: boolean) => void;

  steps: { title: string; number: number }[];
  handleNextStep: () => void;
  handlePreviousStep: () => void;
  handleSave:()=>void;
  handleClose:()=>void;
  moveToStep(step: number): void;
}

export const FormStepContext = createContext<FormStepContextData>({
  currentStep: 1,
  setCurrentStep: () =>{},

  statusModal: false,
  setStatusModal: () =>{},

  steps: [],
  handleNextStep: () => {},
  handlePreviousStep: () => {},
  moveToStep: () => {},
  handleSave:()=>{},
  handleClose:()=>{},
} as FormStepContextData);

interface FormStepProviderProps {
  children: React.ReactNode;
}

export const FormStepProvider = ({ children }: FormStepProviderProps) => {
  
  const [currentStep, setCurrentStep] = useState(1);
  
  const [statusModal, setStatusModal] = useState(false);
  
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
    };

    const handlePreviousStep = () => {
      const newStepValue = currentStep - 1;
        setCurrentStep(newStepValue);
      // }
    };

    const handleSave = () => {
      setStatusModal(false);
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
        statusModal,
        setStatusModal,
        setCurrentStep, 
        handleNextStep, 
        handlePreviousStep,
        handleSave,
        handleClose,
        moveToStep 
      }}>
      {children}
    </FormStepContext.Provider>
  );
};
