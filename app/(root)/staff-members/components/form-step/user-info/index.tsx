import { Fragment } from "react";
import Form from "../../../components/form";
import { useFormStep } from "@/app/hooks/useFormStep";
import { useForm } from "@/app/hooks/useForm";
import { ACTIONS } from "@/app/context/StaffForm";
import { TextInput } from "../../form/TextInput";
import { StaffModalHeader } from "../../header";

export function UserInfo() {
  const {
    firstNameField,
    dispatchFirstNameField,
    lastNameField,
    dispatchLastNameField,
    emailField,
    dispatchEmailField,
    phoneNumberField,
    dispatchPhoneNumberField
  } = useForm()

  const { handleNextStep, handlePreviousStep } = useFormStep()

  function validateForm() {
    let formHasError = false

    if (!firstNameField.value) {
      dispatchFirstNameField({ type: ACTIONS.SET_ERROR, errorMessage: 'Please enter a valid first name' })
      formHasError = true
    }

    if (!lastNameField.value) {
      dispatchLastNameField({ type: ACTIONS.SET_ERROR, errorMessage: 'Please enter a valid Last name' })
      formHasError = true
    }
    if (!emailField.value) {
      dispatchEmailField({ type: ACTIONS.SET_ERROR, errorMessage: 'Email is required' })
      formHasError = true
    } else {
      const emailRegex = /\S+@\S+\.\S+/
      if (!emailRegex.test(emailField.value)) {
        dispatchEmailField({ type: ACTIONS.SET_ERROR, errorMessage: 'Email is invalid' })
        formHasError = true
      }
    }

    if (!phoneNumberField.value) {
      dispatchPhoneNumberField({ type: ACTIONS.SET_ERROR, errorMessage: 'Phone number is required' })
      formHasError = true
    } else {
      if (phoneNumberField.value.length < 6) {
        dispatchPhoneNumberField({ type: ACTIONS.SET_ERROR, errorMessage: 'Phone number is invalid' })
        formHasError = true
      }
    }

    return !formHasError
  }

  function handleGoForwardStep() {
    const isValid = validateForm()
    if (!isValid) {
      handleNextStep()
    }
  }

  return (
    <div>
      <StaffModalHeader 
        title={'Add Staff Member'}
        handleGoForwardStep={handleGoForwardStep}
        handleGoBack={handlePreviousStep}
      />
      <Fragment>
        {/* <Form.Card> */}
          <Form.Header
            title="Profile"
            description="Add your staff members name,nickname, email addres and mobile number."
          />

          <div className="mt-5 flex">
            <TextInput
              label="First Name"
              placeholder="Enter first name"
              value={firstNameField.value}
              onChange={(value: string) => {

              }}
              errorMessage={firstNameField.errorMessage}
              clearError={() => dispatchFirstNameField({ type: ACTIONS.CLEAR_ERROR })}
              hasError={firstNameField.hasError}
            />
            <TextInput
              label="Last Name"
              placeholder="Enter lirst name"
              value={lastNameField.value}
              onChange={(value: string) => dispatchLastNameField({ type: ACTIONS.SET_VALUE, value })}
              errorMessage={lastNameField.errorMessage}
              clearError={() => dispatchLastNameField({ type: ACTIONS.CLEAR_ERROR })}
              hasError={lastNameField.hasError}
            />
            <TextInput
              label="Email Address"
              placeholder="Enter last name"
              value={emailField.value}
              onChange={(value: string) => dispatchEmailField({ type: ACTIONS.SET_VALUE, value })}
              errorMessage={emailField.errorMessage}
              clearError={() => dispatchEmailField({ type: ACTIONS.CLEAR_ERROR })}
              hasError={emailField.hasError}
            />
            <TextInput
              label="Phone Number"
              placeholder="Enter mobile number"
              value={phoneNumberField.value}
              onChange={(value: string) => dispatchPhoneNumberField({ type: ACTIONS.SET_VALUE, value })}
              errorMessage={phoneNumberField.errorMessage}
              clearError={() => dispatchPhoneNumberField({ type: ACTIONS.CLEAR_ERROR })}
              hasError={phoneNumberField.hasError}
            />
          </div>
        {/* </Form.Card> */}
      </Fragment>
    </div>
  )
} 