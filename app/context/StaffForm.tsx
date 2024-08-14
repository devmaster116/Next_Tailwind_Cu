import { createContext, useEffect, useReducer, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

type Field = {
  value: string;
  hasError: boolean;
  errorMessage: string;
}

const initialState = {
  value: '',
  hasError: false,
  errorMessage: ''
}

type FormContextData = {
  firstNameField: Field;
  dispatchFirstNameField: React.Dispatch<any>;
  lastNameField: Field;
  dispatchLastNameField: React.Dispatch<any>;
  displayNameField: Field;
  dispatchDisplayNameField: React.Dispatch<any>;
  emailField: Field;
  dispatchEmailField: React.Dispatch<any>;
  phoneNumberField: Field;
  dispatchPhoneNumberField: React.Dispatch<any>;
  isYearly: boolean;
  setIsYearly: React.Dispatch<React.SetStateAction<boolean>>;
  selectedPlan: Plan;
  setSelectedPlan: React.Dispatch<React.SetStateAction<Plan>>;

  assignRole: Field
  setAssignRole: React.Dispatch<any>;
  clearForm: () => void;
}

export const FormContext = createContext({
  firstNameField: initialState,
  dispatchFirstNameField: () => {},
  lastNameField: initialState,
  dispatchLastNameField: () => {},
  displayNameField: initialState,
  dispatchDisplayNameField: () => {},
  emailField: initialState,
  dispatchEmailField: () => {},
  phoneNumberField: initialState,
  dispatchPhoneNumberField: () => {},
  isYearly: false,
  setIsYearly: () => {},
  selectedPlan: null as any,
  setSelectedPlan: () => {},
  assignRole: initialState,
  setAssignRole: () => {},
  clearForm: () => {}
} as FormContextData);

export const ACTIONS = {
  SET_VALUE: 'SET_VALUE',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
}

function handleFormState(
  state: Field,
  action: any
) {
  switch (action.type) {
    case ACTIONS.SET_VALUE:
      return {
        ...state,
        value: action.value,
        hasError: false,
        errorMessage: ''
      }
    case ACTIONS.SET_ERROR:
      return {
        ...state,
        hasError: true,
        errorMessage: action.errorMessage
      }
    case ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: '',
        hasError: false
      }
    default:
      return state
  }
}

export type Plan = {
  name: string;
  price: number
}

interface FormProviderProps {
  children: React.ReactNode;
}

export const FormProvider = ({ children }: FormProviderProps) => {
  //user-info
  const [firstNameField, dispatchFirstNameField] = useReducer(handleFormState, initialState)
  const [lastNameField, dispatchLastNameField] = useReducer(handleFormState, initialState)
  const [displayNameField, dispatchDisplayNameField] = useReducer(handleFormState, initialState)
  const [emailField, dispatchEmailField] = useReducer(handleFormState, initialState)
  const [phoneNumberField, dispatchPhoneNumberField] = useReducer(handleFormState, initialState)

  // Plan
  const [isYearly, setIsYearly] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan>(null as any);

  // assign-role
  const [assignRole, setAssignRole] =  useReducer(handleFormState, initialState)

  const { getValueFromLocalStorage, removeValueFromLocalStorage } = useLocalStorage()

  function clearForm() {
    removeValueFromLocalStorage('user-info')
    removeValueFromLocalStorage('user-photo')
    removeValueFromLocalStorage('user-role')
    removeValueFromLocalStorage('user-sign-code')

    dispatchFirstNameField({ type: ACTIONS.SET_VALUE, value: '' })
    dispatchLastNameField({ type: ACTIONS.SET_VALUE, value: '' })
    dispatchDisplayNameField({ type: ACTIONS.SET_VALUE, value: '' })
    dispatchEmailField({ type: ACTIONS.SET_VALUE, value: '' })
    dispatchPhoneNumberField({ type: ACTIONS.SET_VALUE, value: '' })
    setIsYearly(false)
    setSelectedPlan(null as any)
    setAssignRole({ type: ACTIONS.SET_VALUE, value: '' })
  }

  useEffect(() => {
    const userInfoFromLocalStorage = getValueFromLocalStorage('user-info')
    if (userInfoFromLocalStorage) {
      dispatchFirstNameField({ type: ACTIONS.SET_VALUE, value: userInfoFromLocalStorage.firstName })
      dispatchLastNameField({ type: ACTIONS.SET_VALUE, value: userInfoFromLocalStorage.lastName })
      dispatchDisplayNameField({ type: ACTIONS.SET_VALUE, value: userInfoFromLocalStorage.lastName })
      dispatchEmailField({ type: ACTIONS.SET_VALUE, value: userInfoFromLocalStorage.email })
      dispatchPhoneNumberField({ type: ACTIONS.SET_VALUE, value: userInfoFromLocalStorage.phoneNumber })
    }

    const planFromLocalStorage = getValueFromLocalStorage('plan')
    if (planFromLocalStorage) {
      setSelectedPlan(planFromLocalStorage.name)
      setIsYearly(planFromLocalStorage.isYearly)
    }

    const addOnsFromLocalStorage = getValueFromLocalStorage('user-role')
    if (addOnsFromLocalStorage) {
      setAssignRole(addOnsFromLocalStorage)
    }
  }, [])

  const value = {
    firstNameField,
    dispatchFirstNameField,
    lastNameField,
    dispatchLastNameField,
    displayNameField,
    dispatchDisplayNameField,
    emailField,
    dispatchEmailField,
    phoneNumberField,
    dispatchPhoneNumberField,
    isYearly,
    setIsYearly,
    selectedPlan,
    setSelectedPlan,
    assignRole,
    setAssignRole,
    clearForm
  }

  return (
    <FormContext.Provider value={{ ...value }}>
      {children}
    </FormContext.Provider>
  );
};
